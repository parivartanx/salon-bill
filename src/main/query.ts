import db from './database'

/// employee queries

export const addEmployee = async (name: string, phone: string, email: string) => {
  const insert = await db.prepare('INSERT INTO Employee (name, phone, email) VALUES (?, ?, ?)')
  return insert.run(name, phone, email)
}

export const deleteEmployee = async (id: number) => {
  const remove = await db.prepare('DELETE FROM Employee WHERE id = ?')
  return remove.run(id)
}

export const getEmployees = async () => {
  const employees = await db.prepare('SELECT * FROM Employee')
  return employees.all()
}

export const getEmployee = async (id: number) => {
  const employee = await db.prepare('SELECT * FROM Employee WHERE id = ?')
  return employee.get(id)
}

export const updateEmployee = async (id: number, name: string, phone: string, email: string) => {
  const update = await db.prepare('UPDATE Employee SET name = ?, phone = ?, email = ? WHERE id = ?')
  return update.run(name, phone, email, id)
}

/// Products queries

export const addProduct = async (name: string, price: number, description: string) => {
  const insert = await db.prepare('INSERT INTO Product (name, price, description) VALUES (?, ?, ?)')
  return insert.run(name, price, description)
}

export const deleteProduct = async (id: number) => {
  const remove = await db.prepare('DELETE FROM Product WHERE id = ?')
  return remove.run(id)
}

export const getProducts = async () => {
  const products = await db.prepare('SELECT * FROM Product')
  return products.all()
}

export const getProduct = async (id: number) => {
  const product = await db.prepare('SELECT * FROM Product WHERE id = ?')
  return product.get(id)
}

export const updateProduct = async (
  id: number,
  name: string,
  price: number,
  description: string
) => {
  const update = await db.prepare(
    'UPDATE Product SET name = ?, price = ?, description = ? WHERE id = ?'
  )
  return update.run(name, price, description, id)
}

/// Bill queries
export const makeBill = async (
  customerName: string,
  customerPhone: string,
  employeeId: number,
  subTotal: number,
  discount: number,
  finalTotal: number,
  date: string,
  productIds: string[],
) => {
  // Validate employeeId
  const employeeExists = db.prepare('SELECT id FROM Employee WHERE id = ?').get(employeeId)
  if (!employeeExists) {
    throw new Error(`Employee with ID ${employeeId} does not exist.`)
  }
  // Validate productIds
  for (const productId of productIds) {
    const productExists = db.prepare('SELECT id FROM Product WHERE id = ?').get(productId)
    if (!productExists) {
      throw new Error(`Product with ID ${productId} does not exist.`)
    }
  }

  // Start a transaction
  const transaction = db.transaction(() => {
    // Insert the bill
    const insertBill = db.prepare(`
          INSERT INTO Bill (customerName, customerPhone, employeeId, subTotal, discount, finalTotal, date) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `)
    const billResponse = insertBill.run(
      customerName,
      customerPhone,
      employeeId,
      subTotal,
      discount,
      finalTotal,
      date
    )
    const billId = billResponse.lastInsertRowid

    // Insert products into BillProducts
    const insertBillProduct = db.prepare(`
          INSERT INTO BillProducts (billId, productId) VALUES (?, ?)
        `)
    for (const productId of productIds) {
      insertBillProduct.run(billId, productId)
    }

    return billId
  })

  // Execute the transaction
  const billId = transaction()
  console.log(`Bill created successfully with ID: ${billId}`)
  return billId
  /// insert into bill products
}

export const getBillHistory = () => {
  // Query to fetch bills with employee and product details
  const query = `
SELECT 
  Bill.id AS billId,
  Bill.customerName,
  Bill.customerPhone,
  Bill.subTotal,
  Bill.discount,
  Bill.finalTotal,
  Bill.date,
  Employee.name AS employeeName,
  Employee.phone AS employeePhone,
  Employee.email AS employeeEmail,
  GROUP_CONCAT(Product.name) AS productNames,
  GROUP_CONCAT(Product.price) AS productPrices
FROM 
  Bill
LEFT JOIN 
  Employee ON Bill.employeeId = Employee.id
LEFT JOIN 
  BillProducts ON Bill.id = BillProducts.billId
LEFT JOIN 
  Product ON BillProducts.productId = Product.id
GROUP BY 
  Bill.id
ORDER BY 
  Bill.date DESC;
`

  // Execute the query
  const bills = db.prepare(query).all()
  return bills
}

export const analyticsReport = async()=>{
    // Queries
const monthlySalesQuery = `
SELECT 
    strftime('%Y-%m', date) AS month, 
    SUM(finalTotal) AS totalSales
FROM 
    Bill
GROUP BY 
    strftime('%Y-%m', date)
ORDER BY 
    month DESC;
`

const todaySalesQuery = `
SELECT 
    COUNT(*) AS totalBills,
    SUM(finalTotal) AS totalSales 
FROM 
    Bill 
WHERE 
    DATE(date) = DATE('now', 'localtime');

`

const topProductsQuery = `
SELECT 
    Product.name AS productName,
    COUNT(BillProducts.productId) AS totalSold
FROM 
    BillProducts
LEFT JOIN 
    Product ON BillProducts.productId = Product.id
GROUP BY 
    Product.id
ORDER BY 
    totalSold DESC
LIMIT 10;
`

const totalProductsQuery = `
SELECT 
    COUNT(*) AS totalProducts
FROM 
    Product;
`

const billsByEmployeeForCurrentMonth = db.prepare(`
  SELECT 
      e.name AS employeeName,
      COUNT(b.id) AS totalBillsGenerated,
      SUM(b.finalTotal) AS totalSalesAmount
  FROM 
      Bill b
  JOIN 
      Employee e ON b.employeeId = e.id
  WHERE 
      strftime('%Y-%m', b.date) = strftime('%Y-%m', 'now', 'localtime')
  GROUP BY 
      b.employeeId
  ORDER BY 
      totalBillsGenerated DESC;
`).all();

// Execute Queries
const monthlySales = db.prepare(monthlySalesQuery).all()
const todaySales = db.prepare(todaySalesQuery).all()
const topProducts = db.prepare(topProductsQuery).all()
const totalProducts = db.prepare(totalProductsQuery).get()

return {
  monthlySales,
  todaySales,
  topProducts,
  "totalProducts":totalProducts,
  "employeeCurrentMonthBill":billsByEmployeeForCurrentMonth
}

}
