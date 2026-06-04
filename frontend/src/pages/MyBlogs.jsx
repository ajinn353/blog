import { Edit3, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { api } from "../services/api";

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    api("/blogs/mine").then(setBlogs);
  }, []);

  const remove = async (id) => {
    await api(`/blogs/${id}`, { method: "DELETE" });
    setBlogs((items) => items.filter((item) => item._id !== id));
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <SEO title="My Blogs | Inkline" />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black text-ink dark:text-white">My Blogs</h1>
        <Link className="inline-flex items-center gap-2 rounded-md bg-mint px-4 py-2 font-bold text-white" to="/editor"><Plus className="h-4 w-4" /> New Blog</Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {blogs.map((blog) => (
          <div key={blog._id} className="grid gap-3 border-b border-slate-200 p-4 dark:border-slate-800 md:grid-cols-[1fr_140px_120px] md:items-center">
            <div>
              <h2 className="font-black text-ink dark:text-white">{blog.title}</h2>
              <p className="text-sm text-slate-500">{blog.shortDescription}</p>
            </div>
            <span className="rounded-md bg-slate-100 px-3 py-1 text-center text-sm font-bold dark:bg-slate-800">{blog.status}</span>
            <div className="flex gap-2 md:justify-end">
              <Link className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" to={`/editor/${blog._id}`}><Edit3 className="h-4 w-4" /></Link>
              <button className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => remove(blog._id)}><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
