import { IconLinkedIn, IconGitHub, IconYouTube } from './Icons';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="https://www.linkedin.com/in/takacsandrew/" target="_blank" rel="noopener noreferrer" className="footer-link">
          <IconLinkedIn />
        </a>
        <a href="https://github.com/andrewtakacs" target="_blank" rel="noopener noreferrer" className="footer-link">
          <IconGitHub />
        </a>
        <a href="https://www.youtube.com/@andrewtakacs9957" target="_blank" rel="noopener noreferrer" className="footer-link">
          <IconYouTube />
        </a>
      </div>
    </footer>
  );
}
