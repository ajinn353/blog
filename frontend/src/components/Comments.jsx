import { Edit3, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function Comments({ blogId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    if (blogId) api(`/comments/${blogId}`).then(setComments);
  }, [blogId]);

  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    if (editing) {
      const updated = await api(`/comments/${editing}`, { method: "PUT", body: { comment: text } });
      setComments((items) => items.map((item) => (item._id === editing ? { ...item, comment: updated.comment } : item)));
      setEditing(null);
    } else {
      const created = await api("/comments", { method: "POST", body: { blogId, comment: text } });
      setComments((items) => [created, ...items]);
    }
    setText("");
  };

  const remove = async (id) => {
    await api(`/comments/${id}`, { method: "DELETE" });
    setComments((items) => items.filter((item) => item._id !== id));
  };

  return (
    <section className="mt-12 space-y-5">
      <h2 className="text-2xl font-black text-ink dark:text-white">Comments</h2>
      {user && (
        <form className="space-y-3" onSubmit={submit}>
          <textarea className="min-h-28 w-full rounded-lg border border-slate-300 bg-white p-3 dark:border-slate-700 dark:bg-slate-900" value={text} onChange={(event) => setText(event.target.value)} placeholder="Join the conversation" />
          <button className="rounded-md bg-mint px-4 py-2 font-bold text-white">{editing ? "Update Comment" : "Add Comment"}</button>
        </form>
      )}
      <div className="space-y-3">
        {comments.map((item) => (
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900" key={item._id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold text-ink dark:text-white">{item.userId?.name}</p>
                <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
              </div>
              {(user?._id === item.userId?._id || user?.role === "admin") && (
                <div className="flex gap-1">
                  <button className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => { setEditing(item._id); setText(item.comment); }}>
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => remove(item._id)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="mt-3 text-slate-700 dark:text-slate-300">{item.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
