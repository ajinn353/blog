import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    shortDescription: { type: String, required: true, maxlength: 240 },
    content: { type: String, required: true },
    thumbnailImage: { type: String, default: "" },
    featuredImagePlacement: { type: String, enum: ["top", "left", "hidden"], default: "top" },
    featuredImageSize: { type: String, enum: ["full", "medium", "small"], default: "full" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: String, trim: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["draft", "published", "pending", "rejected"], default: "draft" },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    commentsCount: { type: Number, default: 0 },
    metaTitle: { type: String, trim: true },
    metaDescription: { type: String, trim: true }
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", tags: "text", shortDescription: "text" });

blogSchema.virtual("likesCount").get(function likesCount() {
  return this.likes?.length || 0;
});

blogSchema.set("toJSON", { virtuals: true });
blogSchema.set("toObject", { virtuals: true });

export default mongoose.model("Blog", blogSchema);
