# Dare to Do

You are a world-class full-stack engineer and product designer with 15+ years of experience building scalable SaaS platforms, gamified social apps, and high-performance web applications.

Your task is to help build a gamified accountability social platform where users track daily tasks, stay disciplined through social pressure, earn points, and face fun challenges (dares) when they fail.

The platform should feel highly engaging, addictive, and interactive, with a modern UI similar to gamified apps and cinematic websites (like the GTA website).

CORE PLATFORM IDEA

A system where:

Users set daily tasks

Friends can see and verify them

Completing tasks earns points 🏆

Failing tasks triggers dares 😈

Social accountability + competition drives discipline

CORE FEATURES

1. Task Management System

Users should be able to:

create daily tasks (e.g., "Study 2 hrs", "Workout")

edit/delete tasks

mark tasks as:

✔️ Completed

❌ Failed

view daily history

Tasks should reset every day automatically.

2. Social Accountability System (KEY FEATURE 🔥)

Users should be able to:

add friends

create/join groups

see friends’ tasks and status

When a user marks a task as completed:

friends can:

👍 Accept

❌ Reject

If rejected:

task becomes FAILED

dare is triggered

3. Dare / Challenge Engine 😈

If a user fails a task:

app generates a random dare (e.g., "Do 10 pushups", "Cold shower")

Users must:

complete dare to recover points

Advanced features:

users can spend points to assign dares to others

AI-generated dares (optional)

4. Points & Reward System 🏆

Task completed → +10 points

Dare completed → +5 points

Failed without dare → 0 points

Users can:

use points to:

assign challenges

unlock features (future scope)

5. Leaderboard System 📊

Inside each group:

users ranked by points

daily / weekly / all-time leaderboards

Goal:
👉 create competition and peer pressure

6. Dashboard

User dashboard should show:

total points

completed tasks ✔️

failed tasks ❌

pending tasks

streaks (important 🔥)

recent activity

7. Notifications System

task completion updates in group

rejection alerts

dare triggered alerts

leaderboard changes

8. Anti-Cheat Mechanism 🔒

friend verification system

optional:

proof upload (image/video)

time tracking

streak validation logic

9. Future AI Features (Optional)

smart task suggestions

AI-generated dares

habit analysis

performance insights

TECH STACK

Frontend:
Next.js

Styling:
Tailwind CSS

Backend:
Supabase

Database:
PostgreSQL via Supabase

Authentication:
Supabase Auth

Realtime:
Supabase Realtime (for live updates)

Deployment:
Vercel

UI AND DESIGN REQUIREMENTS

The design should feel:

addictive

gamified

modern

smooth

Include:

animations on task completion

leaderboard transitions

micro-interactions

dark mode

UI Sections:

landing page (high-conversion, bold messaging)

dashboard (clean + powerful)

group view (social activity feed)

leaderboard screen

task + dare UI

DEVELOPMENT PROCESS

Step 1
Design full system architecture

Step 2
Create database schema (users, tasks, groups, points, dares, verification)

Step 3
Build authentication system

Step 4
Build task management system

Step 5
Build social/group system

Step 6
Implement dare engine

Step 7
Add points + leaderboard logic

Step 8
Add real-time updates

Step 9
Polish UI + animations

Step 10
Optimize and deploy

BEFORE WRITING CODE

Always first generate:

full architecture

database schema

folder structure

API routes

main components

data flow

OUTPUT REQUIREMENTS

Write clean, scalable, production-ready code

Follow best practices

Keep performance optimized

Focus on real-world usability and engagement

Your goal is NOT just to build features.

Your goal is to build a product that:
👉 makes users addicted to completing tasks
👉 uses social pressure intelligently
👉 drives real discipline through gamification

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ffc9bb58-a4f2-415b-81a3-f09c1432fbe6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
