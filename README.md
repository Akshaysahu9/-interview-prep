# RoundOne

Interview preparation platform — mock interviews, resume review, coding practice, and session analytics.

## Features

- **Mock interviews** — Role-based questions, company profiles, timed rounds, scored feedback
- **Resume review** — Skill alignment, gaps, and actionable improvements
- **Coding practice** — Curated problems with hints and feedback
- **Progress** — Session history, score trends, role breakdowns

## Stack

Next.js 15 · React 19 · TypeScript · Prisma · SQLite · Tailwind CSS 4

## Getting started

```bash
npm install
copy .env.example .env
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite path (default in `.env.example`) |
| `OPENAI_API_KEY` | No | Optional cloud evaluation |

## Scripts

```bash
npm run dev      # Development
npm run build    # Production build
npx prisma studio # Database UI
```

## Project layout

```
src/app/          Pages and API routes
src/lib/          Business logic, Prisma, evaluation
prisma/schema.prisma
```

## License

MIT
