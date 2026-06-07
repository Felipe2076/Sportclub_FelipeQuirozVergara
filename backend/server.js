const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;
const dbPath = path.join(__dirname, 'db', 'users.json');

app.use(cors({ origin: true }));
app.use(express.json());

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

function generateToken(email) {
  const payload = `${email}||${Date.now()}`;
  return Buffer.from(payload).toString('base64');
}

function decodeToken(token) {
  try {
    const value = Buffer.from(token, 'base64').toString('utf-8');
    return value.split('||')[0];
  } catch {
    return null;
  }
}

async function authMiddleware(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  const token = authHeader.replace('Bearer ', '');
  const email = decodeToken(token);
  if (!email) {
    return res.status(401).json({ message: 'Token invalid' });
  }

  const users = await readUsers();
  const user = users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  req.user = user;
  next();
}

app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const users = await readUsers();
  const normalizedEmail = email.trim().toLowerCase();
  if (users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({ message: 'Email already registered' });
  }

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

  const token = generateToken(normalizedEmail);
  res.json({
    message: 'Registration successful',
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
  });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const users = await readUsers();
  const user = users.find((item) => item.email === email.trim().toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user.email);
  res.json({
    message: 'Login successful',
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

app.get('/api/dashboard', authMiddleware, async (req, res) => {
  const { role, name } = req.user;
  const base = {
    welcome: `Welcome back, ${name}`,
    role,
    date: new Date().toLocaleDateString('es-ES'),
  };

  if (role === 'Admin') {
    return res.json({
      ...base,
      panels: [
        { title: 'System Health', value: 'Stable', detail: 'No issues detected' },
        { title: 'User Access', value: 'Full control', detail: 'Manage coaches and athletes' },
        { title: 'Pending Requests', value: '3', detail: 'Approve new accounts or changes' },
      ],
      users: [
        { name: 'Ana Admin', email: 'ana@gorilasport.com', role: 'Admin' },
        { name: 'Carlos Coach', email: 'carlos@gorilasport.com', role: 'Coach' },
        { name: 'Laura Athlete', email: 'laura@gorilasport.com', role: 'User' },
      ],
    });
  }

  if (role === 'Coach') {
    return res.json({
      ...base,
      panels: [
        { title: 'Planned Workouts', value: '5 sessions', detail: 'This week schedule' },
        { title: 'Active Athletes', value: '12', detail: 'Tracking attendance' },
        { title: 'Performance Score', value: '87%', detail: 'Team improvement trend' },
      ],
      athletes: [
        { name: 'Laura', progress: '83%', status: 'On track' },
        { name: 'Marco', progress: '77%', status: 'Needs review' },
        { name: 'Marta', progress: '92%', status: 'Excellent' },
      ],
    });
  }

  return res.json({
    ...base,
    panels: [
      { title: 'Goal Completion', value: '76%', detail: 'Weekly achievement' },
      { title: 'Next Training', value: 'Wednesday', detail: 'Cardio, strength and recovery' },
      { title: 'Nutrition Plan', value: 'Active', detail: 'Macros updated today' },
    ],
    stats: [
      { label: 'Sessions this week', value: '4' },
      { label: 'Calories burned', value: '2,450' },
      { label: 'Personal bests', value: '2' },
    ],
  });
});

app.get('/api/profile', authMiddleware, (req, res) => {
  const { id, name, email, role, createdAt } = req.user;
  res.json({ id, name, email, role, createdAt });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Gorila Sport backend API running on http://localhost:${port}`);
});
