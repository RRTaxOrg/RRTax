'use client';

import { useRouter } from 'next/navigation';
import '../styles/LoggedInPage.css'; // Ensure you import the CSS file

export default function VerticalNavBar({ setActiveTab }) {
  const router = useRouter();

  const handleNavigation = (tab) => {
    setActiveTab(tab);
    router.push(`/logged_in/${tab}`);
  };

  return (
    <nav className="w-64 bg-gray-100 p-4">
      <ul>
        <li>
          <button onClick={() => handleNavigation('dashboard')}>Dashboard</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('appointments')}>Appointments</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('files')}>Files</button>
        </li>
        <li>
          <button onClick={() => handleNavigation('account-settings')}>Account Settings</button>
        </li>
      </ul>
    </nav>
  );
}

