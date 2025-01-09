import React, { useEffect, useState } from 'react'
import { useBillStore } from '../stores/bill-store'
import { Bill } from '@renderer/types/Bill'

const BillHistoryPage: React.FC = () => {
  const { bills, getAllBills } = useBillStore()

  const [filteredBills, setFilteredBills] = useState<Bill[]>([])
  // Initial bill data
  // const [bills] = useState<Bill[]>([
  //   { billNo: '#1001', date: '2024-02-15', customer: 'John Doe', contactNo: '9876543210', total: '₹500.50' },
  //   { billNo: '#1002', date: '2024-02-16', customer: 'Jane Smith', contactNo: '9123456789', total: '₹800.25' },
  //   // Add more sample data as needed
  // ]);

  useEffect(() => {
    getAllBills().then((bills) => {
      setFilteredBills(bills)
    })
  }, [])

  const [searchTerm] = useState<string>('')

  const searchBill = (searchStr: string) => {
    const filteredBills = bills.filter(
      (bill) =>
        bill.customerName?.includes(searchStr) ||
        bill.date.includes(searchStr) ||
        bill.finalTotal.toString().toLowerCase().includes(searchStr.toLowerCase()) ||
        bill.customerPhone?.toString().includes(searchStr)
    )

    console.log('filtered str', filteredBills)

    //  setFilteredBills(filteredBills)
  }

  // Filter bills based on search term
  // const filteredBills = bills.filter((bill) =>
  //   bill.customerName?.includes(searchTerm) ||
  //   bill.date.includes(searchTerm) ||
  //   bill.finalTotal.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   bill.customerPhone?.toString().includes(searchTerm)
  // );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Bill History</h2>

      {/* Search input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Bill No, Date, Customer, or Contact"
          className="p-3 border border-gray-300 rounded-lg w-full"
          value={searchTerm}
          onChange={(e) => searchBill(e.target.value)}
        />
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Bill Number</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Contact No</th>
            <th className="p-3 text-left">Total</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBills.map((bill, index) => (
            <tr className="border-b" key={index}>
              <td className="p-3">{bill.id}</td>
              <td className="p-3">
                {new Date(bill.date).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </td>
              <td className="p-3">{bill.customerName}</td>
              <td className="p-3">{bill.customerPhone}</td>
              <td className="p-3">{bill.finalTotal}</td>
              <td className="p-3">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BillHistoryPage
