# BFHL — Node Hierarchy Explorer

A Node.js/React full-stack app for parsing directed node relationships, detecting cycles, filtering duplicates, and rendering structured hierarchies.

## Project structure

```
backend/
├── controllers/
├── routes/
├── utils/
├── app.js
└── package.json

frontend/
├── src/
│   ├── components/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js

package.json
.gitignore
README.md
```

## Local setup

Install dependencies for the monorepo:

```bash
npm install
```

Run the backend:

```bash
npm run dev:backend
```

Run the frontend:

```bash
npm run dev:frontend
```

The backend listens on `http://localhost:3001` and the frontend runs at `http://localhost:5173`.

## Build

Build the frontend for production:

```bash
npm --workspace frontend run build
```

Then start the backend to serve the built frontend:

```bash
npm start
```

## Vercel Deployment

This repository is configured for Vercel deployment with a root `vercel.json` file.

- The frontend is built from `frontend/package.json` and served from `frontend/dist`.
- The backend API is exposed as a serverless function at `/api/bfhl` using `api/bfhl.js`.

To deploy manually, install the Vercel CLI and run:

```bash
npm install -g vercel
vercel login
vercel --prod
```

If you want to use a different API endpoint during local frontend development, add a `.env` file in `frontend`:

```
VITE_API_URL=http://localhost:3001/bfhl
```

## API Reference

### `POST /bfhl`

**Request**

```json
{
  "data": ["A->B", "A->C", "B->D", "C->E", "E->F"]
}
```

**Response**

```json
{
  "user_id": "fullname_ddmmyyyy",
  "email_id": "your.email@college.edu",
  "college_roll_number": "RA21XXXXXXX",
  "hierarchies": [
    {
      "root": "A",
      "tree": {"A": {"B": {"D": {}}, "C": {"E": {"F": {}}}}},
      "depth": 4
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

## Notes

- `backend/app.js` serves the API and static frontend build when available.
- `frontend/src/App.jsx` calls the API at `http://localhost:3001/bfhl`.
- Identity fields are configured in `backend/controllers/bfhlController.js`.
