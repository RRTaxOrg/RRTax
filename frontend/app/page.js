import logo from '../public/logo.png';
import Image from "next/image"; // Image class

export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-customWhite">
      <div className="flex flex-col items-center w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image src={logo} alt="Logo" width={300} height={300} />
        </div>

        {/* Login Form */}
        <div className="w-full p-8 space-y-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center text-customBlue font-geist">
            Login
          </h2>
          <form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-t-md focus:outline-none focus:ring-customAqua focus:border-customAqua font-geist"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-b-md focus:outline-none focus:ring-customAqua focus:border-customAqua font-geist"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-customAqua border-gray-300 rounded focus:ring-customAqua"
                />
                <label
                  htmlFor="remember-me"
                  className="block ml-2 text-sm text-gray-900 font-geist"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-customAqua hover:text-customLightGreen font-geist"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-customBlue border border-transparent rounded-md group hover:bg-customAqua focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-customAqua font-geist"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
