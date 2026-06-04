import { Bookmark, Camera, Check, Crop, Mail, Save, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";
import { api, toFormData } from "../services/api";

const defaultCover = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80";

export default function Profile() {
  const { user, setUser, loadProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [form, setForm] = useState({ name: "", profileImage: null, coverImage: null });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [cropSource, setCropSource] = useState("");
  const [cropSettings, setCropSettings] = useState({ zoom: 1, x: 50, y: 50 });
  const [myBlogs, setMyBlogs] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    setForm({ name: user.name || "", profileImage: null, coverImage: null });
    setAvatarPreview(user.profileImage || "");
    setCoverPreview(user.coverImage || "");
  }, [user]);

  useEffect(() => {
    api("/blogs/mine").then(setMyBlogs).catch(() => setMyBlogs([]));
  }, []);

  const updateProfile = async (values, successMessage = "Profile updated.") => {
    setSaving(true);
    setMessage("");
    try {
      const updated = await api("/auth/profile", { method: "PUT", body: toFormData(values) });
      setUser((current) => ({ ...current, ...updated }));
      await loadProfile();
      setMessage(successMessage);
      return updated;
    } catch (err) {
      setMessage(err.message);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const chooseAvatar = (file) => {
    if (!file) return;
    setCropSource(URL.createObjectURL(file));
    setCropSettings({ zoom: 1, x: 50, y: 50 });
  };

  const chooseCover = async (file) => {
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    setForm((current) => ({ ...current, coverImage: file }));
    await updateProfile({ name: form.name, coverImage: file }, "Cover image updated.");
  };

  const saveName = async (event) => {
    event.preventDefault();
    await updateProfile({ name: form.name }, "Profile details updated.");
  };

  const applyAvatarCrop = async () => {
    if (!cropSource) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = cropSource;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const zoom = Number(cropSettings.zoom);
    const cropSide = Math.min(img.naturalWidth, img.naturalHeight) / zoom;
    const maxX = img.naturalWidth - cropSide;
    const maxY = img.naturalHeight - cropSide;
    const sourceX = (Number(cropSettings.x) / 100) * maxX;
    const sourceY = (Number(cropSettings.y) / 100) * maxY;

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, sourceX, sourceY, cropSide, cropSide, 0, 0, 640, 640);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (!blob) return;

    const file = new File([blob], "profile-image.jpg", { type: "image/jpeg" });
    setAvatarPreview(URL.createObjectURL(blob));
    setForm((current) => ({ ...current, profileImage: file }));
    setCropSource("");
    await updateProfile({ name: form.name, profileImage: file }, "Profile image updated.");
  };

  const cropPreviewStyle = {
    height: `${Number(cropSettings.zoom) * 100}%`,
    left: `${50 - Number(cropSettings.x) * (Number(cropSettings.zoom) - 1)}%`,
    maxWidth: "none",
    top: `${50 - Number(cropSettings.y) * (Number(cropSettings.zoom) - 1)}%`,
    transform: "translate(-50%, -50%)",
    width: `${Number(cropSettings.zoom) * 100}%`
  };

  const tabs = [
    ["posts", "Posts"],
    ["about", "About"],
    ["bookmarks", "Bookmarks"],
    ["followers", "Followers"],
    ["following", "Following"],
    ["settings", "Settings"]
  ];

  const avatarSrc = avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=2f9f89&color=fff`;
  const coverSrc = coverPreview || defaultCover;

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <SEO title="Profile | Inkline" />

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="group relative z-0 h-56 max-h-64 overflow-hidden bg-slate-200 dark:bg-slate-800 md:h-64">
          <img className="h-full w-full object-cover" src={coverSrc} alt="Profile cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-transparent to-ink/45" />
          <input ref={coverInputRef} className="hidden" type="file" accept="image/*" onChange={(event) => chooseCover(event.target.files[0])} />
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-black text-ink opacity-0 shadow-md transition hover:bg-slate-100 group-hover:opacity-100"
          >
            <Camera className="h-4 w-4" />
            Replace Cover
          </button>
          <div className="absolute inset-x-0 top-14 px-4 text-center text-white">
            <p className="break-words text-3xl font-black drop-shadow">{user?.name || "Inkline Writer"}</p>
            <p className="mt-2 text-sm font-semibold drop-shadow">Writer - Reader - Community Member</p>
          </div>
        </div>

        <div className="relative z-10 px-5 pb-6">
          <div className="-mt-12 flex min-w-0 flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-end">
            <div className="relative z-20 h-36 w-36 flex-shrink-0">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md dark:border-slate-900 dark:bg-slate-800">
                <img className="block h-full w-full object-cover" src={avatarSrc} alt={user?.name} />
              </div>
              <input ref={avatarInputRef} className="hidden" type="file" accept="image/*" onChange={(event) => chooseAvatar(event.target.files[0])} />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-5 right-5 rounded-full bg-black/40 p-2 text-white shadow-md ring-4 ring-white dark:bg-white dark:text-ink dark:ring-slate-900"
                title="Replace profile image"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>

            <div className="min-w-0 flex-1 pb-2 ">
              <div className="flex min-w-0 flex-wrap items-center gap-4 pt-16">
                <h1 className="max-w-full break-words text-3xl font-black leading-tight text-ink dark:text-white">{user?.name}</h1>
              </div>
              <p className="text-slate-500">{user?.email}</p>
              <div className="mt-2 flex flex-wrap gap-4">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{myBlogs.length} posts</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{user?.following?.length || 0} following</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{user?.followersCount || 0} followers</span>
              </div>
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 py-3 text-sm font-bold text-slate-500 dark:border-slate-800">
            {tabs.map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setActiveTab(value)}
                className={`rounded-md px-3 py-2 ${activeTab === value ? "bg-mint/10 text-mint" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                {label}
              </button>
            ))}
          </nav>

          {message && <p className="mt-5 rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</p>}
        </div>
      </section>

      <section className="mt-8">
        {activeTab === "posts" && (
          <ProfilePanel title="Posts">
            {myBlogs.length ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
              </div>
            ) : (
              <EmptyState text="No posts yet." />
            )}
          </ProfilePanel>
        )}

        {activeTab === "about" && (
          <ProfilePanel title="About">
            <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
              <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={user?.email} />
              <InfoRow icon={<Users className="h-4 w-4" />} label="Following" value={`${user?.following?.length || 0} people`} />
              <InfoRow icon={<Bookmark className="h-4 w-4" />} label="Bookmarks" value={`${user?.bookmarks?.length || 0} saved blogs`} />
              <InfoRow label="Joined" value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"} />
            </div>
          </ProfilePanel>
        )}

        {activeTab === "bookmarks" && (
          <ProfilePanel title="Bookmarks">
            {user?.bookmarks?.length ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {user.bookmarks.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
              </div>
            ) : (
              <EmptyState text="No saved blogs yet." />
            )}
          </ProfilePanel>
        )}

        {activeTab === "following" && (
          <ProfilePanel title="Following">
            {user?.following?.length ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {user.following.map((person) => <PersonCard key={person._id} person={person} />)}
              </div>
            ) : (
              <EmptyState text="You are not following anyone yet." />
            )}
          </ProfilePanel>
        )}

        {activeTab === "followers" && (
          <ProfilePanel title="Followers">
            {user?.followers?.length ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {user.followers.map((person) => <PersonCard key={person._id} person={person} />)}
              </div>
            ) : (
              <EmptyState text="No followers yet." />
            )}
          </ProfilePanel>
        )}

        {activeTab === "settings" && (
          <ProfilePanel title="Settings">
            <form onSubmit={saveName} className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <label className="mb-2 block text-sm font-bold">Name</label>
                <input
                  className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-3 outline-none focus:ring-2 focus:ring-mint/25 dark:border-slate-700"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  required
                />
                <p className="mt-2 text-sm text-slate-500">Email is used for login and is not editable here.</p>
              </div>
              <button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-md bg-mint px-5 py-3 font-black text-white disabled:opacity-60">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </ProfilePanel>
        )}
      </section>

      {cropSource && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-5 shadow-2xl dark:bg-slate-900">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Crop className="h-5 w-5 text-mint" />
                <h2 className="text-xl font-black text-ink dark:text-white">Crop Profile Image</h2>
              </div>
              <button type="button" onClick={() => setCropSource("")} className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-6 py-5 md:grid-cols-[260px_1fr] md:items-center">
              <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full bg-slate-200 ring-8 ring-slate-100 dark:bg-slate-800 dark:ring-slate-950">
                <img className="absolute object-cover" src={cropSource} alt="Crop preview" style={cropPreviewStyle} />
              </div>
              <div className="space-y-4">
                <CropSlider label="Zoom" min="1" max="3" step="0.05" value={cropSettings.zoom} onChange={(value) => setCropSettings({ ...cropSettings, zoom: value })} />
                <CropSlider label="Move Left / Right" min="0" max="100" value={cropSettings.x} onChange={(value) => setCropSettings({ ...cropSettings, x: value })} />
                <CropSlider label="Move Up / Down" min="0" max="100" value={cropSettings.y} onChange={(value) => setCropSettings({ ...cropSettings, y: value })} />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
              <button type="button" onClick={() => setCropSource("")} className="rounded-md border border-slate-300 px-4 py-2 font-bold dark:border-slate-700">Cancel</button>
              <button type="button" onClick={applyAvatarCrop} className="inline-flex items-center gap-2 rounded-md bg-mint px-4 py-2 font-bold text-white">
                <Check className="h-4 w-4" />
                Apply & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function ProfilePanel({ title, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-2xl font-black text-ink dark:text-white">{title}</h2>
      {children}
    </div>
  );
}

function EmptyState({ text }) {
  return <p className="rounded-lg bg-slate-50 p-6 text-center font-bold text-slate-500 dark:bg-slate-950">{text}</p>;
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
      <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500">{icon}{label}</p>
      <p className="mt-2 font-bold text-ink dark:text-white">{value}</p>
    </div>
  );
}

function PersonCard({ person }) {
  return (
    <Link to={`/users/${person._id}`} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <img className="h-full w-full object-cover" src={person.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || "User")}&background=2f9f89&color=fff`} alt={person.name} />
      </div>
      <div>
        <p className="font-black text-ink dark:text-white">{person.name}</p>
        <p className="text-sm text-slate-500">View profile</p>
      </div>
    </Link>
  );
}

function CropSlider({ label, value, onChange, min, max, step = "1" }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <input className="w-full accent-mint" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
