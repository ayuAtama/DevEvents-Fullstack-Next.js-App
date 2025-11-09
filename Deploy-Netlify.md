
---

# 🚀 Next.js Full-Stack Deployment on Netlify

This guide documents how this full-stack Next.js project was deployed to **Netlify**, built locally, and the issues encountered (with fixes).

---

## 🧱 Project Stack

- **Framework:** Next.js (App Router)
- **Hosting:** Netlify (Free plan)
- **Auth:** Auth.js (NextAuth.js)
- **Language:** TypeScript
- **Runtime:** Serverless functions via `@netlify/plugin-nextjs`

---

## ⚙️ Local Build & Deployment Workflow

### 1. Install Dependencies

```bash
npm install
````


> 📝 **Side note:**
> If your local build fails while using `pnpm`, try switching to `npm` or `yarn`.
> Netlify’s build environment has better compatibility with **npm** and **yarn** compared to **pnpm**, especially for projects using `@netlify/plugin-nextjs` or complex postinstall scripts.

### 2. Test the Build Locally

```bash
npm run build
npm run start
```

If it runs fine at `http://localhost:3000`, you’re ready to deploy.

---

## ☁️ Deploying to Netlify

### 1. Install the Netlify Plugin

```bash
npm install -D @netlify/plugin-nextjs
```

### 2. Add `netlify.toml` on root project folder

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 3. Add Required Environment Variables (in Netlify Dashboard)

| Key                 | Example Value                        | Description                            |
| ------------------- | ------------------------------------ | -------------------------------------- |
| `NEXTAUTH_URL`      | `https://your-site-name.netlify.app` | Your production URL                    |
| `AUTH_TRUST_HOST`   | `true`                               | Required by Auth.js to trust your host |
| `NEXTAUTH_SECRET`   | `your_secret_here`                   | Random secret for JWT / sessions       |
| Other provider vars | e.g., `GITHUB_ID`, `GITHUB_SECRET`   | Depends on your Auth provider          |

### 4. Push to GitHub

Commit and push your changes:

```bash
git add .
git commit -m "Deploy setup for Netlify"
git push origin main
```

### 5. Connect Repo to Netlify

1. Go to [https://app.netlify.com](https://app.netlify.com)
2. “Add new site” → “Import from Git”
3. Select your GitHub repository
4. Netlify will auto-detect the build command:

   * **Build command:** `npm run build`
   * **Publish directory:** `.next`

### 6. Trigger Deploy (With New Env Vars)

After adding or changing environment variables:

👉 Use **“Trigger deploy → Deploy site without cache”**
This ensures a fresh rebuild with updated environment variables.

---

## 🧩 Common Problem Encountered

### ❌ Error:

```
Application error: a server-side exception has occurred...
Digest: 2185532947
```

#### Cause:

Auth.js threw an **UntrustedHost** error:

```
[auth][error] UntrustedHost: Host must be trusted.
URL was: https://xxxx--next-dev-fullstack.netlify.app/api/auth/session
```

This happened because `NEXTAUTH_URL` or `AUTH_TRUST_HOST` was missing or outdated in Netlify’s environment variables.

#### ✅ Fix:

Add the following to **Netlify → Site Settings → Environment Variables**:

```bash
NEXTAUTH_URL=https://your-site-name.netlify.app
AUTH_TRUST_HOST=true
```

Then **redeploy without cache**.

---

## ✅ Verification Checklist

* [x] API routes respond correctly (`/api/...`)
* [x] Auth.js session works (`/api/auth/session`)
* [x] Front-end pages (`/`, `/events`, etc.) load without SSR error
* [x] `NEXTAUTH_URL` and `AUTH_TRUST_HOST` defined in Netlify
* [x] Build success and site accessible via your `.netlify.app` domain

---

## 🧾 Summary

| Step | Description                                        |
| ---- | -------------------------------------------------- |
| 1️⃣  | Build locally (`npm run build && npm run start`)   |
| 2️⃣  | Add `@netlify/plugin-nextjs` and `netlify.toml`    |
| 3️⃣  | Push code to GitHub                                |
| 4️⃣  | Connect repo to Netlify                            |
| 5️⃣  | Configure environment variables                    |
| 6️⃣  | **Deploy site without cache** when env vars change |
| 7️⃣  | Test your routes and Auth.js functionality         |

---

## 🛠️ Notes

* The `node_modules` folder is **not counted** toward Netlify’s 10 GB storage — only the final build output counts.
* The 10 GB storage is **shared account-wide** across all your projects.
* If you update `.env` or Auth provider settings, you must **redeploy** for the changes to take effect.
* 🧩 **If your build fails locally with `pnpm`,** switch to `npm` or `yarn` and delete the `pnpm-lock.yaml` file before rebuilding.

---

### 🧡 Credits

Deployed successfully with:

* **Next.js**
* **Auth.js (NextAuth.js)**
* **Netlify**
