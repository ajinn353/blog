import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Save,
  Send,
  Strikethrough,
  Underline,
  Undo2
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SEO from "../components/SEO";
import { api, toFormData } from "../services/api";

const blank = {
  title: "",
  shortDescription: "",
  content: "",
  thumbnailImage: null,
  featuredImagePlacement: "top",
  featuredImageSize: "full",
  category: "",
  tags: "",
  metaTitle: "",
  metaDescription: ""
};

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const selectionRef = useRef(null);
  const [form, setForm] = useState(blank);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [featuredPreview, setFeaturedPreview] = useState("");
  const [contentImage, setContentImage] = useState({ file: null, preview: "", size: "medium", placement: "center" });
  const isEditing = Boolean(id);

  useEffect(() => {
    api("/categories").then(setCategories);
  }, []);

  useEffect(() => {
    if (!id) return;
    api("/blogs/mine").then((blogs) => {
      const blog = blogs.find((item) => item._id === id);
      if (blog) {
        setForm({ ...blog, category: blog.category?._id || blog.category, tags: blog.tags?.join(", ") || "" });
        setFeaturedPreview(blog.thumbnailImage || "");
        setTimeout(() => {
          if (editorRef.current) editorRef.current.innerHTML = blog.content;
        });
      }
    });
  }, [id]);

  const format = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const formatBlock = (tag) => {
    format("formatBlock", tag);
  };

  const addLink = () => {
    const url = window.prompt("Paste the link URL");
    if (!url) return;
    format("createLink", url);
  };

  const saveSelection = () => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0);
    if (editorRef.current?.contains(range.commonAncestorContainer)) {
      selectionRef.current = range;
    }
  };

  const restoreSelection = () => {
    editorRef.current?.focus();
    const selection = window.getSelection();
    if (!selection || !selectionRef.current) return;
    selection.removeAllRanges();
    selection.addRange(selectionRef.current);
  };

  const insertHtmlAtCursor = (html) => {
    restoreSelection();
    document.execCommand("insertHTML", false, html);
    if (editorRef.current) {
      setForm((current) => ({ ...current, content: editorRef.current.innerHTML }));
    }
    saveSelection();
  };

  const chooseFeaturedImage = (file) => {
    if (!file) return;
    setForm({ ...form, thumbnailImage: file });
    const nextPreview = URL.createObjectURL(file);
    setFeaturedPreview(nextPreview);
  };

  const chooseContentImage = (file) => {
    if (!file) return;
    setContentImage((current) => ({
      ...current,
      file,
      preview: URL.createObjectURL(file)
    }));
  };

  const insertContentImage = async () => {
    if (!contentImage.file) {
      setMessage("Choose an image before inserting it into the article.");
      return;
    }

    const payload = new FormData();
    payload.append("image", contentImage.file);
    const { url } = await api("/uploads/image", { method: "POST", body: payload });
    const figureClass = `content-image content-image--${contentImage.size} content-image--${contentImage.placement}`;
    insertHtmlAtCursor(`<figure class="${figureClass}"><img src="${url}" alt="Article image" /></figure><p><br></p>`);
    setContentImage({ file: null, preview: "", size: contentImage.size, placement: contentImage.placement });
    setMessage("Image inserted into the article.");
  };

  const submit = async (status) => {
    const nextStatus = isEditing ? status || form.status || "draft" : status;
    const payload = toFormData({
      title: form.title,
      shortDescription: form.shortDescription,
      thumbnailImage: form.thumbnailImage instanceof File ? form.thumbnailImage : undefined,
      featuredImagePlacement: form.featuredImagePlacement,
      featuredImageSize: form.featuredImageSize,
      category: form.category,
      tags: form.tags,
      metaTitle: form.metaTitle,
      metaDescription: form.metaDescription,
      content: editorRef.current?.innerHTML || "",
      status: nextStatus
    });
    const path = id ? `/blogs/${id}` : "/blogs";
    const method = id ? "PUT" : "POST";
    const blog = await api(path, { method, body: payload });
    setForm((current) => ({ ...current, status: blog.status }));
    if (isEditing) {
      sessionStorage.setItem("toast", "Blog updated.");
      navigate(-1);
      return;
    }

    setMessage(status === "published" ? "Submitted for admin approval." : "Draft saved.");
    if (!id) navigate(`/editor/${blog._id}`, { replace: true });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <SEO title="Blog Editor | Inkline" />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-mint">Writer Studio</p>
          <h1 className="text-3xl font-black text-ink dark:text-white">Blog Editor</h1>
        </div>
        <div className="flex gap-2">
          {(!isEditing || form.status !== "published") && (
            <button onClick={() => submit("draft")} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 font-bold dark:border-slate-700"><Save className="h-4 w-4" /> Save Draft</button>
          )}
          <button onClick={() => submit(isEditing ? form.status : "published")} className="inline-flex items-center gap-2 rounded-md bg-mint px-4 py-2 font-bold text-white"><Send className="h-4 w-4" /> {isEditing ? "Update Blog" : "Publish Blog"}</button>
        </div>
      </div>
      {message && <p className="mb-4 rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</p>}
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          <input className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-3xl font-black outline-none dark:border-slate-700 dark:bg-slate-900" placeholder="Blog Title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value, metaTitle: event.target.value })} />
          <textarea className="min-h-28 w-full rounded-lg border border-slate-300 bg-white p-4 outline-none dark:border-slate-700 dark:bg-slate-900" placeholder="Short Description" value={form.shortDescription} onChange={(event) => setForm({ ...form, shortDescription: event.target.value, metaDescription: event.target.value })} />
          <div className="rounded-lg border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-wrap gap-1 border-b border-slate-200 p-2 dark:border-slate-800">
              <button type="button" title="Paragraph" className="rounded-md px-3 py-2 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => formatBlock("p")}>P</button>
              <button type="button" title="Heading 1" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => formatBlock("h1")}><Heading1 className="h-4 w-4" /></button>
              <button type="button" title="Heading 2" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => formatBlock("h2")}><Heading2 className="h-4 w-4" /></button>
              <button type="button" title="Heading 3" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => formatBlock("h3")}><Heading3 className="h-4 w-4" /></button>
              <span className="mx-1 h-9 w-px bg-slate-200 dark:bg-slate-800" />
              <button type="button" title="Bold" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => format("bold")}><Bold className="h-4 w-4" /></button>
              <button type="button" title="Italic" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => format("italic")}><Italic className="h-4 w-4" /></button>
              <button type="button" title="Underline" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => format("underline")}><Underline className="h-4 w-4" /></button>
              <button type="button" title="Strikethrough" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => format("strikeThrough")}><Strikethrough className="h-4 w-4" /></button>
              <button type="button" title="Link" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={addLink}><LinkIcon className="h-4 w-4" /></button>
              <span className="mx-1 h-9 w-px bg-slate-200 dark:bg-slate-800" />
              <button type="button" title="Bullet list" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => format("insertUnorderedList")}><List className="h-4 w-4" /></button>
              <button type="button" title="Numbered list" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => format("insertOrderedList")}><ListOrdered className="h-4 w-4" /></button>
              <button type="button" title="Quote" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => formatBlock("blockquote")}><Quote className="h-4 w-4" /></button>
              <span className="mx-1 h-9 w-px bg-slate-200 dark:bg-slate-800" />
              <button type="button" title="Align left" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => format("justifyLeft")}><AlignLeft className="h-4 w-4" /></button>
              <button type="button" title="Align center" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => format("justifyCenter")}><AlignCenter className="h-4 w-4" /></button>
              <button type="button" title="Align right" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => format("justifyRight")}><AlignRight className="h-4 w-4" /></button>
              <span className="mx-1 h-9 w-px bg-slate-200 dark:bg-slate-800" />
              <button type="button" title="Undo" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => format("undo")}><Undo2 className="h-4 w-4" /></button>
              <button type="button" title="Redo" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => format("redo")}><Redo2 className="h-4 w-4" /></button>
              <button type="button" title="Clear formatting" className="rounded-md p-2 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => format("removeFormat")}><Eraser className="h-4 w-4" /></button>
            </div>
            <div
              ref={editorRef}
              className="editor-content min-h-[420px] p-5 outline-none"
              contentEditable
              data-placeholder="Write your story..."
              onBlur={saveSelection}
              onFocus={saveSelection}
              onKeyUp={saveSelection}
              onMouseUp={saveSelection}
              onInput={(event) => setForm({ ...form, content: event.currentTarget.innerHTML })}
            />
          </div>
        </section>
        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <label className="mb-2 flex items-center gap-2 text-sm font-bold"><ImagePlus className="h-4 w-4" /> Featured Image</label>
            <input type="file" accept="image/*" onChange={(event) => chooseFeaturedImage(event.target.files[0])} />
            {featuredPreview && (
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                <img className="h-40 w-full object-cover" src={featuredPreview} alt="Featured preview" />
              </div>
            )}
            <label className="mt-4 block text-sm font-bold">Featured Placement</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                ["top", "Top"],
                ["left", "Left"],
                ["hidden", "Hide"]
              ].map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setForm({ ...form, featuredImagePlacement: value })}
                  className={`rounded-md border px-3 py-2 text-sm font-bold ${form.featuredImagePlacement === value ? "border-mint bg-mint text-white" : "border-slate-300 dark:border-slate-700"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-sm font-bold">Featured Size</label>
            <select className="mt-2 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={form.featuredImageSize} onChange={(event) => setForm({ ...form, featuredImageSize: event.target.value })}>
              <option value="full">Full size</option>
              <option value="medium">Medium size</option>
              <option value="small">Small size</option>
            </select>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <label className="mb-2 flex items-center gap-2 text-sm font-bold"><ImagePlus className="h-4 w-4" /> Image Inside Content</label>
            <input type="file" accept="image/*" onChange={(event) => chooseContentImage(event.target.files[0])} />
            {contentImage.preview && (
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                <img className="h-36 w-full object-cover" src={contentImage.preview} alt="Content preview" />
              </div>
            )}
            <label className="mt-4 block text-sm font-bold">Placement</label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {[
                ["center", AlignCenter, "Center"],
                ["left", AlignLeft, "Left"],
                ["right", AlignRight, "Right"]
              ].map(([value, Icon, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setContentImage({ ...contentImage, placement: value })}
                  className={`inline-flex items-center justify-center gap-1 rounded-md border px-2 py-2 text-sm font-bold ${contentImage.placement === value ? "border-mint bg-mint text-white" : "border-slate-300 dark:border-slate-700"}`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-sm font-bold">Size</label>
            <select className="mt-2 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={contentImage.size} onChange={(event) => setContentImage({ ...contentImage, size: event.target.value })}>
              <option value="full">Full size</option>
              <option value="medium">Medium size</option>
              <option value="small">Small size</option>
            </select>
            <button type="button" onClick={insertContentImage} className="mt-4 w-full rounded-md bg-ink px-4 py-2 font-bold text-white dark:bg-white dark:text-ink">
              Insert at Cursor
            </button>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <label className="text-sm font-bold">Category</label>
            <select className="mt-2 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} required>
              <option value="">Choose category</option>
              {categories.map((category) => <option value={category._id} key={category._id}>{category.name}</option>)}
            </select>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <label className="text-sm font-bold">Tags</label>
            <input className="mt-2 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" placeholder="react, node, ai" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} />
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <label className="text-sm font-bold">Meta Title</label>
            <input className="mt-2 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={form.metaTitle} onChange={(event) => setForm({ ...form, metaTitle: event.target.value })} />
            <label className="mt-3 block text-sm font-bold">Meta Description</label>
            <textarea className="mt-2 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" value={form.metaDescription} onChange={(event) => setForm({ ...form, metaDescription: event.target.value })} />
          </div>
        </aside>
      </div>
    </main>
  );
}
