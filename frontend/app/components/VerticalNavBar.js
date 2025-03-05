import Link from 'next/link';
import Image from 'next/image';
import '../styles/LoggedInPage.css'; // Ensure you import the CSS file

export default function VerticalNavBar({ setActiveTab, handleLogout }) {
  return (
    <nav className="vertical-nav">
      <div className="logo-container">
        <Image src="/Logo_Improved_bg_removed.png" alt="Logo" width={200} height={200} />
      </div>
      <ul>
        <li>
          <a href="#dashboard" onClick={(e) => {e.preventDefault(); setActiveTab('dashboard'); window.scrollTo(0, 0);}}>Dashboard</a>
        </li>
      </ul>
      <ul>
        <li>
          <a href="#appointments" onClick={(e) => {e.preventDefault(); setActiveTab('appointments'); window.scrollTo(0, 0);}}>My Appointments</a>
        </li>
      </ul>
      <ul>
        <li>
          <a href="#files" onClick={(e) => {e.preventDefault(); setActiveTab('files'); window.scrollTo(0, 0);}}>My Files</a>
        </li>
      </ul>
      <button className="logout-btn" onClick={handleLogout}>Log out</button>
    </nav>
  );
}

