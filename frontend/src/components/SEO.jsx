import { useEffect } from "react";

const setMeta = (name, content, property = false) => {
  if (!content) return;
  const attr = property ? "property" : "name";
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

export default function SEO({ title = "Inkline Blog", description = "A modern MERN blog platform.", image = "" }) {
  useEffect(() => {
    document.title = title;
    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:image", image, true);
  }, [title, description, image]);

  return null;
}
