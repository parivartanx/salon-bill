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
    productName TEXT NOT NULL,
    price REAL NOT NULL,
    productDescription TEXT
)`
).run()

console.log('SQLite3 database initialized.')
export default db
