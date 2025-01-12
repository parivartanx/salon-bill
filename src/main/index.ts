import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { Employee, Product } from './database'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const escpos = require('escpos');
// eslint-disable-next-line @typescript-eslint/no-require-imports
escpos.USB = require('escpos-usb')

import { addEmployee,getEmployees,deleteEmployee, addProduct,getProducts,deleteProduct,
  updateProduct,
  updateEmployee,
  makeBill,
  getProduct,
  getBillHistory,
  analyticsReport,
  getEmployee

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

// ipcMain.handle('print-receipt',async(_,{data})=>{
//   try {
//     console.log("His is ;ksdjf;alksfdj")
//       // List available USB devices
//       const devices = escpos.USB.findPrinter();;
//   console.log("Detected USB devices:", devices);
//     const device  = new escpos.USB(0x0416, 0x5011);
//     console.log("Device from usb ")
//     const options = { encoding: "GB18030" /* default */ }
//     const printer = new escpos.Printer(device, options);
//     device.open(function(error){
//       console.log("Error is in open function i think not error",error)
//       printer
//       .font('a')
//       .align('ct')
//       .style('bu')
//       .size(1, 1)
//       .text('The quick brown fox jumps over the lazy dog')
//       .text('Xyz test ;askdjf ;akdlfj')
//       .barcode('1234567', 'EAN8')
//       .table(["One", "Two", "Three"])
//       .tableCustom(
//         [
//           { text:"Left", align:"LEFT", width:0.33, style: 'B' },
//           { text:"Center", align:"CENTER", width:0.33},
//           { text:"Right", align:"RIGHT", width:0.33 }
//         ],
//         { encoding: 'cp857', size: [1, 1] } // Optional
//       )
//       .qrimage('https://github.com/song940/node-escpos', function(err){
//         printer.cut();
//         printer.close();
//         console.log("Error ",err)
//       });
//       console.log("error ")

//     });

//   }catch(e){
//     console.log("Error while printing receipt",e);
//   }
// })


ipcMain.handle('add-employee', async(_, { name, phone, email }) => {
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

ipcMain.handle('delete-employee', async(_, {id}) => {
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

ipcMain.handle('update-employee', async(_, {id, name, phone, email}) => {
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
ipcMain.handle('add-product', async(_, { name, price, description }) => {
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

ipcMain.handle('delete-product', async(_, {id}) => {
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

ipcMain.handle('update-product', async(_, {id, name, price, description}) => {
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

ipcMain.handle('make-bill', async(_, {customerPhone,customerName,employeeId, productIds, subTotal, discount, finalTotal, date,isPrint}) => {
  try{
    const items:Product[] = []

    for(let i = 0;i < productIds.length; i++){
      const item = await getProduct(productIds[i])
      items.push(item)
    }   
    const employee:Employee = await getEmployee(employeeId) 
   

    if(!isPrint){
      await makeBill(customerName,customerPhone,employeeId,subTotal,discount,finalTotal,date,productIds)
      return { success: true, message: 'Bill added successfully!' }
    }

    const devices = new escpos.USB.findPrinter();
    if(devices.length === 0 ){
      throw new Error("Please connect printer");
    }

    const invoiceNo = await makeBill(customerName,customerPhone,employeeId,subTotal,discount,finalTotal,date,productIds)

    const options = { encoding: 'GB18030' /* default */ }
    // encoding is optional
    const device = new escpos.USB()
    const printer = new escpos.Printer(device, options)
    // const options = { encoding: "GB18030" /* default */ }
    device.open(function (error) {
      if (error) {
        console.log("Device open error", error);
        return;
      }
    
      const lineWidth = 40; // Adjust to match your printer's character width
      const columnWidths = { id: 5, name: 20, price: 10 }; // Adjust column widths
    
      // Utility to pad strings
      const padText = (text, width, align = "left") => {
        if (align === "right") {
          return text.toString().padStart(width, " ");
        } else {
          return text.toString().padEnd(width, " ");
        }
      };
    
      // Print Header
      printer
        .font("a")
        .align("ct")
        .style("bu")
        .size(0.5, 0.5)
        .text("Classic Touch Mens Salon") // Salon name
        .style("normal")
        .text("Congress Maidan Road Kadam Kuan Patna")
        .text("Mobile & WhatsApp: +91 9473450671")
        .drawLine();
    
      // Print Billing Details Header
      printer
        .align("lt")
        .text(`Date: ${new Date(date).toLocaleDateString()}    Time: ${new Date().toLocaleTimeString()}`)
        .text(`Invoice No: INV-00${invoiceNo}`)
        .text(`Customer Name: ${customerName ?? "NA"}`)
        .text(`Customer Phone: ${customerPhone ?? "NA"}`)
        .text(`Service By ${employee.name ?? "NA"}`)
        .drawLine();
    
      // Column Headers
      printer
        .text(
          padText("Id", columnWidths.id) +
            padText("Item", columnWidths.name) +
            padText("Amount", columnWidths.price, "right")
        )
        .drawLine();
    
      // Print Billing Items
      items.forEach((item) => {
        printer.text(
          padText(item.id, columnWidths.id) +
            padText(item.name, columnWidths.name) +
            padText(item.price.toFixed(2), columnWidths.price, "right")
        );
      });
    
      // Calculate and Print Totals
      printer.drawLine();
      printer.text(
        padText("Subtotal:", lineWidth - 10) +
          padText(subTotal.toFixed(2), 10, "right")
      );
      printer.text(
        padText("Discount:", lineWidth - 10) +
          padText(`-${discount.toFixed(2)}`, 10, "right")
      );
      printer.drawLine();
      printer.text(
        padText("Final Total:", lineWidth - 10) +
          padText(finalTotal.toFixed(2), 10, "right")
      );
      printer.drawLine();

    
      // Footer
      printer
        .align("ct")
        .text("Thank you for visiting!")
        .text("We hope to see you again!")
        .text("")
        .text("Designed By: parivartanx.com")
        .cut()
        .close();
    });
    
    return { success: true, message: 'Bill added successfully!' }
  }catch(e){
    console.log("Error in printer init",e)
    return { success: false, message: (e as Error).message }
  }
})



ipcMain.handle('bill-history',async()=>{
  try {
    const bills = await getBillHistory();
    return {
      success:true,
      bills,
    }
  }catch(e){
    return {
      success:false,message:(e as Error).message
    }
  }
})

ipcMain.handle('analytics',async()=> {
  try{
    const report = await analyticsReport()
    return {
      success:true,
      data:report
    }
  }catch(e){
    return {
      success:true,
      message:(e as Error).message
    }
  }
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
