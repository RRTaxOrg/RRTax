'use client'
import Image from "next/image";
import { useState } from "react";
import CryptoJS from "crypto-js";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (event) => {
      
      if (!email || !password) {
          setErrorMessage("Please enter both email and password for signup.");
          return;
        }
        
        console.log("Signing up...");
        event.preventDefault();
    // Generate a salt
    const salt = CryptoJS.lib.WordArray.random(4).toString(); // 4 bytes = 8 characters or something 
    console.log(salt);

    // Create a new user
    const signupResponse = await fetch(`http://localhost:3001/signup/?email=${email}&password=${password}&salt=${salt}&username=Jhonny&data=testdata`);
    const signupData = await signupResponse.json();
    console.log(signupData);

    if (signupData.code === "0") {
      console.log("User created successfully", signupData.token);
      setToken(signupData.token);
      router.push(`/logged_in?token=${signupData.token}`);
    } else if (signupData.code === "1") {
      setErrorMessage("Email already in use.");
    } else if (signupData.code === "2") {
      setErrorMessage("Username already in use.");
    }
  };

  const handleLogin = async (event) => {
      
      if (!email || !password) {
          setErrorMessage("Please enter both email and password for login.");
          return;
        }
        
        console.log("Logging in...");
        event.preventDefault();
    // Authenticate user
    const loginResponse = await fetch(`http://localhost:3001/signin/?email=${email}&password=${password}`);
    const loginData = await loginResponse.json();
    console.log(loginData);

    if (loginData.code === "0") {
      console.log("User logged in successfully", loginData.token);
      setToken(loginData.token);
      router.push(`/logged_in?token=${loginData.token}`);
    } else if (loginData.code === "1") {
      setErrorMessage("Email not found.");
    } else if (loginData.code === "2") {
      setErrorMessage("Incorrect password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-customWhite">
      <div className="flex flex-col items-center w-full max-w-md space-y-8">
        <Image src="/Logo_Improved_bg_removed.png" alt="Logo" width={500} height={500} />
        <div className="w-full p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-customBlue">Login</h2>
          <form className="mt-8 space-y-6 text-black">
            <input
              id="email-address"
              type="email"
              required
              placeholder="Email address"
              className="w-full px-3 py-2 border rounded-t-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              id="password"
              type="password"
              required
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-b-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <button onClick={handleLogin} className="w-full px-4 py-2 text-customWhite bg-customBlue rounded-md">Sign in</button>
            <button onClick={handleSignup} className="w-full px-4 py-2 text-customWhite bg-green-500 rounded-md">Sign up</button>
          </form>
        </div>
      </div>
    </div>
  );
}