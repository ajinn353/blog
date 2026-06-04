import { Bookmark, CalendarDays, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BlogCard from "../components/BlogCard";
import SEO from "../components/SEO";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

const defaultCover = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=80";

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loadProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPublicProfile = async () => {
    setLoading(true);
    const data = await api(`/users/${id}`);
    setProfile(data.user);
    setPosts(data.posts || []);
    setFollowers(data.followers || []);
    setFollowing(data.following || []);
    setLoading(false);
  };

  useEffect(() => {
    loadPublicProfile().catch(() => setLoading(false));
  }, [id]);

  const toggleFollow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    await api(`/auth/follow/${id}`, { method: "POST" });
    await Promise.all([loadPublicProfile(), loadProfile()]);
  };

  if (loading) return <main className="mx-auto max-w-6xl px-4 py-16">Loading...</main>;
  if (!profile) return <main className="mx-auto max-w-6xl px-4 py-16">User not found.</main>;
  if (profile.isSelf) {
    navigate("/profile", { replace: true });
    return null;
  }

  const avatarSrc = profile.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "User")}&background=2f9f89&color=fff`;
  const coverSrc = profile.coverImage || defaultCover;
  const tabs = [
    ["posts", "Posts"],
    ["about", "About"],
    ["followers", "Followers"],
    ["following", "Following"]
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <SEO title={`${profile.name} | Inkline`} />
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative z-0 h-56 max-h-64 overflow-hidden bg-slate-200 dark:bg-slate-800 md:h-64">
          <img className="h-full w-full object-cover" src={coverSrc} alt={`${profile.name} cover`} />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/10 via-transparent to-ink/45" />
          <div className="absolute inset-x-0 top-14 px-4 text-center text-white">
            <p className="break-words text-3xl font-black drop-shadow">{profile.name}</p>
            <p className="mt-2 text-sm font-semibold drop-shadow">Inkline writer</p>
          </div>
        </div>

        <div className="relative z-10 px-5 pb-6">
          <div className="-mt-12 flex min-w-0 flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end">
              <div className="relative z-20 h-32 w-32 flex-shrink-0 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md dark:border-slate-900 dark:bg-slate-800">
                <img className="h-full w-full object-cover" src={avatarSrc} alt={profile.name} />
              </div>
              <div className="min-w-0 pb-2">
                <h1 className="break-words text-3xl font-black leading-tight text-ink dark:text-white">{profile.name}</h1>
                <div className="mt-2 flex flex-wrap gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{posts.length} posts</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{profile.followingCount || 0} following</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{profile.followersCount || 0} followers</span>
                </div>
              </div>
            </div>

            <button onClick={toggleFollow} className={`mb-2 inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 font-black text-white ${profile.isFollowing ? "bg-coral" : "bg-mint"}`}>
              <UserPlus className="h-4 w-4" />
              {profile.isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>

          <nav className="flex gap-1 overflow-x-auto border-b border-slate-200 py-3 text-sm font-bold text-slate-500 dark:border-slate-800">
            {tabs.map(([value, label]) => (
              <button key={value} type="button" onClick={() => setActiveTab(value)} className={`rounded-md px-3 py-2 ${activeTab === value ? "bg-mint/10 text-mint" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                {label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      <section className="mt-8">
        {activeTab === "posts" && (
          <ProfilePanel title="Posts">
            {posts.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((blog) => <BlogCard key={blog._id} blog={blog} />)}</div> : <EmptyState text="No public posts yet." />}
          </ProfilePanel>
        )}

        {activeTab === "about" && (
          <ProfilePanel title="About">
            <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-2">
              <InfoRow icon={<CalendarDays className="h-4 w-4" />} label="Joined" value={profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Recently"} />
              <InfoRow icon={<Bookmark className="h-4 w-4" />} label="Posts" value={`${posts.length} public posts`} />
              <InfoRow icon={<Users className="h-4 w-4" />} label="Followers" value={`${profile.followersCount || 0} followers`} />
              <InfoRow icon={<Users className="h-4 w-4" />} label="Following" value={`${profile.followingCount || 0} following`} />
            </div>
          </ProfilePanel>
        )}

        {activeTab === "followers" && (
          <ProfilePanel title="Followers">
            {followers.length ? <PeopleGrid people={followers} /> : <EmptyState text="No followers yet." />}
          </ProfilePanel>
        )}

        {activeTab === "following" && (
          <ProfilePanel title="Following">
            {following.length ? <PeopleGrid people={following} /> : <EmptyState text="Not following anyone yet." />}
          </ProfilePanel>
        )}
      </section>
    </main>
  );
}

function PeopleGrid({ people }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {people.map((person) => (
        <Link key={person._id} to={`/users/${person._id}`} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <img className="h-full w-full object-cover" src={person.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || "User")}&background=2f9f89&color=fff`} alt={person.name} />
          </div>
          <div>
            <p className="font-black text-ink dark:text-white">{person.name}</p>
            <p className="text-sm text-slate-500">View profile</p>
          </div>
        </Link>
      ))}
    </div>
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
