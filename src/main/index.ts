import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import db from './database'

import { addEmployee,getEmployees,deleteEmployee, addProduct,getProducts,deleteProduct,
  updateProduct,
  updateEmployee

} from './query'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


ipcMain.handle('add-employee', async(event, { name, phone, email }) => {
  try {
    const response = await addEmployee(name,phone,email)
    if(response.changes === 0) {
      return { success: false, message: 'Employee not added!' }
    }
    return { success: true, message: 'User added successfully!' }
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
})

ipcMain.handle('get-employees', async() => {
  try{
    const employees = await getEmployees()
    return {success:true, data:employees}
  }catch(e){
    return { success: false, message: (e as Error).message }
  }
})

ipcMain.handle('delete-employee', async(event, {id}) => {
  try {
    const response = await deleteEmployee(id)
    if(response.changes === 0) {
      return { success: false, message: 'Employee not deleted!' }
    }
    return { success: true, message: 'Employee deleted successfully!' }
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
})

ipcMain.handle('update-employee', async(event, {id, name, phone, email}) => {
  try {
    console.log("update-employee", id, name, phone, email)
    const response = await updateEmployee(id, name, phone, email)
    if(response.changes === 0) {
      return { success: false, message: 'Employee not updated!' }
    }
    return { success: true, message: 'Employee updated successfully!' }
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
})



/// Product IPC handlers
ipcMain.handle('add-product', async(event, { name, price, description }) => {
  try {
    console.log("add-product", name, price, description)
    const response = await addProduct(name,price,description)
    console.log("response", response)
    if(response.changes === 0) {
      return { success: false, message: 'Product not added!' }
    }
    return { success: true, message: 'Product added successfully!' }
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
})

ipcMain.handle('get-products', async() => {
  try{
    const products = await getProducts()
    return {success:true, data:products}
  }catch(e){
    return { success: false, message: (e as Error).message }
  }
})

ipcMain.handle('delete-product', async(event, {id}) => {
  try {
    const response = await deleteProduct(id)
    if(response.changes === 0) {
      return { success: false, message: 'Product not deleted!' }
    }
    return { success: true, message: 'Product deleted successfully!' }
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
})

ipcMain.handle('update-product', async(event, {id, name, price, description}) => {
  try {
    const response = await updateProduct(id, name, price, description)
    if(response.changes === 0) {
      return { success: false, message: 'Product not updated!' }
    }
    return { success: true, message: 'Product updated successfully!' }
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
})

ipcMain.handle('make-bill', async(_, {employeeId, productIds, subTotal, discount, finalTotal, date}) => {
  try{
    console.log("make-bill", employeeId, productIds, subTotal, discount, finalTotal, date)
    return { success: true, message: 'Bill added successfully!' }
  }catch(e){
    return { success: false, message: (e as Error).message }
  }
})


ipcMain.handle('get-users', () => {
  const users = db.prepare('SELECT * FROM users')
  return users.all()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
