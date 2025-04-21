import { useNavigate } from "react-router-dom";

export default function SomethingWentWrong() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#f9fafb] px-4 text-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 text-[#4f46e5]">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="h-full w-full"
            >
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-[#111827]">Kando</span>
        </div>

        <h1 className="text-3xl font-bold text-[#111827] sm:text-4xl">
          Something went wrong
        </h1>
        <p className="max-w-md text-[#6b7280]">
          We’re sorry, an unexpected error has occurred. Please try again or return to the dashboard.
        </p>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate("/projects")}
            className="rounded-md bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white hover:bg-[#4338ca] transition"
          >
            Go to Projects
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f3f4f6] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
