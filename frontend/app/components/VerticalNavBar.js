'use client';

import Image from 'next/image';
import '../styles/LoggedInPage.css';
import { useRouter } from 'next/navigation';

export default function VerticalNavigationBar({ navigateTo }) {
  const router = useRouter();
  return (
    <nav className="vertical-nav">
      <div className="logo-container">
        <Image src="/Logo_Improved_bg_removed.png" alt="Logo" width={200} height={200} />
      </div>
      <ul>
        <li>
          <a
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/dashboard');
            }}
          >
            Dashboard
          </a>
        </li>
      </ul>
      <ul>
        <li>
          <a
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/appointments');
            }}
          >
            My Appointments
          </a>
        </li>
      </ul>
      <ul>
        <li>
          <a
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/files');
            }}
          >
            My Files
          </a>
        </li>
      </ul>
      <ul>
        <li>
          <a
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/account-settings');
            }}
          >
            Account Settings
          </a>
        </li>
      </ul>
      <button
        className="logout-btn"
        onClick={(e) => {
          e.preventDefault();
          localStorage.removeItem('rrtaxtoken');
          router.push('/log_in');
        }}
      >
        Log Out
      </button>
    </nav>
  );
}

