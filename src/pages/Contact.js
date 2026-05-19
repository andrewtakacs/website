import './Contact.css';
import { IconLinkedIn, IconGitHub, IconYouTube } from '../components/Icons';

const LINKS = [
  { icon: <IconLinkedIn size={22} />, label: 'LinkedIn',  href: 'https://www.linkedin.com/in/takacsandrew/' },
  { icon: <IconGitHub   size={22} />, label: 'GitHub',    href: 'https://github.com/andrewtakacs' },
  { icon: <IconYouTube  size={22} />, label: 'YouTube',   href: 'https://www.youtube.com/@andrewtakacs9957' },
];

export default function Contact() {
  return (
    <div className="inner-page contact-page">
      <div className="page-header">
        <span className="page-label">contact</span>
      </div>

      <hr className="rule" style={{ margin: 0 }} />

      <div className="contact-icons">
        {LINKS.map(({ icon, label, href }) => (
          <a
            key={label}
            className="contact-icon-link"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
          >
            {icon}
          </a>
        ))}
      </div>
    </div>
  );
}
