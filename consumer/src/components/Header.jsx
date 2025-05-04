import { useEffect, useState } from "react";
import { useNavigate, useLocation, NavLink, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptInvite,
  getNotifications,
  getPermissions,
  getProject,
  markAsRead,
  rejectInvite,
} from "../services/services";
import NotificationsModal from "./NotificationsModal";
import { ClipLoader } from "react-spinners";

export default function Header() {
  const queryClient = useQueryClient();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { loading, isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const id = pathParts[2];

  const navigate = useNavigate();

  const isProjectPage = id !== undefined;

  const { data: notifications, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await getNotifications();
      return response.data;
    },
    enabled: isLoggedIn,
  });
  const { data: project } = useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      if (id) {
        const response = await getProject(id);
        return response.data;
      }
      return null;
    },
    enabled: isLoggedIn && !!id,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    logout();
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const getNavLinkClass = (isActive) =>
    isActive
      ? "nav-link nav-active"
      : "nav-link text-slate-600 hover:text-slate-900";

  const toggleNotifications = async () => {
    setShowNotifications(!showNotifications);
  };

  async function handleAccept(id) {
    const res = await acceptInvite(id);
    refetch();
    queryClient.invalidateQueries(["projects"]);
  }
  async function handleReject(id) {
    const res = await rejectInvite(id);
    refetch();
  }
  const unreadCount = notifications?.filter((n) => !n.read_at).length || 0;
  useEffect(() => {
    const markNotifications = async () => {
      try {
        if (showNotifications) {
          await markAsRead();
          refetch();
        }
      } catch (err) {
        console.error("Failed to mark as read", err);
      }
    };
    markNotifications();
  }, [showNotifications]);
  const [permissions, setPermissions] = useState([]);
  const [loadingPermissions, setLoadingPermissions] = useState(true);

  useEffect(() => {
    if (id) {
    const fetchPermissions = async () => {
        try {
        
          const res = await getPermissions(id);
          setPermissions(res.data);
          
          
        } catch (error) {
          console.error("Failed to fetch permissions:", error);
        } finally {
          setLoadingPermissions(false);
        }
      };
      fetchPermissions();
    }
  }, [id]);
  const permissionsNames = permissions.map((permission) => permission.name);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-slate-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center space-x-8">
          <Link to="/projects" className="flex items-center space-x-2 group">
            <div className="h-8 w-8 text-teal-600 transition-transform duration-300 group-hover:scale-110">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-800">Kando</span>
          </Link>

          {isLoggedIn && !isMobile && (
            <nav className="flex space-x-6">
              {isProjectPage ? (
                <>
                  <NavLink
                    to={`/projects/${id}/kanban`}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "nav-active" : "text-slate-600 hover:text-slate-900"}`
                    }
                  >
                    Kanban
                  </NavLink>

                  {!loadingPermissions && permissionsNames.includes("consult progress") &&
                    <NavLink
                      to={`/projects/${id}/progress`}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "nav-active" : "text-slate-600 hover:text-slate-900"}`
                      }
                    >
                      Progress
                    </NavLink>}
                  {!loadingPermissions && permissionsNames.includes("consult team") &&
                    <NavLink
                      to={`/projects/${id}/team`}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "nav-active" : "text-slate-600 hover:text-slate-900"}`
                      }
                    >
                      Team
                    </NavLink>}
                  {!loadingPermissions && permissionsNames.includes("manage roles") &&
                    <NavLink
                      to={`/projects/${id}/settings`}
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "nav-active" : "text-slate-600 hover:text-slate-900"}`
                      }
                    >
                      Settings
                    </NavLink>}
                </>
              ) : (
                <NavLink
                  to="/projects"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "nav-active" : "text-slate-600 hover:text-slate-900"}`
                  }
                >
                  Projects
                </NavLink>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <button
              className="px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors duration-200 cursor-pointer"
              onClick={handleLogin}
            >
              Login
            </button>
          ) : (
            <>
              <button
                onClick={toggleNotifications}
                aria-label="Toggle notifications"
                className="relative p-2 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-full transition-all duration-200 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-rose-500 text-xs font-medium text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-3 pl-2">
                <div className="h-8 w-8 overflow-hidden rounded-full ring-2 ring-slate-200">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-slate-700">{user.username}</span>
              </div>

              {!isMobile ? (
                <button
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-all duration-200 cursor-pointer"
                  disabled={loading}
                  onClick={handleLogout}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>{loading ? "Logging out..." : "Log out"}</span>
                </button>
              ) : (
                <button
                  className="p-2 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg transition-all duration-200 cursor-pointer"
                  onClick={toggleMobileMenu}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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

      {isMobile && isMobileMenuOpen && isLoggedIn && (
        <div className="border-t border-slate-200 bg-white">
          <nav className="flex flex-col space-y-1 p-2">
            {isProjectPage ? (
              <>
                <NavLink
                  to={`/projects/${id}/kanban`}
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 rounded-lg ${isActive ? "bg-teal-50 text-teal-600" : "text-slate-600 hover:bg-slate-50"}`
                  }
                >
                  Kanban
                </NavLink>
                {!loadingPermissions && permissionsNames.includes("consult progress") &&
                  <NavLink
                    to={`/projects/${id}/progress`}
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 rounded-lg ${isActive ? "bg-teal-50 text-teal-600" : "text-slate-600 hover:bg-slate-50"}`
                    }
                  >
                    Progress
                  </NavLink>}
                {!loadingPermissions && permissionsNames.includes("consult team") &&
                  <NavLink
                    to={`/projects/${id}/team`}
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 rounded-lg ${isActive ? "bg-teal-50 text-teal-600" : "text-slate-600 hover:bg-slate-50"}`
                    }
                  >
                    Team
                  </NavLink>}
                {!loadingPermissions && permissionsNames.includes("manage roles") &&
                  <NavLink
                    to={`/projects/${id}/settings`}
                    className={({ isActive }) =>
                      `nav-link px-3 py-2 rounded-lg ${isActive ? "bg-teal-50 text-teal-600" : "text-slate-600 hover:bg-slate-50"}`
                    }
                  >
                    Settings
                  </NavLink>}
              </>
            ) : (
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `nav-link px-3 py-2 rounded-lg ${isActive ? "bg-teal-50 text-teal-600" : "text-slate-600 hover:bg-slate-50"}`
                }
              >
                Projects
              </NavLink>
            )}
          </nav>

          <div className="border-t border-slate-200 p-2">
            <button
              className="flex w-full items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer cursor-pointer"
              onClick={handleLogout}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}

      
        <NotificationsModal setShowNotifications={setShowNotifications} showNotifications={showNotifications} notifications={notifications} handleAccept={handleAccept} handleReject={handleReject} />
      
    </header>
  );
}
