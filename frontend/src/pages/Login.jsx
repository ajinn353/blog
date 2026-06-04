import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const googleRef = useRef(null);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      const user = await login(form);
      navigate(location.state?.from?.pathname || (user.role === "admin" ? "/admin" : "/"));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !googleRef.current) return;
    const mountButton = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          const user = await googleLogin(credential);
          navigate(user.role === "admin" ? "/admin" : "/");
        }
      });
      window.google.accounts.id.renderButton(googleRef.current, { theme: "outline", size: "large", width: "100%" });
    };

    if (window.google?.accounts?.id) {
      mountButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = mountButton;
    document.body.appendChild(script);
  }, [googleLogin, navigate]);

  return (
    <main className="mx-auto grid min-h-[80vh] max-w-6xl items-center px-4 py-12 lg:grid-cols-2">
      <SEO title="Login | Inkline Blog" />
      <div>
        <h1 className="text-4xl font-black text-ink dark:text-white">Welcome back</h1>
        <p className="mt-3 max-w-md text-slate-600 dark:text-slate-300">Sign in to publish blogs, manage drafts, save bookmarks, and join conversations.</p>
      </div>
      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {error && <p className="mb-3 rounded-md bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <label className="text-sm font-bold">Email</label>
        <input className="mb-4 mt-1 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        <label className="text-sm font-bold">Password</label>
        <input className="mb-5 mt-1 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
        <button className="w-full rounded-md bg-ink px-4 py-3 font-black text-white dark:bg-white dark:text-ink">Login</button>
        <div className="my-4 flex items-center gap-3 text-xs font-bold uppercase text-slate-400"><span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" /> or <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" /></div>
        <div ref={googleRef} />
        <p className="mt-4 text-sm">New here? <Link className="font-bold text-mint" to="/register">Create an account</Link></p>
      </form>
    </main>
  );
}
