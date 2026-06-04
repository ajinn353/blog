import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Blog from "./models/Blog.js";
import Category from "./models/Category.js";
import Comment from "./models/Comment.js";
import Newsletter from "./models/Newsletter.js";
import User from "./models/User.js";

dotenv.config();

const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`;

const categoryData = [
  {
    name: "Technology",
    image: image("photo-1518770660439-4636190af475"),
    description: "Tools, gadgets, platforms, and digital culture."
  },
  {
    name: "Programming",
    image: image("photo-1515879218367-8466d910aaa4"),
    description: "Code tutorials, patterns, and engineering notes."
  },
  {
    name: "AI",
    image: image("photo-1677442136019-21780ecad995"),
    description: "Artificial intelligence research, products, and workflows."
  },
  {
    name: "Business",
    image: image("photo-1556761175-b413da4baf72"),
    description: "Startups, leadership, growth, and operations."
  },
  {
    name: "Education",
    image: image("photo-1524995997946-a1c2e315a42f"),
    description: "Learning guides, teaching, and career development."
  },
  {
    name: "Travel",
    image: image("photo-1500530855697-b586d89ba3ee"),
    description: "Places, planning, and stories from the road."
  }
];

const usersData = [
  {
    name: "Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    profileImage: "https://ui-avatars.com/api/?name=Admin&background=18212f&color=fff"
  },
  {
    name: "Maya Chen",
    email: "maya@example.com",
    password: "password123",
    role: "user",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Arjun Mehta",
    email: "arjun@example.com",
    password: "password123",
    role: "user",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Sofia Rivera",
    email: "sofia@example.com",
    password: "password123",
    role: "user",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Noah Brooks",
    email: "noah@example.com",
    password: "password123",
    role: "user",
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80"
  }
];

const blogTemplates = [
  {
    title: "How AI Assistants Are Changing Everyday Work",
    slug: "how-ai-assistants-are-changing-everyday-work",
    shortDescription: "A practical look at where AI copilots save time, where they still need judgment, and how teams can adopt them responsibly.",
    category: "AI",
    tags: ["AI", "Productivity", "Future of Work"],
    thumbnailImage: image("photo-1677756119517-756a188d2d94"),
    status: "published",
    views: 1420
  },
  {
    title: "A Clean React Folder Structure for Growing Apps",
    slug: "clean-react-folder-structure-for-growing-apps",
    shortDescription: "Keep React projects understandable with simple boundaries for pages, components, hooks, context, services, and layouts.",
    category: "Programming",
    tags: ["React", "Vite", "Frontend"],
    thumbnailImage: image("photo-1555066931-4365d14bab8c"),
    status: "published",
    views: 980
  },
  {
    title: "MongoDB Indexes Every Blog Platform Should Have",
    slug: "mongodb-indexes-every-blog-platform-should-have",
    shortDescription: "Search, slugs, author dashboards, category filters, and timestamps all become faster with the right MongoDB indexes.",
    category: "Technology",
    tags: ["MongoDB", "Database", "Performance"],
    thumbnailImage: image("photo-1558494949-ef010cbdcc31"),
    status: "published",
    views: 770
  },
  {
    title: "From Draft to Published: A Better Writing Workflow",
    slug: "from-draft-to-published-a-better-writing-workflow",
    shortDescription: "A repeatable editorial flow for capturing ideas, shaping drafts, collecting feedback, and publishing with confidence.",
    category: "Education",
    tags: ["Writing", "Learning", "Workflow"],
    thumbnailImage: image("photo-1455390582262-044cdead277a"),
    status: "published",
    views: 615
  },
  {
    title: "What Founders Should Track Before Scaling",
    slug: "what-founders-should-track-before-scaling",
    shortDescription: "A calm dashboard of customer, revenue, retention, and operating metrics can keep growth from becoming guesswork.",
    category: "Business",
    tags: ["Startups", "Analytics", "Growth"],
    thumbnailImage: image("photo-1551836022-d5d88e9218df"),
    status: "published",
    views: 880
  },
  {
    title: "A Weekend Guide to Remote Work Travel",
    slug: "a-weekend-guide-to-remote-work-travel",
    shortDescription: "How to plan a short work-friendly escape with reliable internet, gentle pacing, and room to actually enjoy the place.",
    category: "Travel",
    tags: ["Travel", "Remote Work", "Planning"],
    thumbnailImage: image("photo-1500530855697-b586d89ba3ee"),
    status: "published",
    views: 540
  },
  {
    title: "Building Admin Dashboards That People Can Scan",
    slug: "building-admin-dashboards-that-people-can-scan",
    shortDescription: "Useful dashboards prioritize density, hierarchy, and fast decisions over decoration.",
    category: "Programming",
    tags: ["UI", "Admin", "Design"],
    thumbnailImage: image("photo-1460925895917-afdab827c52f"),
    status: "pending",
    views: 120
  },
  {
    title: "Notes on Prompting for Better Technical Writing",
    slug: "notes-on-prompting-for-better-technical-writing",
    shortDescription: "A draft collection of prompts that help outline tutorials, inspect code, and improve explanations.",
    category: "AI",
    tags: ["Prompting", "Draft", "Technical Writing"],
    thumbnailImage: image("photo-1516321318423-f06f85e504b3"),
    status: "draft",
    views: 35
  }
];

const body = (title, category) => `
  <h2>${title}</h2>
  <p>Great blog posts start with a clear promise. This demo article shows how rich text content appears in the reader view, including headings, paragraphs, and practical structure for a modern publishing platform.</p>
  <p>The ${category} category is a useful home for focused, scannable writing. Readers should be able to understand the key idea quickly, then move deeper into details as the article develops.</p>
  <h3>Key Takeaways</h3>
  <ul>
    <li>Keep the introduction direct and helpful.</li>
    <li>Use short sections to make the article easy to scan.</li>
    <li>Pair strong metadata with a readable slug for SEO.</li>
  </ul>
  <p>From here, authors can expand the draft in the editor, upload a featured image, add tags, save revisions, and publish when the article is ready for admin approval.</p>
`;

await connectDB();

const shouldReset = process.argv.includes("--reset");

if (shouldReset) {
  await Promise.all([
    Blog.deleteMany({}),
    Comment.deleteMany({}),
    Category.deleteMany({}),
    Newsletter.deleteMany({}),
    User.deleteMany({})
  ]);
}

const categories = await Promise.all(
  categoryData.map((category) =>
    Category.findOneAndUpdate(
      { name: category.name },
      category,
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    )
  )
);
const categoryByName = Object.fromEntries(categories.map((category) => [category.name, category]));

const hashedUsers = await Promise.all(
  usersData.map(async (user) => ({
    ...user,
    password: await bcrypt.hash(user.password, 12)
  }))
);
const users = await Promise.all(
  hashedUsers.map((user) =>
    User.findOneAndUpdate(
      { email: user.email },
      user,
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    )
  )
);
const [admin, maya, arjun, sofia, noah] = users;

const authors = [maya, arjun, sofia, noah];
const blogs = await Promise.all(
  blogTemplates.map((blog, index) =>
    Blog.findOneAndUpdate(
      { slug: blog.slug },
      {
        ...blog,
        content: body(blog.title, blog.category),
        category: categoryByName[blog.category]._id,
        author: authors[index % authors.length]._id,
        likes: authors.filter((_, userIndex) => (index + userIndex) % 2 === 0).map((user) => user._id),
        metaTitle: `${blog.title} | Inkline Blog`,
        metaDescription: blog.shortDescription
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    )
  )
);

const comments = [];
for (const blog of blogs.slice(0, 6)) {
  comments.push(
    {
      blogId: blog._id,
      userId: admin._id,
      comment: "Strong topic. This is a useful example for the demo content library."
    },
    {
      blogId: blog._id,
      userId: authors[Math.floor(Math.random() * authors.length)]._id,
      comment: "Loved the structure here. The short sections make it easy to read."
    }
  );
}
for (const comment of comments) {
  await Comment.findOneAndUpdate(comment, comment, { upsert: true, new: true, setDefaultsOnInsert: true });
}

maya.bookmarks = [blogs[0]._id, blogs[2]._id, blogs[5]._id];
arjun.bookmarks = [blogs[1]._id, blogs[4]._id];
sofia.bookmarks = [blogs[0]._id, blogs[3]._id];
noah.bookmarks = [blogs[2]._id, blogs[5]._id];

maya.following = [arjun._id, sofia._id];
arjun.following = [maya._id];
sofia.following = [maya._id, noah._id];
noah.following = [arjun._id];

await Promise.all([maya.save(), arjun.save(), sofia.save(), noah.save()]);

await Promise.all(
  ["reader.one@example.com", "weekly.digest@example.com", "founder.notes@example.com"].map((email) =>
    Newsletter.findOneAndUpdate({ email }, { email }, { upsert: true, new: true, setDefaultsOnInsert: true })
  )
);

await Promise.all(
  blogs.map(async (blog) => {
    blog.commentsCount = await Comment.countDocuments({ blogId: blog._id });
    await blog.save();
  })
);

console.log("Seed complete.");
console.log("Admin: admin@example.com / admin123");
console.log("Users: maya@example.com, arjun@example.com, sofia@example.com, noah@example.com / password123");
console.log(`${shouldReset ? "Reset and seeded" : "Added/updated"} ${categories.length} categories, ${users.length} users, ${blogs.length} blogs, ${comments.length} comments.`);

await mongoose.disconnect();
process.exit(0);
