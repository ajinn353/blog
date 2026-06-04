import { BarChart3, FolderTree, MessageSquare, Newspaper, Settings, Users } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

const menu = [
  ["Dashboard", BarChart3],
  ["Blogs", Newspaper],
  ["Users", Users],
  ["Categories", FolderTree],
  ["Comments", MessageSquare],
  ["Settings", Settings]
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <Link to="/" className="text-xl font-black text-ink dark:text-white">Inkline Admin</Link>
          <nav className="mt-8 space-y-1">
            {menu.map(([label, Icon]) => (
              <a key={label} href={`#${label.toLowerCase()}`} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                <Icon className="h-4 w-4" /> {label}
              </a>
            ))}
          </nav>
        </aside>
        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
