require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;
const dbPath = path.join(__dirname, 'db', 'users.json');
const jwtSecret = process.env.JWT_SECRET;
const apiKey = process.env.API_KEY;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';

if (!jwtSecret || !apiKey) {
  console.error('Missing JWT_SECRET or API_KEY. Run: npm run generate-secrets');
  process.exit(1);
}

app.use(cors({ origin: true }));
app.use(express.json());

// Sirve el build de React (Vite) en producción, o archivos estáticos en desarrollo
const distPath = path.join(__dirname, '..', 'dist');
if (require('fs').existsSync(distPath)) {
  app.use(express.static(distPath));
} else {
  app.use(express.static(path.join(__dirname, '..')));
}

// --- Helpers para el archivo JSON ---
async function readUsers() {
  try {
    const content = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeUsers(users) {
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2), 'utf-8');
}

function generateToken(user) {
  return jwt.sign(
    { email: user.email, role: user.role, id: user.id },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  );
}

function apiKeyMiddleware(req, res, next) {
  const clientKey = req.header('X-API-Key');
  if (!clientKey || clientKey !== apiKey) {
    return res.status(403).json({ message: 'Invalid or missing API key' });
  }
  next();
}

async function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required' });
  }
  const token = authHeader.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, jwtSecret);
    const users = await readUsers();
    const user = users.find((u) => u.email.toLowerCase() === payload.email.toLowerCase());
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
}

const api = express.Router();
api.use(apiKeyMiddleware);

// REGISTRO
api.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    const users = await readUsers();
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalizedEmail)) return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: role || 'User',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    await writeUsers(users);
    res.json({ message: 'Registration successful', token: generateToken(newUser), user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// LOGIN
api.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readUsers();
    const user = users.find((u) => u.email === email.trim().toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login successful', token: generateToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CRUD - Obtener todos los usuarios (Solo Admin)
api.get('/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin access required' });
  try {
    const users = await readUsers();
    const sanitizedUsers = users.map(({ passwordHash, ...rest }) => rest);
    res.json(sanitizedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CRUD - Crear Usuario (Solo Admin)
api.post('/users', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin access required' });
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    const users = await readUsers();
    const normalizedEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email === normalizedEmail)) return res.status(409).json({ message: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: role || 'User',
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    await writeUsers(users);
    res.json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CRUD - Actualizar Usuario (Solo Admin)
api.put('/users/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin access required' });
  try {
    const users = await readUsers();
    const index = users.findIndex((u) => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'User not found' });

    const { name, email, role, password } = req.body;
    if (name) users[index].name = name.trim();
    if (email) users[index].email = email.trim().toLowerCase();
    if (role) users[index].role = role;
    if (password) users[index].passwordHash = await bcrypt.hash(password, 10);

    await writeUsers(users);
    res.json({ message: 'User updated successfully', user: users[index] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// CRUD - Eliminar Usuario (Solo Admin)
api.delete('/users/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Admin access required' });
  try {
    let users = await readUsers();
    const initialLength = users.length;
    users = users.filter((u) => u.id !== req.params.id);
    if (users.length === initialLength) return res.status(404).json({ message: 'User not found' });
    await writeUsers(users);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

api.get('/dashboard', authMiddleware, async (req, res) => {
  const { role, name } = req.user;
  const date = new Date().toLocaleDateString('es-ES');
  const users = await readUsers();
  const safe = users.map(({ passwordHash, ...rest }) => rest);
  const base = { welcome: `Bienvenido, ${name}`, role, date };

  if (role === 'Admin') {
    return res.json({ ...base, users: safe, panels: [
      { title: 'System Health', value: 'Stable', detail: 'No issues detected' },
      { title: 'User Access', value: 'Full control', detail: 'Manage coaches and athletes' },
      { title: 'Pending Requests', value: '3', detail: 'Approve new accounts' },
    ]});
  }

  if (role === 'Coach') {
    const athletes = safe.filter(u => u.role === 'User').map(u => ({
      id: u.id, name: u.name, email: u.email, status: 'On track',
    }));
    return res.json({ ...base, athletes, panels: [
      { title: 'Planned Workouts', value: '5 sessions', detail: 'This week schedule' },
      { title: 'Active Athletes', value: String(athletes.length), detail: 'Tracking attendance' },
      { title: 'Performance Score', value: '87%', detail: 'Team improvement trend' },
    ]});
  }

  return res.json({ ...base, panels: [
    { title: 'Goal Completion', value: '76%', detail: 'Weekly achievement' },
    { title: 'Next Training', value: 'Wednesday', detail: 'Cardio and strength' },
    { title: 'Nutrition Plan', value: 'Active', detail: 'Macros updated today' },
  ]});
});

api.get('/profile', authMiddleware, (req, res) => {
  const { id, name, email, role, createdAt } = req.user;
  res.json({ id, name, email, role, createdAt });
});

app.use('/api', api);

// SPA fallback: sirve index.html para rutas del frontend (React Router)
app.get('*', (req, res) => {
  const indexHtml = path.join(distPath, 'index.html');
  if (require('fs').existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.status(404).json({ message: 'Route not found' });
  }
});

app.listen(port, () => console.log(`SportClub backend API running on http://localhost:${port}`));
