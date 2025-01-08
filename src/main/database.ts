// // database.ts
// import Database from 'better-sqlite3'
// import path from 'path'

// const dbPath = path.join(__dirname, 'database.sqlite')

// // Initialize the database
// const db = new Database(dbPath)

// // Create a sample table if it doesn't exist
// db.prepare(
//   `
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     email TEXT UNIQUE NOT NULL
//   )
// `
// ).run()

// console.log('SQLite3 database initialized.')

// export default db

import { app } from 'electron'
import Database from 'better-sqlite3'
import path from 'path'

// Get the user data path (persistent location for your app)
const userDataPath = app.getPath('userData')

// Define the path for your database file inside the user data folder
const dbPath = path.join(userDataPath, 'database.sqlite')

// Initialize the SQLite database
const db = new Database(dbPath)

// Create a sample table if it doesn't exist
// db.prepare(
//   `
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     name TEXT NOT NULL,
//     email TEXT UNIQUE NOT NULL
//   )
// `
// ).run()

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
  FOREIGN KEY (employeeId) REFERENCES Employee(id)
);
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS BillProducts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    billId INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    FOREIGN KEY (billId) REFERENCES Bill(id),
    FOREIGN KEY (productId) REFERENCES Product(id)
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

