# LyraCode — Minecraft Coding Adventure Platform

## Overview

Build a full-stack, Minecraft-themed educational coding platform from scratch using HTML5, CSS3, Vanilla JavaScript (frontend) + Node.js + Express.js + MongoDB + Mongoose + JWT (backend). The platform mirrors Codédex/Duolingo UX but feels like playing Minecraft.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Editor | CodeMirror (CDN) |
| Fonts | Press Start 2P (pixel), VT323, Inter |

---

## Architecture

```
JUEGO/
├── package.json
├── server.js               ← Express entry point
├── .env                    ← JWT_SECRET, MONGO_URI
├── models/
│   ├── User.js
│   ├── Course.js
│   ├── Lesson.js
│   ├── Exercise.js
│   ├── Quiz.js
│   ├── Project.js
│   ├── Mission.js
│   ├── Achievement.js
│   ├── Inventory.js
│   └── Progress.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── courses.js
│   ├── lessons.js
│   ├── exercises.js
│   ├── quizzes.js
│   ├── projects.js
│   └── missions.js
├── middleware/
│   └── auth.js             ← JWT verification middleware
├── seed/
│   └── seed.js             ← Database seeder
└── public/
    ├── index.html          ← Landing page
    ├── login.html          ← Login/Register
    ├── dashboard.html      ← Main dashboard (after login)
    ├── courses.html        ← Course catalog
    ├── course.html         ← Individual course view
    ├── lesson.html         ← Lesson view
    ├── exercise.html       ← Code exercise
    ├── quiz.html           ← Quiz view
    ├── project.html        ← Final project
    ├── result.html         ← Project result
    ├── inventory.html      ← Player inventory
    ├── missions.html       ← Missions/quests
    ├── profile.html        ← User profile
    ├── css/
    │   ├── global.css      ← Design tokens, fonts, resets
    │   ├── components.css  ← Reusable components
    │   ├── animations.css  ← Particle FX, transitions
    │   ├── landing.css
    │   ├── auth.css
    │   ├── dashboard.css
    │   ├── course.css
    │   ├── lesson.css
    │   ├── exercise.css
    │   ├── quiz.css
    │   ├── project.css
    │   └── inventory.css
    └── js/
        ├── api.js          ← Fetch wrapper + JWT handling
        ├── auth.js         ← Login/register logic
        ├── dashboard.js
        ├── courses.js
        ├── course.js
        ├── lesson.js
        ├── exercise.js
        ├── quiz.js
        ├── project.js
        ├── inventory.js
        ├── missions.js
        ├── particles.js    ← Particle system
        └── navbar.js       ← Shared navbar logic
```

---

## Routes (Frontend)

| URL | Page |
|---|---|
| `/` | Landing page |
| `/login` | Login/Register |
| `/dashboard` | Main dashboard |
| `/courses` | Course catalog |
| `/curso/:slug` | Course detail |
| `/curso/:slug/leccion/:id` | Lesson |
| `/curso/:slug/ejercicio/:id` | Exercise |
| `/curso/:slug/quiz/:id` | Quiz |
| `/curso/:slug/proyecto` | Final project |
| `/curso/:slug/resultado` | Project result |
| `/inventario` | Inventory |
| `/misiones` | Missions |
| `/perfil` | Profile |

---

## MongoDB Collections

### users
```json
{
  "username": String,
  "email": String,
  "password": String (hashed),
  "avatar": String,
  "xp": Number,
  "level": Number,
  "coins": Number,
  "gems": Number,
  "streak": Number,
  "lastLogin": Date,
  "achievements": [ObjectId],
  "inventory": [ObjectId],
  "createdAt": Date
}
```

### courses
```json
{
  "slug": String,
  "name": String,
  "description": String,
  "icon": String,
  "banner": String,
  "color": String,
  "difficulty": String,
  "totalLessons": Number,
  "totalExercises": Number,
  "totalQuizzes": Number,
  "order": Number
}
```

### progress
```json
{
  "userId": ObjectId,
  "courseId": ObjectId,
  "lessonsCompleted": [Number],
  "exercisesCompleted": [Number],
  "quizzesCompleted": [Number],
  "projectSubmitted": Boolean,
  "projectScore": Number,
  "xpEarned": Number,
  "percentage": Number
}
```

---

## Visual Design Tokens

```css
--color-bg:          #0a0e1a  /* Deep night */
--color-surface:     #111827  /* Dark card */
--color-border:      #1e3a2f  /* Dark green border */
--color-primary:     #22c55e  /* Minecraft green */
--color-primary-dark:#15803d
--color-gold:        #f59e0b
--color-diamond:     #67e8f9
--color-emerald:     #10b981
--color-end:         #7c3aed  /* End purple */
--color-redstone:    #dc2626
--color-text:        #e2e8f0
--color-muted:       #64748b
--font-pixel:        'Press Start 2P'
--font-vt:           'VT323'
--font-body:         'Inter'
```

---

## Gamification System

- **XP**: Earned per lesson (50), exercise (100), quiz (200), project (500)
- **Levels**: 1-100, exponential XP curve
- **Coins**: Earned per activity, spent in shop
- **Gems**: Rare currency from achievements
- **Streak**: Daily login tracking
- **Inventory**: Items earned (chests, tools, pets)
- **Missions**: Daily/weekly quests
- **Achievements**: Milestone badges

---

## Seeded Content

### HTML Course (12 lessons)
1. Introducción a HTML
2. Estructura básica
3. Etiquetas de texto
4. Imágenes y multimedia
5. Enlaces
6. Listas y tablas
7. Formularios
8. Contenedores (div/span)
9. Comentarios
10. Meta tags
11. HTML semántico
12. Revisión final

### CSS, JavaScript, Node.js, Express, MongoDB, Python courses (seeded with basic structure)

---

## Implementation Phases

### Phase 1 — Project Setup & Backend
- `package.json`, `server.js`, `.env`
- All Mongoose models
- All Express routes (auth, courses, progress, missions)
- JWT middleware
- Database seeder

### Phase 2 — CSS Design System
- `global.css` with all tokens
- `components.css` (buttons, cards, navbar, modals)
- `animations.css` (particles, glow, transitions)
- All page-specific stylesheets

### Phase 3 — Frontend Pages
- Landing page (Minecraft forest scene)
- Login/Register page
- Dashboard
- Course catalog
- Course detail view
- Lesson view
- Exercise view (CodeMirror editor)
- Quiz view
- Project view
- Result view
- Inventory, Missions, Profile

### Phase 4 — JavaScript Logic
- API client (`api.js`)
- Auth flow
- Dashboard data loading
- Lesson progression
- Exercise code editor + live preview
- Quiz with particle feedback
- Progress tracking
- Gamification animations

### Phase 5 — Seed & Test
- Seed MongoDB with all course content
- End-to-end test all routes

---

## Verification Plan

### Automated
- `node seed/seed.js` → verifies DB seeding
- `npm start` → server starts on port 3000

### Manual
- Register new user → JWT stored
- Navigate all 12+ routes
- Complete lesson → XP awarded
- Submit exercise → live preview
- Take quiz → particle feedback
- Submit project → result screen
- Check inventory/missions
