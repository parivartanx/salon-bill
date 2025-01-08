// import electron from 'electron'
// // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// // @ts-ignore
// import { PosPrinter } from 'electron-pos-printer';

// // Importing BrowserWindow from Main
// const window = electron.BrowserWindow;

// // Get List of Printers
// const printWindow = window.getFocusedWindow();
// if (printWindow === null){
//     throw new Error
// }
// const list = await printWindow.webContents.getPrintersAsync();
// console.log('list of Printers', list)

// export const printrecipt = ()=> {
//     // eslint-disable-next-line @typescript-eslint/no-require-imports
//     // const {PosPrinter} = require("electron-pos-printer");

// const options = {
//     preview: false, // Preview in window or print
//     margin: "0 0 0 0", // margin of content body
//     copies: 1, // Number of copies to print
//     printerName: "TVS-E RP 3230", // printerName: string, check it at webContent.getPrinters()
//     timeOutPerLine: 400,
//     silent: true,
//     pageSize: '80mm'
// };

// const data = [
//   {
//     type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
//     value: "HEADER",
//     style: {fontSize: "18px", textAlign: 'center' },
//   },
//   {
//        type: 'text', // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
//        value: 'Secondary text',
//        style: {textDecoration: "underline", fontSize: "10px", textAlign: "center", color: "red"}
//   },
// //   {
// //     type: "image",
// //     path: path.join(__dirname, "assets/img_test.png"), // file path
// //     position: "center", // position of image: 'left' | 'center' | 'right'
// //     width: "auto", // width of image in px; default: auto
// //     height: "60px", // width of image in px; default: 50 or '50px'
// //   },
//   {
//         type: 'table',
//         // style the table
//         style: {border: '1px solid #ddd'},
//         // list of the columns to be rendered in the table header
//         tableHeader: ['Animal', 'Age'],
//         // multi dimensional array depicting the rows and columns of the table body
//         tableBody: [
//             ['Cat', 2],
//             ['Dog', 4],
//             ['Horse', 12],
//             ['Pig', 4],
//         ],
//         // list of columns to be rendered in the table footer
//         tableFooter: ['Animal', 'Age'],
//         // custom style for the table header
//         tableHeaderStyle: { backgroundColor: '#000', color: 'white'},
//         // custom style for the table body
//         tableBodyStyle: {'border': '0.5px solid #ddd'},
//         // custom style for the table footer
//         tableFooterStyle: {backgroundColor: '#000', color: 'white'},
//    },
//   {
//     type: 'barCode',
//     value: '023456789010',
//     height: 40,                     // height of barcode, applicable only to bar and QR codes
//     width: 2,                       // width of barcode, applicable only to bar and QR codes
//     displayValue: true,             // Display value below barcode
//     fontsize: 12,
//   },
//   {
//     type: "text", // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
//     value: '************************',
//     style: { fontSize: "10px", textAlign: 'center', marginBottom: '10px'},
//   },
// ];


//   PosPrinter.print(data, options)
//     .then(() => {})
//     .catch((error) => {
//     console.error(error);
//   });

// }