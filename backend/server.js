const express = require('express'), cors = require('cors'), bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'), mongoose = require('mongoose'), rateLimit = require('express-rate-limit');

const { MONGODB_URI, JWT_SECRET, CORS_ORIGIN, PORT = 3000 } = process.env;
if (!MONGODB_URI || !JWT_SECRET) { console.error('Set MONGODB_URI and JWT_SECRET'); process.exit(1); }

const origins = (CORS_ORIGIN || '').split(',').map(s => s.trim().replace(/\/$/, '')).filter(Boolean);
const app = express();
app.set('trust proxy', 1);
app.use(express.json({ limit: '10kb' }));
app.use(cors({ origin: (o, cb) => cb(null, !o || origins.includes(o)) }));

const User = mongoose.model('User', new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  hash: { type: String, required: true }
}, { timestamps: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many attempts. Try again in a few minutes.' } });
const sign = u => jwt.sign({ sub: u.id }, JWT_SECRET, { expiresIn: '7d' });
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const str = v => (typeof v === 'string' ? v : '');

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/signup', limiter, async (req, res) => {
  const name = str(req.body.name).trim(), email = str(req.body.email).trim().toLowerCase(), password = str(req.body.password);
  if (name.length < 2 || name.length > 60) return res.status(400).json({ error: 'Enter your name.' });
  if (!EMAIL.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  if (password.length < 8 || password.length > 72) return res.status(400).json({ error: 'Password must be 8 to 72 characters.' });
  try {
    const u = await User.create({ name, email, hash: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: sign(u), name: u.name });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ error: 'An account with this email already exists. Log in instead.' });
    console.error(e); res.status(500).json({ error: 'Server error. Try again.' });
  }
});

app.post('/api/login', limiter, async (req, res) => {
  const email = str(req.body.email).trim().toLowerCase(), password = str(req.body.password);
  try {
    const u = email && password ? await User.findOne({ email }) : null;
    if (!u || !(await bcrypt.compare(password, u.hash))) return res.status(401).json({ error: 'Wrong email or password.' });
    res.json({ token: sign(u), name: u.name });
  } catch (e) { console.error(e); res.status(500).json({ error: 'Server error. Try again.' }); }
});

app.get('/api/me', async (req, res) => {
  try {
    const t = (req.headers.authorization || '').replace(/^Bearer /, '');
    const u = await User.findById(jwt.verify(t, JWT_SECRET).sub);
    if (!u) throw new Error('no user');
    res.json({ name: u.name, email: u.email });
  } catch (e) { res.status(401).json({ error: 'Please log in again.' }); }
});

mongoose.connect(MONGODB_URI).then(() => {
  app.listen(PORT, () => console.log('API listening on ' + PORT));
}).catch(e => { console.error('MongoDB connection failed:', e.message); process.exit(1); });
