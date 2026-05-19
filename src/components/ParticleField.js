import { useEffect, useRef, useCallback } from 'react';
import { createNoise2D } from 'simplex-noise';

const TILT      = 0.45;
const R_RATIO   = 0.30;
const RIBBON_W  = 0.14;   // half-width of ribbon (radial direction)
const RIBBON_T  = 0.032;  // half-thickness of ribbon (axial direction — keep thin)

const CURSOR_RADIUS = 120;
const CURSOR_FORCE  = 0.020;

// Slow, contemplative orbit — ~7 seconds per full ring loop
const ORBIT_DRIVE = 0.0017;
const TUBE_DRIVE  = ORBIT_DRIVE * 0.55;
const DAMPING     = 0.91;
const DU_SS       = ORBIT_DRIVE / (1 - DAMPING);

function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeNoise(seed) { return createNoise2D(mulberry32(seed)); }

const cosPhi = Math.cos(TILT);
const sinPhi = Math.sin(TILT);

// Spawn with near-steady-state velocity so particles move immediately
function spawnParticle(stagger = false) {
  return {
    u:    Math.random() * Math.PI * 2,
    v:    Math.random() * Math.PI * 2,
    du:   DU_SS * (0.7 + Math.random() * 0.6),
    dv:   DU_SS * TUBE_DRIVE / ORBIT_DRIVE * (0.7 + Math.random() * 0.6),
    life: stagger ? Math.random() : 1.0,
    age:  stagger ? Math.floor(Math.random() * 60) : 0,
  };
}

export default function ParticleField({ params, onMetricsUpdate }) {
  const canvasRef = useRef(null);
  const stateRef  = useRef({
    particles: [],
    noise2D:   makeNoise(81271),
    time:      0,
    mouse:     { x: -9999, y: -9999 },
    animFrame: null,
    params,
  });

  useEffect(() => { stateRef.current.params = params; }, [params]);
  useEffect(() => { stateRef.current.noise2D = makeNoise(params.seed); }, [params.seed]);

  const rebuildParticles = useCallback((count) => {
    const arr = [];
    for (let i = 0; i < count; i++) arr.push(spawnParticle(true));
    return arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      canvas.getContext('2d').scale(dpr, dpr);
      const count = Math.floor(stateRef.current.params.density * 3800);
      stateRef.current.particles = rebuildParticles(count);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [rebuildParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onMove  = (e) => {
      const r = canvas.getBoundingClientRect();
      stateRef.current.mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => { stateRef.current.mouse = { x: -9999, y: -9999 }; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    return () => { canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('mouseleave', onLeave); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const s   = stateRef.current;
    let frameCount = 0;

    const draw = () => {
      const { density, flow, noise, decay } = s.params;
      const w  = canvas.offsetWidth, h = canvas.offsetHeight;
      const cx = w / 2, cy = h / 2;
      const scale = Math.min(w, h);
      const R  = scale * R_RATIO;
      const rW = scale * RIBBON_W;   // radial half-width
      const rT = scale * RIBBON_T;   // axial half-thickness

      const targetCount = Math.floor(density * 3800);
      while (s.particles.length < targetCount) s.particles.push(spawnParticle(false));
      if (s.particles.length > targetCount) s.particles.length = targetCount;

      ctx.clearRect(0, 0, w, h);

      const decayRate  = 0.00035 + (1 - decay) * 0.0012;
      const orbitDrive = ORBIT_DRIVE * flow;
      const tubeDrive  = TUBE_DRIVE  * flow;
      // Noise primarily drives v (tube cross-section) → creates the fingerprint whorls
      const noiseU     = noise * 0.008;
      const noiseV     = noise * 0.022;
      const buckets    = [0, 0, 0];

      for (let i = 0; i < s.particles.length; i++) {
        const p = s.particles[i];

        // ── 1. Project current (u,v) to screen ──────────────────────
        // Ribbon cross-section: wide in radial (cosV * rW), thin in axial (sinV * rT)
        const cosU = Math.cos(p.u), sinU = Math.sin(p.u);
        const cosV = Math.cos(p.v), sinV = Math.sin(p.v);
        const x = cx + (R + rW * cosV) * cosU;
        const y = cy + (R + rW * cosV) * sinU * cosPhi - rT * sinV * sinPhi;

        // ── 2. Cursor deflection in parameter space ──────────────────
        const mdx   = x - s.mouse.x;
        const mdy   = y - s.mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < CURSOR_RADIUS && mdist > 0) {
          const f = (1 - mdist / CURSOR_RADIUS) * CURSOR_FORCE;
          p.du += f * Math.sign(mdx) * 0.8;
          p.dv += f * Math.sign(mdy) * 0.8;
        }

        // ── 3. Large-cell noise in (u,v) space ───────────────────────
        // Low spatial frequency → big coherent flow bands, not random jitter
        // nv dominates so turbulence is primarily in tube cross-section direction
        const nu = s.noise2D(p.u * 0.38 + s.time * 0.04, p.v * 0.32 + 3.1);
        const nv = s.noise2D(p.v * 0.38 + s.time * 0.035, p.u * 0.32);

        // ── 4. Drive + noise → dampen → integrate ────────────────────
        p.du = (p.du + orbitDrive + nu * noiseU) * DAMPING;
        p.dv = (p.dv + tubeDrive  + nv * noiseV) * DAMPING;
        p.u += p.du;
        p.v += p.dv;
        p.age++;

        // ── 5. Respawn ────────────────────────────────────────────────
        p.life -= decayRate;
        if (p.life <= 0) {
          const f = spawnParticle(false);
          p.u = f.u; p.v = f.v; p.du = f.du; p.dv = f.dv;
          p.life = 1.0; p.age = 0;
        }

        // ── 6. Draw — solid color, size encodes depth ────────────────
        // Depth from ring angle (dominant) + axial ribbon position (minor)
        const depth  = sinU * sinPhi * 0.80 + sinV * cosPhi * 0.20;
        const radius = 1.25 * (1.0 + depth * 0.70);
        const fadeIn  = Math.min(p.age / 30, 1.0);
        const fadeOut = p.life < 0.10 ? p.life / 0.10 : 1.0;
        const alpha   = fadeIn * fadeOut * 0.82;

        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.35, radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(26,25,23,${alpha.toFixed(3)})`;
        ctx.fill();

        buckets[Math.min(Math.floor((x / w) * 3), 2)]++;
      }

      s.time += 0.007;
      frameCount++;

      if (frameCount % 6 === 0 && onMetricsUpdate) {
        const total = s.particles.length || 1;
        onMetricsUpdate({ x: buckets[0]/total, y: buckets[1]/total, z: buckets[2]/total, count: s.particles.length });
      }

      s.animFrame = requestAnimationFrame(draw);
    };

    s.animFrame = requestAnimationFrame(draw);
    return () => { if (s.animFrame) cancelAnimationFrame(s.animFrame); };
  }, [onMetricsUpdate]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', backgroundColor: '#f6f4f0' }}
    />
  );
}
