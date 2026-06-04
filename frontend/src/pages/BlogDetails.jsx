import { Bookmark, Eye, Facebook, Heart, Linkedin, Twitter } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import Comments from "../components/Comments";
import ReadingProgress from "../components/ReadingProgress";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const fallback = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80";

export default function BlogDetails() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    api(`/blogs/${slug}`).then((data) => {
      setBlog(data);
      if (data.category?._id) api(`/blogs?category=${data.category._id}&limit=3`).then(setRelated);
    });
  }, [slug]);

  const readingTime = useMemo(() => {
    const words = blog?.content?.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length || 0;
    return Math.max(1, Math.ceil(words / 220));
  }, [blog]);

  const shareUrl = encodeURIComponent(window.location.href);
  const toggle = async (action) => {
    const result = await api(`/blogs/${blog._id}/${action}`, { method: "POST" });
    if (action === "like") setBlog({ ...blog, likesCount: result.likesCount });
  };

  if (!blog) return <main className="mx-auto max-w-6xl px-4 py-16">Loading...</main>;

  const imageSrc = blog.thumbnailImage || fallback;
  const imageSizeClass = {
    full: "w-full",
    medium: "mx-auto max-w-4xl",
    small: "mx-auto max-w-2xl"
  }[blog.featuredImageSize || "full"];
  const leftImageSizeClass = {
    full: "md:w-96",
    medium: "md:w-72",
    small: "md:w-48"
  }[blog.featuredImageSize || "medium"];
  const showTopImage = (blog.featuredImagePlacement || "top") === "top";
  const showLeftImage = blog.featuredImagePlacement === "left";

  return (
    <main>
      <ReadingProgress />
      <SEO title={blog.metaTitle || blog.title} description={blog.metaDescription || blog.shortDescription} image={blog.thumbnailImage} />
      {showTopImage && (
        <div className={imageSizeClass}>
          <img className="h-[48vh] w-full object-cover" src={imageSrc} alt={blog.title} />
        </div>
      )}
      <article className="mx-auto max-w-4xl px-4 py-10">
        {showLeftImage && (
          <img className={`mb-5 w-full rounded-lg object-cover md:float-left md:mr-6 md:mt-2 ${leftImageSizeClass}`} src={imageSrc} alt={blog.title} />
        )}
        <div className="flex flex-wrap gap-2 text-sm font-bold text-mint">
          <span>{blog.category?.name}</span>
          {blog.tags?.map((tag) => <span key={tag}>#{tag}</span>)}
        </div>
        <h1 className="mt-3 text-4xl font-black text-ink dark:text-white sm:text-5xl">{blog.title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{blog.shortDescription}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
          <Link to={`/users/${blog.author?._id}`} className="inline-flex items-center gap-2 font-bold text-ink hover:text-mint dark:text-white">
            <span className="h-9 w-9 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <img className="h-full w-full object-cover" src={blog.author?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.author?.name || "Author")}&background=2f9f89&color=fff`} alt={blog.author?.name} />
            </span>
            {blog.author?.name}
          </Link>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          <span>{readingTime} min read</span>
          <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" /> {blog.views}</span>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {user && <button className="inline-flex items-center gap-2 rounded-md bg-coral px-4 py-2 font-bold text-white" onClick={() => toggle("like")}><Heart className="h-4 w-4" /> {blog.likesCount || blog.likes?.length || 0}</button>}
          {user && <button className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 font-bold text-white dark:bg-white dark:text-ink" onClick={() => toggle("bookmark")}><Bookmark className="h-4 w-4" /> Save</button>}
          <a className="rounded-md border border-slate-300 p-2" href={`https://twitter.com/intent/tweet?url=${shareUrl}`} target="_blank"><Twitter className="h-5 w-5" /></a>
          <a className="rounded-md border border-slate-300 p-2" href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank"><Facebook className="h-5 w-5" /></a>
          <a className="rounded-md border border-slate-300 p-2" href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank"><Linkedin className="h-5 w-5" /></a>
        </div>
        <div className="prose-content mt-8 text-lg text-slate-800 dark:text-slate-200" dangerouslySetInnerHTML={{ __html: blog.content }} />
        <Comments blogId={blog._id} />
      </article>
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <h2 className="mb-5 text-2xl font-black text-ink dark:text-white">Related Blogs</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {related.filter((item) => item._id !== blog._id).map((item) => <BlogCard key={item._id} blog={item} />)}
        </div>
        <Link to="/search" className="mt-6 inline-block font-bold text-mint">Explore more blogs</Link>
      </section>
    </main>
  );
}
