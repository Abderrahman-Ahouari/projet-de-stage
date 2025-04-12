import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Don't forget to import useNavigate if not done already
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const {loading,isLoggedIn,user,logout} = useAuth();

  
  const navigate = useNavigate();



  useEffect(() => {
   
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isLoggedIn]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    logout();
  };

  const handleLogin = () => {
    navigate("/login"); // Navigate to login page
  };

  return (
    <header className="border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 text-[#4f46e5]">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" />
              </svg>
            </div>
            <span className="text-xl font-bold">Kando</span>
          </div>

          {/* Desktop Navigation */}
          {isLoggedIn && !isMobile && (
            <nav className="flex space-x-6">
              <a
                href="#"
                className="border-b-2 border-[#4f46e5] px-1 pb-4 pt-5 text-sm font-medium text-[#111827]"
              >
                kanban
              </a>
              <a
                href="#"
                className="px-1 pb-4 pt-5 text-sm font-medium text-[#6b7280]"
              >
                Progress
              </a>
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <button
              className="rounded-full p-2 text-[#6b7280] hover:bg-[#f3f4f6] cursor-pointer"
              onClick={handleLogin}
            >
              Login
            </button>
          ) : (
            <>
              <button className="rounded-full p-2 text-[#6b7280] hover:bg-[#f3f4f6]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 overflow-hidden rounded-full">
                  <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                </div>
                <span className="text-sm font-medium">{user.username}</span>
              </div>

              {!isMobile ? (
                <button
                  className="flex items-center space-x-1 rounded-md px-2 py-1 text-sm font-medium text-[#6b7280] hover:bg-[#f3f4f6] cursor-pointer"
                  disabled={loading}
                  onClick={handleLogout}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>{loading ? 'Logging out...' : 'Log out'}</span>
                </button>
              ) : (
                <button 
                  className="p-2 text-[#6b7280] hover:bg-[#f3f4f6] rounded-md"
                  onClick={toggleMobileMenu}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && isLoggedIn && (
        <div className="border-t border-[#e5e7eb] bg-white">
          <nav className="flex flex-col">
            <a
              href="#"
              className="border-l-4 border-[#4f46e5] bg-[#f9fafb] px-4 py-3 text-sm font-medium text-[#111827]"
            >
              kanban
            </a>
            <a
              href="#"
              className="border-l-4 border-transparent px-4 py-3 text-sm font-medium text-[#6b7280] hover:bg-[#f3f4f6]"
            >
              Progress
            </a>
          </nav>
          <div className="border-t border-[#e5e7eb] px-4 py-3">
            <button
              className="flex w-full items-center space-x-2 rounded-md px-2 py-2 text-sm font-medium text-[#6b7280] hover:bg-[#f3f4f6]"
              onClick={handleLogout}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
      <RouteTracker/>
    </header>
  );
}


const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("🧭 Route changed to:", location.pathname);
  }, [location]);

  return null; // This component doesn't render anything
};