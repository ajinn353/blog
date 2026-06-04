# MERN Blog Platform

A complete MERN blog platform with JWT auth, user blog management, image uploads, comments, search/filtering, dark mode, bookmarks, follows, newsletter subscriptions, Google sign-in support, SEO metadata, and an admin dashboard.

## Project Structure

```text
backend/
  config/ controllers/ middleware/ models/ routes/ uploads/ utils/
  server.js
frontend/
  src/
    assets/ components/ context/ hooks/ layouts/ pages/ services/
```

## Setup

1. Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

2. Configure environment files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Add your MongoDB Atlas connection string and JWT secret in `backend/.env`.

4. Seed default categories and an admin account:

```bash
cd backend
npm run seed
```

Default seeded admin:

```text
admin@example.com
admin123
```

5. Start development servers:

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## API Summary

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/auth/profile`

Blogs:
- `GET /api/blogs`
- `GET /api/blogs/:slug`
- `GET /api/blogs/mine`
- `POST /api/blogs`
- `PUT /api/blogs/:id`
- `DELETE /api/blogs/:id`
- `POST /api/blogs/:id/like`
- `POST /api/blogs/:id/bookmark`

Comments:
- `POST /api/comments`
- `GET /api/comments/:blogId`
- `PUT /api/comments/:id`
- `DELETE /api/comments/:id`

Categories:
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

Admin:
- `GET /api/admin/dashboard`
- `GET /api/admin/users`
- `DELETE /api/admin/users/:id`
- `PATCH /api/admin/users/:id/block`
- `GET /api/admin/blogs`
- `PATCH /api/admin/blogs/:id/status`
- `GET /api/admin/comments`

## Notes

- Image uploads use Multer and local static serving from `backend/uploads`. The stored URL field can be switched to Cloudinary by replacing `fileUrl` in `backend/middleware/upload.js`.
- Google login requires `GOOGLE_CLIENT_ID` in backend and `VITE_GOOGLE_CLIENT_ID` in frontend.
- User-published posts are submitted as `pending`; admins approve them as `published`.
