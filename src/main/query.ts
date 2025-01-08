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

export const getEmployees = async() => {
    const employees = await db.prepare('SELECT * FROM Employee')
    return employees.all()
}

export const getEmployee = async(id: number) => {
    const employee = await db.prepare('SELECT * FROM Employee WHERE id = ?')
    return employee.get(id)
}

export const updateEmployee = async(id: number, name: string, phone: string, email: string) => {
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

export const getProducts = async() => {
    const products = await db.prepare('SELECT * FROM Product')
    return products.all()
}

export const getProduct = async(id: number) => {
    const product = await db.prepare('SELECT * FROM Product WHERE id = ?')
    return product.get(id)
}   

export const updateProduct = async(id: number, name: string, price: number, description: string) => {
    const update = await db.prepare('UPDATE Product SET name = ?, price = ?, description = ? WHERE id = ?')
    return update.run(name, price, description, id)
}

/// Bill queries
export const makeBill = async(customerName:string,customerPhone:string,employeeId: number, subTotal: number, discount: number, finalTotal: number, date: string,productIds:string[]) => {
    // Validate employeeId
    const employeeExists = db.prepare('SELECT id FROM Employee WHERE id = ?').get(employeeId);
    if (!employeeExists) {
      throw new Error(`Employee with ID ${employeeId} does not exist.`);
    }
    // Validate productIds
    for (const productId of productIds) {
        const productExists = db.prepare('SELECT id FROM Product WHERE id = ?').get(productId);
        if (!productExists) {
          throw new Error(`Product with ID ${productId} does not exist.`);
        }
      }
   
    // Start a transaction
    const transaction = db.transaction(() => {
        // Insert the bill
        const insertBill = db.prepare(`
          INSERT INTO Bill (customerName, customerPhone, employeeId, subTotal, discount, finalTotal, date) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const billResponse = insertBill.run(customerName, customerPhone, employeeId, subTotal, discount, finalTotal, date);
        const billId = billResponse.lastInsertRowid;
  
        // Insert products into BillProducts
        const insertBillProduct = db.prepare(`
          INSERT INTO BillProducts (billId, productId) VALUES (?, ?)
        `);
        for (const productId of productIds) {
          insertBillProduct.run(billId, productId);
        }
  
        return billId;
      });
  
      // Execute the transaction
      const billId = transaction();
      console.log(`Bill created successfully with ID: ${billId}`);
      return billId;
    /// insert into bill products
}




