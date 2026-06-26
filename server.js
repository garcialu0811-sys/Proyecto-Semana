require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets directly (CSS, JS, assets)
app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  maxAge: 0,
  setHeaders: (res, filePath) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
}));

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lyracode';
mongoose.connect(mongoURI)
  .then(() => console.log('Conectado con éxito a MongoDB.'))
  .catch(err => console.error('Error al conectar con MongoDB:', err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/missions', require('./routes/missions'));

// Frontend View Routing (maps real paths to static HTML views)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
  res.redirect('/courses');
});

app.get('/courses', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'courses.html'));
});

app.get('/rutas', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'routes.html'));
});

app.get('/curso/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'course.html'));
});

app.get('/curso/:slug/leccion/:num', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'lesson.html'));
});

app.get('/curso/:slug/ejercicio/:num', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'exercise.html'));
});

app.get('/curso/:slug/quiz/:num', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'quiz.html'));
});

app.get('/curso/:slug/proyecto', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'project.html'));
});

app.get('/curso/:slug/resultado', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'result.html'));
});

app.get('/inventario', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'inventory.html'));
});

app.get('/misiones', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'public', 'missions.html'));
});

app.get('/perfil', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Fallback to landing page for unmatched routes
app.get('*', (req, res) => {
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor LyraCode escuchando en http://localhost:${PORT}`);
});
