import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const db = new Database('database.db');

db.pragma('foreign_keys = ON');

const query = `
  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    student_name TEXT, 
    student_id TEXT, 
    module_code TEXT, 
    score INTEGER, 
    status TEXT, 
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP, 
    review_reason TEXT, 
    last_modifiedby TEXT, 
    assessment TEXT
  );
`;

const loginQuery = `
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    user_name TEXT, 
    email TEXT, 
    password TEXT
  );
`;

db.exec(query);
db.exec(loginQuery);

const seedStmt = db.prepare(`
  INSERT OR IGNORE INTO user (id, user_name, email, password) 
  VALUES (1, ?, ?, ?)
`);
seedStmt.run('Ahmed Salaheldin', 'ahmed@university.edu', '99775533');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://omnikey.online',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
};

// authentication route

app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const stmt = db.prepare('SELECT id, user_name, email FROM user WHERE email = ? AND password = ?');
    const user = stmt.get(email, password);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({ message: 'Login successful', user });
  } catch (error) {
    handleError(res, error);
  }
});

// records routes

app.post('/api/records', (req, res) => {
  try {
    const {
      student_name,
      student_id,
      module_code,
      score,
      status,
      review_reason,
      last_modifiedby,
      assessment
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO records (
        student_name, student_id, module_code, score, status, review_reason, last_modifiedby, assessment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      student_name ?? null,
      student_id ?? null,
      module_code ?? null,
      score ?? null,
      status ?? null,
      review_reason ?? null,
      last_modifiedby ?? null,
      assessment ?? null
    );

    res.status(201).json({ id: result.lastInsertRowid, message: 'Record created successfully' });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/records', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM records ORDER BY id DESC');
    const records = stmt.all();
    res.json(records);
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/records/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM records WHERE id = ?');
    const record = stmt.get(req.params.id);

    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json(record);
  } catch (error) {
    handleError(res, error);
  }
});

app.put('/api/records/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existingStmt = db.prepare('SELECT * FROM records WHERE id = ?');
    const existing = existingStmt.get(id);

    if (!existing) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const {
      student_name = existing.student_name,
      student_id = existing.student_id,
      module_code = existing.module_code,
      score = existing.score,
      status = existing.status,
      review_reason = existing.review_reason,
      last_modifiedby = existing.last_modifiedby,
      assessment = existing.assessment
    } = req.body;

    const stmt = db.prepare(`
      UPDATE records SET 
        student_name = ?, 
        student_id = ?, 
        module_code = ?, 
        score = ?, 
        status = ?, 
        review_reason = ?, 
        last_modifiedby = ?, 
        assessment = ?,
        last_modified = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    stmt.run(
      student_name,
      student_id,
      module_code,
      score,
      status,
      review_reason,
      last_modifiedby,
      assessment,
      id
    );

    res.json({ message: 'Record updated successfully' });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/records/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM records WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
});

// user routes

app.post('/api/users', (req, res) => {
  try {
    const { user_name, email, password } = req.body;

    if (!user_name || !email || !password) {
      return res.status(400).json({ error: 'user_name, email, and password are required' });
    }

    const stmt = db.prepare('INSERT INTO user (user_name, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(user_name, email, password);

    res.status(201).json({ id: result.lastInsertRowid, message: 'User created successfully' });
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/users', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, user_name, email, password FROM user ORDER BY id DESC');
    const users = stmt.all();
    res.json(users);
  } catch (error) {
    handleError(res, error);
  }
});

app.get('/api/users/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT id, user_name, email, password FROM user WHERE id = ?');
    const user = stmt.get(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    handleError(res, error);
  }
});

app.put('/api/users/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM user WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      user_name = existing.user_name,
      email = existing.email,
      password = existing.password
    } = req.body;

    const stmt = db.prepare('UPDATE user SET user_name = ?, email = ?, password = ? WHERE id = ?');
    stmt.run(user_name, email, password, id);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    handleError(res, error);
  }
});

app.delete('/api/users/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM user WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening`);
});