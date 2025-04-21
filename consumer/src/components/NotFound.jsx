import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-12">
      <h1 className="text-6xl font-bold text-[#4f46e5]">404</h1>
      <p className="mt-4 text-xl font-semibold text-gray-800">Page not found</p>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        Sorry, the page you're looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 rounded-md bg-[#4f46e5] px-4 py-2 text-white hover:bg-[#4338ca] transition"
      >
        Go back home
      </button>
    </div>
  );
}
