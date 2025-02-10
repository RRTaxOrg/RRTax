'use client'
import Image from "next/image";
import { useState } from "react";
import CryptoJS from "crypto-js";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleSignup = async (event) => {
    console.log("Signing up...");
    event.preventDefault();

    if (!email || !username || !password) {
      setErrorMessage("Please enter email, username, and password for signup.");
      return;
    }

    // Generate a salt
    const salt = CryptoJS.lib.WordArray.random(4).toString(); // 4 bytes = 8 characters or something 
    console.log(salt);

    // Hash the password with the salt
    const hashedPassword = CryptoJS.SHA256(password + salt).toString();

    // Create a new user
    try {
      const signupResponse = await fetch(`http://localhost:3001/signup/?email=${email}&password=${hashedPassword}&salt=${salt}&username=${username}&data=testdata`);
      const signupData = await signupResponse.json();
      console.log(signupData);

      if (signupData.code === "0") {
        console.log("User created successfully", signupData.token);
        router.push(`/logged_in?token=${signupData.token}`);
      } else if (signupData.code === "1") {
        setErrorMessage("Email already in use.");
      } else if (signupData.code === "2") {
        setErrorMessage("Username already in use.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrorMessage("An error occurred during signup. Please try again.");
    }
  };

  const handleLogin = async (event) => {
    console.log("Logging in...");
    event.preventDefault();

    if (!email || !password) {
      setErrorMessage("Please enter both email and password for login.");
      return;
    }

    // Fetch the salt for the user
    const saltResponse = await fetch(`http://localhost:3001/salt/?email=${email}`);
    const saltData = await saltResponse.json();

    if (saltData.code !== "0") {
      setErrorMessage("Email not found.");
      return;
    }

    const salt = saltData.salt;

    // Hash the password with the salt
    const hashedPassword = CryptoJS.SHA256(password + salt).toString();

    // Authenticate user
    try {
      const loginResponse = await fetch(`http://localhost:3001/signin/?email=${email}&password=${hashedPassword}`);
      const loginData = await loginResponse.json();
      console.log(loginData);

      if (loginData.code === "0") {
        console.log("User logged in successfully", loginData.token);
        router.push(`/logged_in?token=${loginData.token}`);
      } else if (loginData.code === "1") {
        setErrorMessage("Email not found.");
      } else if (loginData.code === "2") {
        setErrorMessage("Incorrect password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-customWhite">
      <div className="flex flex-col items-center w-full max-w-md space-y-8">
        <Image src="/Logo_Improved_bg_removed.png" alt="Logo" width={500} height={500} />
        <div className="w-full p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-customBlue">{isSignUp ? "Sign Up" : "Login"}</h2>
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
            {isSignUp && (
              <input
                id="username"
                type="text"
                required
                placeholder="Username"
                className="w-full px-3 py-2 border rounded-t-md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
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
            {isSignUp ? (
              <button onClick={handleSignup} className="w-full px-4 py-2 text-customWhite bg-customBlue rounded-md">Sign up</button>
            ) : (
              <button onClick={handleLogin} className="w-full px-4 py-2 text-customWhite bg-customBlue rounded-md">Sign in</button>
            )}
          </form>
          <button onClick={() => setIsSignUp(!isSignUp)} className="w-full px-4 py-2 text-customWhite bg-gray-500 rounded-md">
            {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}