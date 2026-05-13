# phasor — CLAUDE.md

## What this is
phasor is a browser-based physics simulation engine with AI explanation.
Users describe physical systems in plain English. The RK4 solver runs in-browser.
Groq provides parameter extraction and plain-English explanation only. No backend physics.

## Stack
Next.js 14 App Router · TypeScript strict · Tailwind CSS v4 · Clerk · Supabase · Groq (Llama 3.3 70B)

## Commands
- Dev: `npm run dev`
- Build: `npm run build`
- Type check: `npx tsc --noEmit`

## Critical rules

### Physics integrity (MOST IMPORTANT)
- Groq NEVER generates simulation numbers
- Groq only: (1) extracts parameters → JSON, (2) explains solver output in plain English
- All physics runs through `lib/solvers/` via the RK4 solver
- Touching a solver file requires verifying numerical output is still correct

### API key security
- `GROQ_API_KEY` → server-side only (api/parse, api/explain routes)
- NEVER add `NEXT_PUBLIC_` prefix to `GROQ_API_KEY`
- `CLERK_SECRET_KEY` → server-side only
- Supabase anon key and Clerk publishable key are safe as `NEXT_PUBLIC_`

### Solver architecture
- `lib/solvers/rk4.ts` is the core — do not modify without understanding RK4
- Each system exports: `solve()`, `defaultParams`, `equationLatex`, `sliderConfig`, `parameterSchema`
- Adding a system = new file in `lib/solvers/` + register in `lib/solvers/index.ts`
- Physics logic stays in `lib/solvers/` — never in components

### Security checklist (verify before every push)
- [ ] GROQ_API_KEY has no NEXT_PUBLIC_ prefix
- [ ] CLERK_SECRET_KEY has no NEXT_PUBLIC_ prefix
- [ ] .env.local is in .gitignore
- [ ] No API keys in client components, hooks, or browser-side utils
- [ ] Rate limiting active on /api/parse and /api/explain
- [ ] Zod validation runs before any Groq call

### Code rules
- No `any` types
- Zod validation on all API route inputs
- Error handling on every async operation — return generic messages to client
- Never commit broken builds

## Repo
https://github.com/tshnoudeh-droid/phasor.git
