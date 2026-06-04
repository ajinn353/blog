import slugify from "slugify";
import Blog from "../models/Blog.js";

export const createUniqueSlug = async (title, existingId) => {
  const base = slugify(title, { lower: true, strict: true, trim: true });
  let slug = base || `post-${Date.now()}`;
  let suffix = 1;

  while (await Blog.exists({ slug, ...(existingId ? { _id: { $ne: existingId } } : {}) })) {
    slug = `${base}-${suffix++}`;
  }

  return slug;
};
