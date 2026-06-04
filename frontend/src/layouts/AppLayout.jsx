import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function AppLayout() {
  const location = useLocation();
  const [toast, setToast] = useState("");

  useEffect(() => {
    const nextToast = sessionStorage.getItem("toast");
    if (!nextToast) return;

    sessionStorage.removeItem("toast");
    setToast(nextToast);
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#f7f7f3] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      {toast && (
        <div className="fixed right-4 top-20 z-[70] flex items-center gap-3 rounded-lg border border-emerald-200 bg-white px-4 py-3 font-bold text-emerald-700 shadow-lg dark:border-emerald-900 dark:bg-slate-900 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5" />
          {toast}
        </div>
      )}
      <Outlet />
      <Footer />
    </div>
  );
}
