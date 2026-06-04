import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, index: true },
    image: { type: String, default: "" },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

categorySchema.pre("validate", function buildSlug(next) {
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true, trim: true });
  }
  next();
});

export default mongoose.model("Category", categorySchema);
