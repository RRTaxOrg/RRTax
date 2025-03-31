'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import '../styles/LoggedInPage.css';

export default function LoggedInPage() {
  const router = useRouter();
  var token = null;
  // Fetch user data on component mount
  useEffect(() => {
    async function init() {
      console.log("RUNNING INITIALIZATION");
      token = localStorage.getItem('rrtaxtoken');
      if (!token) {
        console.error("Token is missing");
        router.push('/');
      }
      else{
        const response = await fetch(`http://localhost:3001/user/?token=${token}`);
        const userInfo = await response.json();
        if (!userInfo) {
          console.error("There was an error getting the user data.");
        }
        else {
          const userData = await JSON.parse(userInfo.user.data);
          if (userData.type == "admin") {
            // Redirect to the default tab (dashboard) when accessing /logged_in
            router.push('/logged_in/admin');
          }
          else {
            console.log("NON ADMIN");
            router.push('/logged_in/dashboard');
          }
        }
        
      }
    }
    init();

    // Get user data including uid from token
    //fetchUserData();
  }, []);

  

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

  return null;
  
}