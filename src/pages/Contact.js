import { useEffect, useRef } from 'react';
import './Contact.css';

const LINKS = [
  { label: 'github',   href: 'https://github.com/andrewtakacs',                display: 'github.com/andrewtakacs' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/takacsandrew/',       display: 'linkedin.com/in/takacsandrew' },
  { label: 'youtube',  href: 'https://www.youtube.com/@andrewtakacs9957',       display: 'youtube.com/@andrewtakacs9957' },
];

function EmailLink() {
  const ref = useRef(null);
  useEffect(() => {
    const u = atob('YW5kcmV3ZHRha2Fjc0Bob3RtYWlsLmNvbQ==');
    if (ref.current) {
      ref.current.href = 'mailto:' + u;
      ref.current.textContent = u;
    }
  }, []);
  return <a ref={ref} className="contact-link" aria-label="Email" href="#">&nbsp;</a>;
}

export default function Contact() {
  return (
    <div className="inner-page contact-page">
      <div className="contact-header">
        <span className="page-label">contact</span>
      </div>

      <hr className="rule" />

      <div className="contact-links">
        <div className="contact-row">
          <span className="contact-label dim">email</span>
          <EmailLink />
        </div>
        {LINKS.map(({ label, href, display }) => (
          <div key={label} className="contact-row">
            <span className="contact-label dim">{label}</span>
            <a
              className="contact-link"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {display}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
