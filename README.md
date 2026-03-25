# Modern React + Cloudflare Workers Template

[cloudflarebutton]

A production-ready full-stack template for building stunning web applications with React 18, TypeScript, Tailwind CSS, shadcn/ui components, and Cloudflare Workers backend. Features instant HMR, dark mode, animations, security headers, rate limiting, and edge deployment.

## ✨ Features

- **Lightning Fast**: Vite-powered HMR and optimized builds (<50KB bundle)
- **Beautiful UI**: 46+ shadcn/ui components with Tailwind v4, dark mode, and framer-motion animations
- **Production Ready**: TypeScript, security headers, error reporting, client-side caching with Tanstack Query
- **Cloudflare Native**: Workers API backend with Hono, CORS, logging, and easy deployment
- **Developer Experience**: Hot reload, linting, testing with Vitest, and auto-TypeScript generation
- **Responsive Design**: Mobile-first with sidebar layouts, glassmorphism, gradients, and stagger animations

## 🛠 Tech Stack

| Frontend | Backend | Tools |
|----------|---------|-------|
| React 18 | Hono | Vite 6 |
| TypeScript 5 | Cloudflare Workers | Bun |
| Tailwind CSS 3.4 | Zod Validation | Tanstack Query |
| shadcn/ui + Radix | Rate Limiting | wrangler |
| framer-motion | Secure Headers | Vitest |
| Lucide Icons | Logger Middleware | ESLint |

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone <your-repo>
   cd <your-repo>
   bun install
   ```

2. **Development**
   ```bash
   bun dev
   ```
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8787/api/health

3. **Build & Preview**
   ```bash
   bun build
   bun preview
   ```

## 📦 Installation

This project uses **Bun** as the package manager and runtime.

```bash
bun install
```

- Installs all dependencies including shadcn/ui components
- Generates TypeScript types with `wrangler types`
- Sets up Tailwind CSS with custom theme (DM Sans font, brand gradients)

## 💻 Development

### Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server (Vite + Workers) |
| `bun build` | Build for production |
| `bun preview` | Local preview of production build |
| `bun lint` | Run ESLint |
| `bun test` | Run Vitest tests |
| `bun test:watch` | Watch mode tests |
| `bun cf-typegen` | Generate Worker types |
| `bun deploy` | Build + deploy to Cloudflare |

### Folder Structure

```
src/                 # React app
├── components/ui/   # shadcn/ui components
├── pages/           # Router pages
├── hooks/           # Custom hooks
└── lib/             # Utilities

worker/              # Cloudflare Workers backend
├── userRoutes.ts    # Add your API routes here
├── rate-limit.ts    # Rate limiting middleware
└── index.ts         # Do not modify
```

### Frontend Customization

- **Pages**: Edit `src/pages/HomePage.tsx` and add routes in `src/main.tsx`
- **Components**: Use shadcn/ui from `@/components/ui/*`
- **Theme**: Toggle with `ThemeToggle` component (uses `useTheme` hook)
- **Styling**: Extend Tailwind in `tailwind.config.js` and `src/index.css`

### Backend API

- Add routes in `worker/userRoutes.ts` (e.g., `app.get('/api/test', ...)`)
- Use `AppEnv` type for Hono contexts
- Rate limiting: Import `rateLimitMiddleware` from `./rate-limit`
- Error reporting: POST to `/api/client-errors` (automatic from `errorReporter.ts`)

Example API route:
```ts
// worker/userRoutes.ts
app.get('/api/users', (c) => c.json({ users: [] }));
```

## ☁️ Deployment

Deploy to Cloudflare Pages (static assets) + Workers (API) with one command:

1. **Login to Cloudflare**
   ```bash
   bunx wrangler login
   ```

2. **Deploy**
   ```bash
   bun deploy
   ```
   - Builds frontend assets
   - Deploys Worker with `wrangler deploy`
   - Configured in `wrangler.jsonc`

[cloudflarebutton]

**Custom Domain**: Update `wrangler.jsonc` and run `bun deploy`.

**Environment Variables**: Add to Cloudflare dashboard or `wrangler.toml`.

## 🔍 Testing

```bash
bun test          # All tests
bun test:coverage # With coverage
```

Includes Jest-DOM matchers and React Testing Library.

## 🤝 Contributing

1. Fork the repo
2. `bun install`
3. Create a feature branch
4. `bun dev` for local testing
5. Submit PR

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Support

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)

Built with ❤️ by Fabricate.dev