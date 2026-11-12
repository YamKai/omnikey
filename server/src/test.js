// src/test.js
import Database from 'better-sqlite3';

try {
  console.log('Attempting to initialize better-sqlite3...');
  // Opens an in-memory database just to test native binding stability
  const db = new Database(':memory:');
  console.log('better-sqlite3 initialized successfully!');
} catch (err) {
  console.error('Database test failed:', err);
}