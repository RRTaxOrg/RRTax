export default function LandingPage() {
  return (
    <div className="main-content flex flex-col min-h-screen bg-gray-50 mt-20 mb-20">
      <div className="w-full h-full flex-grow p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-customBlue mb-4">Welcome to Your Dashboard</h1>
        <p className="text-gray-700 mb-4">Here you can manage your account, view your files, and schedule appointments.</p>
        <div className="background-dashboard"></div>
      </div>
    </div>
  );
}