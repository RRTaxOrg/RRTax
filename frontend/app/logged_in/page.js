'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function LoggedInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      console.error("Token is missing");
      router.push('/');
    } else {
      console.log("Token:", token);
    }
  }, [token, router]);

  const handleLogout = async () => {
    console.log("Logging out...");

    if (!token) {
      console.error("Token is missing");
      return;
    }

    // Log out user
    try {
      const logoutResponse = await fetch(`http://localhost:3001/logout/?token=${token}`);
      const logoutData = await logoutResponse.json();
      console.log(logoutData);

      if (logoutData.code === "0") {
        console.log("User logged out successfully");
        router.push('/');
      } else if (logoutData.code === "3") {
        console.error("Info missing");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-customWhite">
      <div>
        <h1 className="text-2xl font-bold text-center text-customBlue">You are logged in</h1>
        <button onClick={handleLogout} className="w-full px-4 py-2 text-white bg-red-500 rounded-md">Log out</button>
      </div>
    </div>
  );
}