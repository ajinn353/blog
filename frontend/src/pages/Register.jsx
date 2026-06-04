import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="mx-auto grid min-h-[80vh] max-w-6xl items-center px-4 py-12 lg:grid-cols-2">
      <SEO title="Register | Inkline Blog" />
      <div>
        <h1 className="text-4xl font-black text-ink dark:text-white">Create your account</h1>
        <p className="mt-3 max-w-md text-slate-600 dark:text-slate-300">Build a profile, publish drafts, and grow your own writing space.</p>
      </div>
      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {error && <p className="mb-3 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <label className="text-sm font-bold">Name</label>
        <input className="mb-4 mt-1 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <label className="text-sm font-bold">Email</label>
        <input className="mb-4 mt-1 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <label className="text-sm font-bold">Password</label>
        <input className="mb-4 mt-1 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <button className="w-full rounded-md bg-mint px-4 py-3 font-black text-white">Register</button>
        <p className="mt-4 text-sm">Already registered? <Link className="font-bold text-mint" to="/login">Login</Link></p>
      </form>
    </main>
  );
}
