

import { app } from 'electron'
import Database from 'better-sqlite3'
import path from 'path'

// Get the user data path (persistent location for your app)
const userDataPath = app.getPath('userData')

// Define the path for your database file inside the user data folder
const dbPath = path.join(userDataPath, 'database.sqlite')

// Initialize the SQLite database
const db = new Database(dbPath)


// drop tables
// Clean the database by dropping all tables
// const cleanDatabase = () => {
//   db.exec(`
//     DROP TABLE IF EXISTS BillProducts;
//     DROP TABLE IF EXISTS Bill;
//     DROP TABLE IF EXISTS Product;
//     DROP TABLE IF EXISTS Employee;
//   `);
//   console.log('Database cleaned: All tables dropped.');
// };

// cleanDatabase()

/// create table if not exist for items

db.prepare(
  `
    CREATE TABLE IF NOT EXISTS Employee (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE
)`
).run()

db.prepare(
    `
    CREATE TABLE IF NOT EXISTS Product (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT
)`
).run()

// db.prepare(`
//    DROP TABLE Bill 
//   `).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS Bill (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  employeeId INTEGER NOT NULL,
  productIds TEXT,
  customerName TEXT,
  customerPhone TEXT,
  subTotal REAL NOT NULL,
  discount REAL DEFAULT 0,
  finalTotal REAL NOT NULL,
  date TEXT NOT NULL,
  FOREIGN KEY (employeeId) REFERENCES Employee(id) ON DELETE CASCADE
);
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS BillProducts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    billId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    FOREIGN KEY (billId) REFERENCES Bill(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
  )
`).run();


console.log('SQLite3 database initialized.')
export default db


export interface Product {
  id: number,
  name: string
  price: number
  description: string
}

export interface Employee {
  id: number;
  name: string;
  phone: string;
  email: string;
}
