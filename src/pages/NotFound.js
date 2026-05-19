import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const TILE_SIZE = 60;
const NAVBAR_H = 48;

const DANCE_FRAMES = [
  '(•_•)\n<) )╯\n /  \\',
  '(•_•)\n\\( (>\n /  \\',
  '(•_•)\n<) )╯\n /  \\',
];
const SCARED_FRAME = '(°▃°)\n-) )-\n/ /';
const FALL_FRAMES = [
  '  \\ / \n -| |-\n(☉▃°)',
  '  | | \n ~| |~\n(°▃⚆)',
  '  \\ / \n -| |-\n(•▃°)',
];
const SPLAT_FRAME = '(X_X)';

function getPinnedId(cols, rows, isMobile) {
  if (isMobile) {
    return (rows - 2) * cols + (cols - 2);
  } else {
    return Math.floor(rows * 0.65) * cols + (cols - 3);
  }
}


function useTiles() {
  const [tiles, setTiles] = useState([]);
  const [cols, setCols] = useState(0);
  const [rows, setRows] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function compute() {
      const mobile = window.innerWidth <= 640;
      const c = Math.ceil(window.innerWidth / TILE_SIZE);
      const r = Math.ceil((window.innerHeight - NAVBAR_H) / TILE_SIZE);
      setIsMobile(mobile);
      setCols(c);
      setRows(r);
      setTiles(Array.from({ length: c * r }, (_, i) => ({ id: i, gone: false })));
    }
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return { tiles, setTiles, cols, rows, isMobile };
}

export default function NotFound({ message } = {}) {
  const { tiles, setTiles, cols, rows, isMobile } = useTiles();
  const orderRef = useRef([]);
  const ontileRef = useRef(null);
  const [danceFrame, setDanceFrame] = useState(0);
  const [fallFrame, setFallFrame] = useState(0);
  const [phase, setPhase] = useState('dancing');
  // freeLeft/freeTop are the absolute page coords for the free dancer
  const [freeLeft, setFreeLeft] = useState(0);
  const [freeTop, setFreeTop]   = useState(0);
  const [slideLeft, setSlideLeft] = useState(0);
  const [slideTop, setSlideTop]   = useState(0);

  useEffect(() => {
    if (tiles.length === 0) return;
    const pinned = getPinnedId(cols, rows, isMobile);

    const order = Array.from({ length: tiles.length }, (_, i) => i)
      .filter(i => i !== pinned);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    orderRef.current = order;

    const total = order.length;
    const duration = 3200;
    const start = performance.now();
    const tailCount = Math.min(8, Math.floor(total * 0.04));
    const mainCount = total - tailCount;
    const timestamps = order.map((_, i) => {
      const t = i / mainCount;
      return (t * t * t) * duration * 0.82;
    });
    for (let i = mainCount; i < total; i++) {
      const t = (i - mainCount) / tailCount;
      timestamps[i] = duration * 0.82 + t * duration * 0.18;
    }

    let frameId;
    const tick = (now) => {
      const elapsed = now - start;
      setTiles(prev => {
        const copy = [...prev];
        let changed = false;
        order.forEach((id, i) => {
          if (!copy[id].gone && timestamps[i] <= elapsed) {
            copy[id] = { ...copy[id], gone: true };
            changed = true;
          }
        });
        return changed ? copy : prev;
      });
      if (elapsed < duration + 200) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    let f = 0;
    const danceInterval = setInterval(() => {
      f = (f + 1) % DANCE_FRAMES.length;
      setDanceFrame(f);
    }, 300);

    const t1 = setTimeout(() => {
      clearInterval(danceInterval);
      setPhase('tilting');

      const t2 = setTimeout(() => {
        setPhase('scared');

        const t3 = setTimeout(() => {
          // Read exact screen position of the on-tile dancer from DOM
          const rect = ontileRef.current?.getBoundingClientRect();
          const startLeft = rect ? rect.left + rect.width / 2 : 0;
          // free dancer uses translateY(-100%) so `top` = where its bottom sits.
          // rect.bottom is viewport coords; convert to page coords by subtracting NAVBAR_H.
          const startTop  = rect ? rect.bottom - NAVBAR_H : 0;

          setFreeLeft(startLeft);
          setFreeTop(startTop);
          setSlideLeft(startLeft);
          setSlideTop(startTop);
          setPhase('detached');

          // next paint: apply slide destination with transition
          requestAnimationFrame(() => requestAnimationFrame(() => {
            setPhase('sliding');
            setSlideLeft(startLeft - 90);
            setSlideTop(startTop + 18);
          }));

          const t4 = setTimeout(() => {
            setPhase('falling');
            const availH = window.innerHeight - NAVBAR_H;
            const floorTop = availH - 50;
            setSlideTop(floorTop);

            let ff = 0;
            const fallInterval = setInterval(() => {
              ff = (ff + 1) % FALL_FRAMES.length;
              setFallFrame(ff);
            }, 120);

            const t5 = setTimeout(() => {
              clearInterval(fallInterval);
              setPhase('splat');
            }, 1300);

            return () => { clearInterval(fallInterval); clearTimeout(t5); };
          }, 700);

          return () => clearTimeout(t4);
        }, 500);

        return () => clearTimeout(t3);
      }, 500);

      return () => clearTimeout(t2);
    }, duration + 4400);

    return () => {
      cancelAnimationFrame(frameId);
      clearInterval(danceInterval);
      clearTimeout(t1);
    };
  }, [cols, rows, isMobile, setTiles, tiles.length]);

  const pinnedId = getPinnedId(cols, rows, isMobile);
  const isTilted = phase !== 'dancing';
  const onTile = phase === 'dancing' || phase === 'tilting' || phase === 'scared';

  const dancerFrame =
    phase === 'splat'    ? SPLAT_FRAME :
    phase === 'falling'  ? FALL_FRAMES[fallFrame] :
    phase === 'sliding'  ? SCARED_FRAME :
    phase === 'detached' ? SCARED_FRAME :
    phase === 'scared'   ? SCARED_FRAME :
    DANCE_FRAMES[danceFrame];

  const isSliding = phase === 'sliding';
  const isFalling = phase === 'falling';

  return (
    <div className="not-found-page">
      <div className="not-found-message">
        <p className="not-found-text">
          {message || 'Sh#t!! You were so close but you fell on a 404 page instead...'}
          <br />
          <Link to="/" className="not-found-home">go home</Link>
        </p>
      </div>

      <div className="not-found-grid" style={{ '--grid-cols': cols, '--grid-rows': rows }}>
        {tiles.map((t, i) => (
          <div
            key={t.id}
            className={`not-found-tile${t.gone ? ' gone' : ''}${i === pinnedId ? ` pinned${isTilted ? ' tilted' : ''}` : ''}`}
          >
            {i === pinnedId && onTile && (
              <pre ref={ontileRef} className="not-found-dancer not-found-dancer--ontile">
                {dancerFrame}
              </pre>
            )}
          </div>
        ))}
      </div>

      {!onTile && (
        <pre
          className={`not-found-dancer not-found-dancer--free${isSliding ? ' sliding' : ''}${isFalling ? ' falling' : ''}${phase === 'splat' ? ' splat' : ''}`}
          style={{
            left: isSliding || isFalling || phase === 'splat' ? slideLeft : freeLeft,
            top:  isSliding || isFalling || phase === 'splat' ? slideTop  : freeTop,
          }}
        >
          {dancerFrame}
        </pre>
      )}
    </div>
  );
}
