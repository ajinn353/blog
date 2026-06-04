import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import SEO from "../components/SEO";
import { useFetch } from "../hooks/useFetch";
import { api } from "../services/api";
import { useState } from "react";

export default function Home() {
  const { data: latest } = useFetch("/blogs?limit=6", [], []);
  const { data: popular } = useFetch("/blogs?filter=most-viewed&limit=3", [], []);
  const { data: trending } = useFetch("/blogs?filter=most-liked&limit=3", [], []);
  const { data: categories } = useFetch("/categories", [], []);
  const [email, setEmail] = useState("");

  const subscribe = async (event) => {
    event.preventDefault();
    if (!email) return;
    await api("/admin/newsletter", { method: "POST", body: { email } });
    setEmail("");
  };

  return (
    <main>
      <SEO title="Inkline Blog | Stories, ideas, and insight" description="Read and publish thoughtful blogs across technology, AI, business, education, and travel." />
      <section className="bg-[url('https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center">
        <div className="bg-ink/70">
          <div className="mx-auto grid min-h-[calc(100vh-74px)] max-w-7xl items-center px-4 py-16 text-white lg:grid-cols-[1.2fr_0.8fr]">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-amber">Modern MERN Publishing</p>
              <h1 className="text-4xl font-black sm:text-6xl">Inkline Blog</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">A complete platform for writers, readers, and admins to publish rich stories, manage drafts, moderate content, and grow a community.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/editor" className="rounded-md bg-mint px-5 py-3 font-bold text-white">Start Writing</Link>
                <Link to="/search" className="rounded-md bg-white px-5 py-3 font-bold text-ink">Browse Blogs</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-mint">Fresh Reads</p>
            <h2 className="text-3xl font-black text-ink dark:text-white">Latest Blogs</h2>
          </div>
          <Link to="/search" className="font-bold text-coral">View all</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latest.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
        </div>
      </section>

      <section className="bg-white py-12 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="mb-5 text-2xl font-black text-ink dark:text-white">Popular Blogs</h2>
            <div className="grid gap-5">
              {popular.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
            </div>
          </div>
          <div>
            <h2 className="mb-5 text-2xl font-black text-ink dark:text-white">Trending Blogs</h2>
            <div className="grid gap-5">
              {trending.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-5 text-2xl font-black text-ink dark:text-white">Categories</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link to={`/search?category=${category._id}`} key={category._id} className="rounded-lg border border-slate-200 bg-white p-5 hover:border-mint dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-black text-ink dark:text-white">{category.name}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ink py-12 text-white">
        <form onSubmit={subscribe} className="mx-auto flex max-w-3xl flex-col gap-3 px-4 sm:flex-row">
          <input className="min-h-12 flex-1 rounded-md border-0 px-4 text-ink" type="email" placeholder="Email for the newsletter" value={email} onChange={(event) => setEmail(event.target.value)} />
          <button className="rounded-md bg-amber px-5 py-3 font-black text-ink">Subscribe</button>
        </form>
      </section>
    </main>
  );
}
