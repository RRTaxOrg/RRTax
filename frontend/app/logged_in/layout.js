'use client';

import { useRouter } from 'next/navigation';
import VerticalNavigationBar from '../components/VerticalNavBar';
import '../styles/LoggedInPage.css';

export default function LoggedInLayout({ children }) {
  const router = useRouter();

  // Function to handle navigation between tabs
  const navigateTo = (path) => {
    router.push(`/logged_in${path}`);
  };

  return (
    <>
      {/* Vertical Navigation Bar */}
      <VerticalNavigationBar navigateTo={navigateTo} />
      
      {/* Main Content Area */}
      <main className="flex-grow p-6 bg-gray-50">{children}</main>
    </>
  );
}