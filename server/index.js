import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
const dbPath = join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Initialize database tables
function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'user')) NOT NULL DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      position TEXT NOT NULL,
      department TEXT NOT NULL,
      hire_date TEXT NOT NULL,
      salary REAL,
      address TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Create admin user if not exists
  const adminUser = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');
  if (!adminUser) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run('admin', hashedPassword, 'admin');
    console.log('Admin user created');
  }

  // Add some sample data if employees table is empty
  const employeeCount = db.prepare('SELECT COUNT(*) as count FROM employees').get().count;
  if (employeeCount === 0) {
    const sampleEmployees = [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '555-123-4567',
        position: 'Software Developer',
        department: 'Engineering',
        hire_date: '2021-01-15',
        salary: 85000,
        address: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zip: '78701'
      },
      {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        phone: '555-987-6543',
        position: 'Product Manager',
        department: 'Product',
        hire_date: '2020-05-10',
        salary: 95000,
        address: '456 Oak Ave',
        city: 'San Francisco',
        state: 'CA',
        zip: '94107'
      },
      {
        first_name: 'Michael',
        last_name: 'Johnson',
        email: 'michael.johnson@example.com',
        phone: '555-456-7890',
        position: 'UX Designer',
        department: 'Design',
        hire_date: '2022-03-20',
        salary: 78000,
        address: '789 Pine Blvd',
        city: 'Seattle',
        state: 'WA',
        zip: '98101'
      }
    ];

    const insertEmployee = db.prepare(`
      INSERT INTO employees (
        first_name, last_name, email, phone, position, department, 
        hire_date, salary, address, city, state, zip
      ) VALUES (
        @first_name, @last_name, @email, @phone, @position, @department, 
        @hire_date, @salary, @address, @city, @state, @zip
      )
    `);

    for (const employee of sampleEmployees) {
      insertEmployee.run(employee);
    }
    console.log('Sample employees created');
  }
}

initializeDatabase();

// Initialize express app
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'Unauthorized: No token provided' });
  
  jwt.verify(token, 'SECRET_KEY', (err, user) => {
    if (err) return res.status(403).json({ message: 'Forbidden: Invalid token' });
    req.user = user;
    next();
  });
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role }, 
    'SECRET_KEY', 
    { expiresIn: '1h' }
  );
  
  res.json({ 
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
});

app.post('/api/auth/register', authenticateToken, isAdmin, (req, res) => {
  const { username, password, role = 'user' } = req.body;
  
  try {
    const existingUser = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run(username, hashedPassword, role);
    
    res.status(201).json({ message: 'User created successfully', userId: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Employee routes
app.get('/api/employees', authenticateToken, (req, res) => {
  try {
    const query = req.query.search 
      ? `SELECT * FROM employees WHERE 
          first_name LIKE ? OR 
          last_name LIKE ? OR 
          email LIKE ? OR 
          position LIKE ? OR 
          department LIKE ?
          ORDER BY id DESC`
      : 'SELECT * FROM employees ORDER BY id DESC';
    
    let employees;
    if (req.query.search) {
      const searchTerm = `%${req.query.search}%`;
      employees = db.prepare(query).all(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    } else {
      employees = db.prepare(query).all();
    }
    
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error: error.message });
  }
});

app.get('/api/employees/:id', authenticateToken, (req, res) => {
  try {
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error: error.message });
  }
});

app.post('/api/employees', authenticateToken, (req, res) => {
  const {
    first_name, last_name, email, phone, position, department,
    hire_date, salary, address, city, state, zip
  } = req.body;
  
  try {
    // Check if email already exists
    const existingEmployee = db.prepare('SELECT * FROM employees WHERE email = ?').get(email);
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee with this email already exists' });
    }
    
    const result = db.prepare(`
      INSERT INTO employees (
        first_name, last_name, email, phone, position, department,
        hire_date, salary, address, city, state, zip
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      first_name, last_name, email, phone, position, department,
      hire_date, salary, address, city, state, zip
    );
    
    const newEmployee = db.prepare('SELECT * FROM employees WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error creating employee', error: error.message });
  }
});

app.put('/api/employees/:id', authenticateToken, (req, res) => {
  const {
    first_name, last_name, email, phone, position, department,
    hire_date, salary, address, city, state, zip
  } = req.body;
  
  try {
    // Check if employee exists
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    // Check if email is already used by another employee
    if (email !== employee.email) {
      const existingEmployee = db.prepare('SELECT * FROM employees WHERE email = ? AND id != ?').get(email, req.params.id);
      if (existingEmployee) {
        return res.status(400).json({ message: 'Email is already in use by another employee' });
      }
    }
    
    db.prepare(`
      UPDATE employees SET
        first_name = ?, last_name = ?, email = ?, phone = ?,
        position = ?, department = ?, hire_date = ?, salary = ?,
        address = ?, city = ?, state = ?, zip = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      first_name, last_name, email, phone, position, department,
      hire_date, salary, address, city, state, zip, req.params.id
    );
    
    const updatedEmployee = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
    
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error: error.message });
  }
});

app.delete('/api/employees/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    // Check if employee exists
    const employee = db.prepare('SELECT * FROM employees WHERE id = ?').get(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    
    db.prepare('DELETE FROM employees WHERE id = ?').run(req.params.id);
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error: error.message });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, username, role, created_at FROM users WHERE id = ?').get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});