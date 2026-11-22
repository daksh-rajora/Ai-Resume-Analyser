# AI Resume Analyser & Optimizer 📄✨

An end-to-end, full-stack AI-powered resume analyzer, ATS scoring engine, and version tracking system built with the **MERN Stack** (MongoDB, Express, React, Node.js) and powered by **OpenRouter / Gemini AI models**.

---

## 🚀 Live Deployments

- **Frontend (Vercel):** Single Page Application with full mobile responsiveness and client-side routing.
- **Backend API (Render):** `https://ai-resume-analyser-zabq.onrender.com/api`

---

## 🌟 Key Features

- **⚡ Instant ATS Readiness Scoring**: Extracts text from uploaded resume PDFs and evaluates readiness across 4 key dimensions: *Keywords*, *Formatting*, *Impact*, and *Clarity*.
- **🤖 AI-Powered Bullet Rewrites**: Generates actionable, quantified, and high-impact bullet points. Apply individual suggestions or batch rewrite to create new versions automatically.
- **🔍 Version History & Side-by-Side Diffing**: Track how your resume evolves over time. Compare changes character-by-character and word-by-word with visual diff highlights.
- **📊 Cross-Resume Analytics & Insights**: Identify recurring weaknesses and missing industry keywords across multiple resumes or job applications.
- **📥 ATS-Friendly PDF Export**: Export clean, standard, ATS-parseable PDF versions directly in the browser via `@react-pdf/renderer`.
- **📱 100% Mobile Responsive**: Dedicated mobile navigation, responsive touch targets, smooth horizontal tabs/version switchers, and zero-overflow layout.
- **🔒 Secure Authentication**: JWT authentication with HTTP-only, secure, `SameSite=None` cross-domain cookies and bcrypt password hashing.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 + tw-animate-css
- **State & Data Fetching**: TanStack React Query v5
- **Routing**: React Router v7
- **UI Components & Icons**: Lucide React, Framer Motion
- **Charts & Visualizations**: Recharts
- **PDF Generation & Handling**: `@react-pdf/renderer`, `react-dropzone`

### **Backend**
- **Runtime**: Node.js + Express 5
- **Database**: MongoDB + Mongoose ODM
- **AI Engine**: OpenRouter API (`nvidia/nemotron-3-ultra-550b-a55b:free` or any OpenAI/Gemini compatible model)
- **PDF Parsing**: `pdf-parse`
- **Text Diffing**: `diff`
- **Security & Validation**: `bcrypt`, `jsonwebtoken`, `zod`, `cookie-parser`, `cors`

---

## 📁 Project Structure

```text
Ai-Resume-Analyser/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB and environment configurations
│   │   ├── middleware/      # Auth, error handling, file upload, validation
│   │   ├── models/          # User, Resume, ResumeVersion, Analysis schemas
│   │   ├── routes/          # Express API route handlers
│   │   ├── services/        # AI service, PDF parsing, text diffing
│   │   ├── utils/           # JWT, async handlers, custom ApiError
│   │   └── server.js        # Express app entrypoint
│   ├── .env.example         # Environment template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API client and route services
│   │   ├── components/      # UI components (analysis, layout, dashboard, resume)
│   │   ├── context/         # Auth, Theme, and UI Context providers
│   │   ├── hooks/           # React Query hooks
│   │   ├── pages/           # Dashboard, Resumes, Insights, Versions, Settings
│   │   └── App.jsx
│   ├── vercel.json          # SPA routing rewrite rules for Vercel
│   ├── .env.example         # Frontend environment template
│   └── package.json
├── package.json             # Root monorepo script coordinator
├── vercel.json              # Monorepo deployment configuration
└── README.md
```

---

## ⚙️ Getting Started Locally

### Prerequisites
- **Node.js**: v20+ or v22+
- **MongoDB**: Local MongoDB instance or MongoDB Atlas cluster URI
- **OpenRouter API Key**: Free key from [openrouter.ai](https://openrouter.ai)

---

### 1. Clone the Repository

```bash
git clone https://github.com/daksh-rajora/Ai-Resume-Analyser.git
cd Ai-Resume-Analyser
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see `backend/.env.example`):

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-resume-analyzer
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters
JWT_EXPIRES_IN=7d
COOKIE_NAME=arr_token
CLIENT_ORIGIN=http://localhost:5173

# AI Model Configuration (OpenRouter)
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
```

Start the backend server:

```bash
npm run dev
```

The backend server runs on `http://localhost:5000`.

---

### 3. Frontend Setup

In a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory (optional for local dev as Vite proxies `/api` to port 5000):

```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🌐 Production Deployment

### Backend on Render
1. Create a **New Web Service** pointing to this GitHub repository.
2. Root Directory: `backend` (or use repo root with `npm run build` and `npm start`).
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas URI
   - `JWT_SECRET`: Random 32+ character secret
   - `CLIENT_ORIGIN`: Your Vercel frontend URL (e.g. `https://your-app.vercel.app`)
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `OPENROUTER_MODEL`: `nvidia/nemotron-3-ultra-550b-a55b:free`

### Frontend on Vercel
1. Import repository on Vercel.
2. Framework Preset: **Vite**.
3. Root Directory: `frontend`.
4. Environment Variables:
   - `VITE_API_URL`: `https://ai-resume-analyser-zabq.onrender.com/api` (your backend URL).
5. Deploy! Client-side routes are automatically handled by `vercel.json`.

---

## 📄 License

This project is licensed under the ISC License.
