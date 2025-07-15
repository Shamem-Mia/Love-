import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  RefreshCw,
  User,
  LogIn,
  Settings,
  LogOut,
  Info,
  Heart,
  ChevronDown,
  ChevronUp,
  Inbox,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".mobile-sidebar");
      const desktopMenu = document.querySelector(".desktop-menu");

      if (sidebar && !sidebar.contains(event.target)) {
        setIsMobileSidebarOpen(false);
      }

      if (desktopMenu && !desktopMenu.contains(event.target)) {
        const menuButton = document.querySelector(".desktop-menu-button");
        if (!menuButton?.contains(event.target)) {
          setIsDesktopMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSidebarOpen, isDesktopMenuOpen]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const NavLink = ({ to, icon, text, onClick, closeSidebar = false }) => (
    <Link
      to={to}
      className="text-gray-800 hover:text-pink-600 flex items-center p-2 rounded hover:bg-pink-50 transition-colors duration-200"
      onClick={() => {
        if (closeSidebar) {
          setIsMobileSidebarOpen(false);
        }
        onClick?.();
      }}
    >
      <span className="mr-3 text-pink-600">{icon}</span>
      <span className="font-medium">{text}</span>
    </Link>
  );

  return (
    <nav className="bg-pink-600 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Left side - Logo and Name */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/love-logo.png"
              alt="Love Calculator Logo"
              className="h-10 w-10 rounded-full"
            />
            <span className="text-2xl font-bold">LoveMatch</span>
          </Link>

          {/* Right side - Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="hover:text-pink-200 transition-colors duration-200"
            >
              Home
            </Link>

            <Link
              to="/tips"
              className="hover:text-pink-200 transition-colors duration-200"
            >
              Love Tips
            </Link>
            <button
              onClick={handleRefresh}
              className="hover:text-pink-200 transition-colors duration-200 flex items-center"
            >
              <RefreshCw className="h-5 w-5 mr-1" /> Refresh
            </button>
            <button
              onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
              className="text-white hover:text-pink-200 transition-colors duration-200 flex items-center space-x-1 desktop-menu-button"
            >
              <span>Menu</span>
              {isDesktopMenuOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation (Icons only) */}
          <div className="flex md:hidden items-center space-x-4">
            <button
              onClick={handleRefresh}
              className="hover:text-pink-200 transition"
            >
              <RefreshCw className="h-6 w-6" />
            </button>
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="text-white focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Menu Dropdown */}
      <div
        className={`hidden md:block absolute right-4 mt-1 w-56 bg-white rounded-md shadow-xl z-50 desktop-menu transition-all duration-300 ease-out ${
          isDesktopMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="py-2">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Navigation
          </div>
          <NavLink
            to="/"
            icon={<Home size={18} />}
            text="Home"
            onClick={() => setIsDesktopMenuOpen(false)}
          />
          {authUser && (
            <NavLink
              to="/inbox"
              icon={<Inbox size={18} />}
              text="Inbox"
              onClick={() => setIsDesktopMenuOpen(false)}
            />
          )}

          <NavLink
            to="/tips"
            icon={<Heart size={18} />}
            text="Love Tips"
            onClick={() => setIsDesktopMenuOpen(false)}
          />
          <button
            onClick={() => {
              handleRefresh();
              setIsDesktopMenuOpen(false);
            }}
            className="w-full text-gray-800 hover:text-pink-600 flex items-center p-2 rounded hover:bg-pink-50 transition-colors duration-200"
          >
            <RefreshCw size={18} className="mr-3 text-pink-600" />
            <span className="font-medium">Refresh</span>
          </button>

          <div className="border-t border-gray-100 my-2"></div>

          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Account
          </div>
          {authUser ? (
            <>
              <button
                onClick={() => {
                  logout(navigate);
                  setIsDesktopMenuOpen(false);
                  navigate("/");
                }}
                className="w-full text-gray-800 hover:text-pink-600 flex items-center p-2 rounded hover:bg-pink-50 transition-colors duration-200"
              >
                <LogOut size={18} className="mr-3 text-pink-600" />
                <span className="font-medium">Logout</span>
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              icon={<LogIn size={18} />}
              text="Login/Signup"
              onClick={() => setIsDesktopMenuOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Mobile Sidebar with transition */}
      <div
        className={`fixed inset-0 z-50 overflow-y-auto md:hidden transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {isMobileSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl mobile-sidebar">
              <div className="flex justify-between items-center p-4 border-b">
                <Link
                  to="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <img
                    src="/love-logo.png"
                    alt="LoveMatch Logo"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="text-xl font-bold text-gray-800">
                    LoveMatch
                  </span>
                </Link>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-4">
                <nav className="flex flex-col space-y-1">
                  <div className="px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Navigation
                  </div>
                  <NavLink
                    to="/"
                    icon={<Home size={18} />}
                    text="Home"
                    closeSidebar={true}
                  />
                  {authUser && (
                    <NavLink
                      to="/inbox"
                      icon={<Inbox size={18} />}
                      text="Inbox"
                      onClick={() => setIsDesktopMenuOpen(false)}
                    />
                  )}

                  <NavLink
                    to="/tips"
                    icon={<Heart size={18} />}
                    text="Love Tips"
                    closeSidebar={true}
                  />
                  <button
                    onClick={() => {
                      handleRefresh();
                      setIsMobileSidebarOpen(false);
                    }}
                    className="text-gray-800 hover:text-pink-600 flex items-center p-2 rounded hover:bg-pink-50 transition-colors duration-200"
                  >
                    <RefreshCw size={18} className="mr-3 text-pink-600" />
                    <span className="font-medium">Refresh</span>
                  </button>

                  <div className="border-t border-gray-100 my-2"></div>

                  <div className="px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Account
                  </div>
                  {authUser ? (
                    <>
                      <button
                        onClick={() => {
                          logout(navigate);
                          setIsMobileSidebarOpen(false);
                          navigate("/");
                        }}
                        className="text-gray-800 hover:text-pink-600 flex items-center p-2 rounded hover:bg-pink-50 transition-colors duration-200"
                      >
                        <LogOut size={18} className="mr-3 text-pink-600" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </>
                  ) : (
                    <NavLink
                      to="/login"
                      icon={<LogIn size={18} />}
                      text="Login/Signup"
                      closeSidebar={true}
                    />
                  )}
                </nav>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
