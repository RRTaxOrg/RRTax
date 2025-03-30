'use client';

import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import '../styles/LoggedInPage.css'; // Import the CSS file for vertical navigation bar


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

  // Function to handle user logout
  const handleLogout = async () => {
    if (!token) {
      console.error("Token is missing");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/logout/?token=${token}`);
      const data = await response.json();
      
      if (data.code === "0") {
        console.log("Logged out successfully");
        router.push('/');
      } else {
        setError("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      setError("Error during logout");
    } finally {
      setLoading(false);
    }
  };

export default function RootLayout({ children }) {
  const router = useRouter();
  // Define the navigateTo function
  const navigateTo = (path) => {
    router.push(`/logged_in${path}`);
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header>
          <nav className="vertical-nav">
            <div className="logo-container">
              <Image src="/Logo_Improved_bg_removed.png" alt="Logo" width={200} height={200} />
            </div>
            <ul>
              <li>
                <a onClick={(e) => {e.preventDefault(); navigateTo("/dashboard");}}>Dashboard</a>
              </li>
            </ul>
            <ul>
              <li>
                <a onClick={(e) => {e.preventDefault(); navigateTo("/appointments");}}>My Appointments</a>
              </li>
            </ul>
            <ul>
              <li>
                <a onClick={(e) => {e.preventDefault(); navigateTo("/files");}}>My Files</a>
              </li>
            </ul>
            <ul>
              <li>
                <a onClick={(e) => {e.preventDefault(); navigateTo("/account-settings");}}>Account Settings</a>
              </li>
            </ul>
            <button className="logout-btn" onClick={handleLogout}>Log Out</button>
          </nav>
        </header>
        {children}
        <footer>
          <p>© 2025 RRTax Incorporated</p>
        </footer>
      </body>
    </html>
  );
}
   