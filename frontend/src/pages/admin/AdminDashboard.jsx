import { CheckCircle2, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import SEO from "../../components/SEO";
import { api } from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [comments, setComments] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ _id: "", name: "", description: "", image: null });

  const load = async () => {
    const [dashboard, allUsers, allBlogs, allCategories, allComments] = await Promise.all([
      api("/admin/dashboard"),
      api("/admin/users"),
      api("/admin/blogs"),
      api("/categories"),
      api("/admin/comments")
    ]);
    setStats(dashboard);
    setUsers(allUsers);
    setBlogs(allBlogs);
    setCategories(allCategories);
    setComments(allComments);
  };

  useEffect(() => {
    load();
  }, []);

  const moderate = async (id, status) => {
    const updated = await api(`/admin/blogs/${id}/status`, { method: "PATCH", body: { status } });
    setBlogs((items) => items.map((item) => (item._id === id ? { ...item, status: updated.status } : item)));
  };

  const deleteUser = async (id) => {
    await api(`/admin/users/${id}`, { method: "DELETE" });
    setUsers((items) => items.filter((item) => item._id !== id));
  };

  const blockUser = async (id) => {
    const updated = await api(`/admin/users/${id}/block`, { method: "PATCH" });
    setUsers((items) => items.map((item) => (item._id === id ? updated : item)));
  };

  const deleteBlog = async (id) => {
    await api(`/admin/blogs/${id}`, { method: "DELETE" });
    setBlogs((items) => items.filter((item) => item._id !== id));
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append("name", categoryForm.name);
    form.append("description", categoryForm.description);
    if (categoryForm.image) form.append("image", categoryForm.image);
    const path = categoryForm._id ? `/categories/${categoryForm._id}` : "/categories";
    await api(path, { method: categoryForm._id ? "PUT" : "POST", body: form });
    setCategoryForm({ _id: "", name: "", description: "", image: null });
    load();
  };

  const deleteCategory = async (id) => {
    await api(`/categories/${id}`, { method: "DELETE" });
    setCategories((items) => items.filter((item) => item._id !== id));
  };

  const deleteComment = async (id) => {
    await api(`/comments/${id}`, { method: "DELETE" });
    setComments((items) => items.filter((item) => item._id !== id));
  };

  const statItems = stats ? [
    ["Total Users", stats.totalUsers],
    ["Total Blogs", stats.totalBlogs],
    ["Published Blogs", stats.publishedBlogs],
    ["Draft Blogs", stats.draftBlogs],
    ["Categories", stats.categories],
    ["Comments", stats.comments],
    ["Subscribers", stats.subscribers]
  ] : [];

  return (
    <div className="space-y-10">
      <SEO title="Admin Dashboard | Inkline" />
      <section id="dashboard">
        <h1 className="mb-5 text-3xl font-black text-ink dark:text-white">Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statItems.map(([label, value]) => (
            <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-sm font-bold text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-black text-ink dark:text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="blogs" className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-2xl font-black text-ink dark:text-white">Blog Management</h2>
        <div className="space-y-3">
          {blogs.map((blog) => (
            <div key={blog._id} className="grid gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800 lg:grid-cols-[1fr_120px_170px] lg:items-center">
              <div>
                <p className="font-black">{blog.title}</p>
                <p className="text-sm text-slate-500">By {blog.author?.name} in {blog.category?.name}</p>
              </div>
              <span className="rounded-md bg-slate-100 px-3 py-1 text-center text-sm font-bold dark:bg-slate-800">{blog.status}</span>
              <div className="flex gap-2 lg:justify-end">
                <button className="rounded-md p-2 text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => moderate(blog._id, "published")}><CheckCircle2 className="h-5 w-5" /></button>
                <button className="rounded-md p-2 text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => moderate(blog._id, "rejected")}><XCircle className="h-5 w-5" /></button>
                <button className="rounded-md p-2 text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => deleteBlog(blog._id)}><Trash2 className="h-5 w-5" /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="users" className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-2xl font-black text-ink dark:text-white">Users Management</h2>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user._id} className="grid gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800 md:grid-cols-[1fr_100px_180px] md:items-center">
              <div>
                <p className="font-black">{user.name}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
              <span className="font-bold">{user.role}</span>
              <div className="flex gap-2 md:justify-end">
                <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold dark:border-slate-700" onClick={() => blockUser(user._id)}>{user.isBlocked ? "Unblock" : "Block"}</button>
                <button className="rounded-md bg-red-600 px-3 py-2 text-sm font-bold text-white" onClick={() => deleteUser(user._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="categories" className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-2xl font-black text-ink dark:text-white">Category Management</h2>
        <form className="mb-5 grid gap-3 md:grid-cols-[180px_1fr_180px_120px]" onSubmit={saveCategory}>
          <input className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Name" value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} required />
          <input className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="Description" value={categoryForm.description} onChange={(event) => setCategoryForm({ ...categoryForm, description: event.target.value })} />
          <input className="rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" type="file" accept="image/*" onChange={(event) => setCategoryForm({ ...categoryForm, image: event.target.files[0] })} />
          <button className="rounded-md bg-mint px-4 py-2 font-bold text-white">{categoryForm._id ? "Save" : "Add"}</button>
        </form>
        <div className="grid gap-3 md:grid-cols-2">
          {categories.map((category) => (
            <div key={category._id} className="flex items-start justify-between gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <div>
                <p className="font-black">{category.name}</p>
                <p className="text-sm text-slate-500">{category.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="rounded-md border border-slate-300 px-3 py-2 text-sm font-bold dark:border-slate-700" onClick={() => setCategoryForm({ _id: category._id, name: category.name, description: category.description, image: null })}>Edit</button>
                <button className="rounded-md p-2 text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => deleteCategory(category._id)}><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="comments" className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-2xl font-black text-ink dark:text-white">Comments</h2>
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment._id} className="flex items-start justify-between gap-3 rounded-md border border-slate-200 p-3 dark:border-slate-800">
              <div>
                <p className="text-sm text-slate-500">{comment.userId?.name} on {comment.blogId?.title}</p>
                <p className="mt-1">{comment.comment}</p>
              </div>
              <button className="rounded-md p-2 text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => deleteComment(comment._id)}><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </section>

      <section id="settings" className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-black text-ink dark:text-white">Settings</h2>
        <p className="mt-2 text-slate-500">Configure MongoDB, JWT, and client URLs in backend/.env for each environment.</p>
      </section>
    </div>
  );
}
