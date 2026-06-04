import { Search as SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import SEO from "../components/SEO";
import { api } from "../services/api";

export default function Search() {
  const [params] = useSearchParams();
  const queryString = params.toString();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: params.get("search") || "",
    category: params.get("category") || "",
    tag: params.get("tag") || "",
    filter: params.get("filter") || "latest"
  });

  useEffect(() => {
    setFilters({
      search: params.get("search") || "",
      category: params.get("category") || "",
      tag: params.get("tag") || "",
      filter: params.get("filter") || "latest"
    });
  }, [queryString]);

  useEffect(() => {
    api("/categories").then(setCategories);
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(Object.entries(filters).filter(([, value]) => value && value !== "latest"));
    api(`/blogs?${query.toString()}`).then(setBlogs);
  }, [filters]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <SEO title="Search Blogs | Inkline" />
      <div className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[1fr_220px_180px_180px]">
        <label className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 dark:border-slate-700">
          <SearchIcon className="h-4 w-4" />
          <input className="w-full bg-transparent outline-none" placeholder="Search title, tags, category" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
        </label>
        <select className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
          <option value="">All Categories</option>
          {categories.map((category) => <option value={category._id} key={category._id}>{category.name}</option>)}
        </select>
        <input className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Tag" value={filters.tag} onChange={(event) => setFilters({ ...filters, tag: event.target.value })} />
        <select className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={filters.filter} onChange={(event) => setFilters({ ...filters, filter: event.target.value })}>
          <option value="latest">Latest</option>
          <option value="most-viewed">Most Viewed</option>
          <option value="most-liked">Most Liked</option>
        </select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map((blog) => <BlogCard blog={blog} key={blog._id} />)}
      </div>
    </main>
  );
}
