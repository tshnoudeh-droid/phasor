# phasor — Architecture

## Core Loop
1. User types physics scenario in chat
2. POST /api/parse → Groq extracts system type + parameters (JSON only, no numbers invented)
3. RK4 solver runs in-browser via mathjs → ODEState[]
4. SimCanvas animates at 60fps with requestAnimationFrame
5. KaTeX renders governing equations
6. POST /api/explain → Groq explains solver output in plain English
7. Sliders re-run solver on change (debounced 100ms)

## Data Flow
```
User input
  → /api/parse (Groq: language → JSON params)
  → lib/solvers/<system>.ts (RK4: params → ODEState[])
  → SimCanvas (canvas animation)
  → /api/explain (Groq: solver metrics → plain English)
  → ChatPanel (display explanation)
```

## Systems
| System | File | ODE |
|--------|------|-----|
| Spring-mass-damper | lib/solvers/springMass.ts | mx'' + bx' + kx = 0 |
| Pendulum | lib/solvers/pendulum.ts | θ'' = -(g/L)sin(θ) |
| Projectile | lib/solvers/projectile.ts | x''=0, y''=-g (±drag) |
| PID controller | lib/solvers/pid.ts | G(s) = 1/(ms²+bs+k) + PID |
| RC circuit | lib/solvers/rcCircuit.ts | RC·dV/dt + V = Vin |

## API Routes
| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| /api/parse | POST | none | Groq parameter extraction |
| /api/explain | POST | none | Groq simulation explanation |

Both routes: rate-limited (20 req/min/IP), Zod-validated, GROQ_API_KEY server-side only.

## Database (Supabase)
```sql
simulations (
  id UUID PK,
  slug TEXT UNIQUE,
  system_type TEXT,
  parameters JSONB,
  conversation JSONB,
  user_id TEXT,
  created_at TIMESTAMPTZ
)
```
RLS: public SELECT, public INSERT. No UPDATE, no DELETE.

## Component Tree
```
app/
  layout.tsx (ClerkProvider, fonts)
  page.tsx (landing)
  sim/page.tsx
    SplitLayout
      SimCanvas + SliderPanel + EquationDisplay  (top ~55%)
      ChatPanel + ChatInput                       (bottom ~45%)
  s/[slug]/page.tsx (read-only viewer)
```

## State Management
- useSimulation: solver state, animation
- useConversation: chat history, Groq calls
- useSliders: parameter state, debounced re-run

## Auth
- Clerk optional — sim works without sign-in
- Auth gates: save + view history only
- /sim and /s/[slug] are public
