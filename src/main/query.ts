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





