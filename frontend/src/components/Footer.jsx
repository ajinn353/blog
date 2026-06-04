import { BookOpen, Facebook, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-black text-ink dark:text-white">
            <BookOpen className="h-6 w-6 text-mint" />
            Inkline
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
            A MERN blog platform for publishing stories, managing drafts, exploring ideas, and keeping readers close.
          </p>
          <div className="mt-5 flex gap-2">
            <a className="rounded-md border border-slate-200 p-2 text-slate-600 hover:text-ink dark:border-slate-800 dark:text-slate-300 dark:hover:text-white" href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <Twitter className="h-4 w-4" />
            </a>
            <a className="rounded-md border border-slate-200 p-2 text-slate-600 hover:text-ink dark:border-slate-800 dark:text-slate-300 dark:hover:text-white" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook className="h-4 w-4" />
            </a>
            <a className="rounded-md border border-slate-200 p-2 text-slate-600 hover:text-ink dark:border-slate-800 dark:text-slate-300 dark:hover:text-white" href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-black text-ink dark:text-white">Explore</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/search">All Blogs</Link>
            <Link to="/search?filter=most-viewed">Popular</Link>
            <Link to="/search?filter=most-liked">Trending</Link>
            <Link to="/editor">Write</Link>
          </div>
        </div>

        <div>
          <h3 className="font-black text-ink dark:text-white">Account</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/my-blogs">My Blogs</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-4 text-center text-xs font-semibold text-slate-500 dark:border-slate-800">
        Copyright {new Date().getFullYear()} Inkline Blog. All rights reserved.
      </div>
    </footer>
  );
}
