import { Bell, BookOpen, LayoutDashboard, LogOut, Menu, Moon, Plus, Search, Settings, Sun, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-semibold ${isActive ? "bg-ink text-white dark:bg-white dark:text-ink" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"}`;

  useEffect(() => {
    const close = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // const submitSearch = (event) => {
  //   event.preventDefault();
  //   const query = search.trim();
  //   navigate(query ? `/search?search=${encodeURIComponent(query)}` : "/search");
  //   setMenuOpen(false);
  // };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const profileImage = user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=2f9f89&color=fff`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
            aria-label="Open menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex flex-shrink-0 items-center gap-2 text-lg font-black text-ink dark:text-white">
            <BookOpen className="h-6 w-6 text-mint" />
            Inkline
          </Link>
          {/* <form onSubmit={submitSearch} className="relative ml-3 hidden w-72 lg:w-80 xl:w-96 sm:block">
            <span className="absolute left-3 top-2.5 text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search blogs..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-[#f6fafd] py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-mint/25 dark:border-slate-700 dark:bg-slate-900"
            />
          </form> */}
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/search" className={linkClass}>Explore</NavLink>
          {user && <NavLink to="/my-blogs" className={linkClass}>My Blogs</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-2 sm:gap-4">
          {user && (
            <Link
              className="inline-flex items-center gap-1 rounded-lg bg-mint px-2 py-2 text-xs font-bold text-white transition hover:scale-105 sm:px-4 sm:text-sm"
              to="/editor"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">New Blog</span>
            </Link>
          )}

          <button className="relative rounded-md p-1 text-slate-600 transition hover:text-ink dark:text-slate-300 dark:hover:text-white" onClick={() => setNotificationsOpen(true)} title="Notifications">
            <Bell size={20} />
            <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-coral px-1 text-center text-[10px] font-bold text-white">0</span>
          </button>

          <button className="rounded-md p-1 text-slate-600 transition hover:text-ink dark:text-slate-300 dark:hover:text-white" onClick={toggleTheme} title="Toggle theme">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user?.role === "admin" && (
            <button className="rounded-md p-1 text-slate-600 transition hover:text-ink dark:text-slate-300 dark:hover:text-white" onClick={() => navigate("/admin")} title="Admin settings">
              <Settings size={20} />
            </button>
          )}

          {user ? (
            <>
              <Link className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 shadow-sm transition hover:scale-110 dark:border-slate-700" to="/profile" title="Profile">
                <img src={profileImage} alt={user.name} className="block h-full w-full object-cover" />
              </Link>
              <button className="rounded-md p-1 text-red-500 transition hover:scale-110" onClick={handleLogout} title="Logout">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link className="rounded-lg bg-ink px-3 py-2 text-sm font-bold text-white dark:bg-white dark:text-ink" to="/login">
                Login
              </Link>
              <Link className="hidden rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-ink dark:border-slate-700 dark:text-white sm:inline-flex" to="/register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* <form onSubmit={submitSearch} className="px-3 pb-3 sm:hidden">
        <div className="relative w-full">
          <span className="absolute left-3 top-2.5 text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-[#f6fafd] py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-mint/25 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
      </form> */}

      {menuOpen && (
        <nav className="border-t border-slate-200 px-3 py-3 dark:border-slate-800 lg:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" onClick={() => setMenuOpen(false)} className={linkClass}>Home</NavLink>
            <NavLink to="/search" onClick={() => setMenuOpen(false)} className={linkClass}>Explore</NavLink>
            {user && <NavLink to="/my-blogs" onClick={() => setMenuOpen(false)} className={linkClass}>My Blogs</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin" onClick={() => setMenuOpen(false)} className={linkClass}>Admin</NavLink>}
          </div>
        </nav>
      )}

      {user?.role === "admin" && (
        <div className="border-t border-slate-200 px-4 py-2 dark:border-slate-800 md:hidden">
          <Link className="inline-flex items-center gap-2 text-sm font-semibold" to="/admin">
            <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
          </Link>
        </div>
      )}

      {notificationsOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-end p-4 pt-20 sm:pr-8">
          <button className="fixed inset-0 bg-black/20" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications" />
          <div ref={notificationRef} className="relative z-10 w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-800">
              <h2 className="font-bold text-ink dark:text-white">Notifications</h2>
              <button className="text-slate-500 hover:text-ink dark:hover:text-white" onClick={() => setNotificationsOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="p-6 text-center text-sm text-slate-500">No notifications yet</div>
          </div>
        </div>
      )}
    </header>
  );
}
