import { CalendarDays, Eye, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const fallback = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80";

export default function BlogCard({ blog }) {
  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <img className="h-48 w-full object-cover" src={blog.thumbnailImage || fallback} alt={blog.title} />
      <div className="space-y-3 p-5">
        <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide text-mint">
          <span>{blog.category?.name || "General"}</span>
          <span>{blog.status && blog.status !== "published" ? blog.status : ""}</span>
        </div>
        <h3 className="line-clamp-2 text-xl font-black text-ink dark:text-white">{blog.title}</h3>
        <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{blog.shortDescription}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1"><UserRound className="h-4 w-4" /> {blog.author?.name || "Author"}</span>
          <span className="inline-flex items-center gap-1"><CalendarDays className="h-4 w-4" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
          <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" /> {blog.views || 0}</span>
        </div>
        <Link className="inline-flex rounded-md bg-ink px-4 py-2 text-sm font-bold text-white dark:bg-white dark:text-ink" to={`/blog/${blog.slug}`}>
          Read More
        </Link>
      </div>
    </article>
  );
}
