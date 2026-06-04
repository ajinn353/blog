import Category from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fileUrl } from "../middleware/upload.js";

export const getCategories = asyncHandler(async (_req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
    description: req.body.description,
    image: fileUrl(req, req.file)
  });
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      image: req.file ? fileUrl(req, req.file) : req.body.image
    },
    { new: true, runValidators: true }
  );

  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json({ message: "Category deleted" });
});
