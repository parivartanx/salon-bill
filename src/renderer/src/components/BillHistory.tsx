import React, { useState } from 'react';

interface Bill {
  billNo: string;
  date: string;
  customer: string;
  contactNo: string;
  total: string;
}

const BillHistoryPage: React.FC = () => {
  // Initial bill data
  const [bills] = useState<Bill[]>([
    { billNo: '#1001', date: '2024-02-15', customer: 'John Doe', contactNo: '9876543210', total: '$45.97' },
    { billNo: '#1002', date: '2024-02-16', customer: 'Jane Smith', contactNo: '9123456789', total: '$32.50' },
    // Add more sample data as needed
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filter bills based on search term
  const filteredBills = bills.filter((bill) =>
    bill.billNo.includes(searchTerm) ||
    bill.date.includes(searchTerm) ||
    bill.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.contactNo.includes(searchTerm)
  );

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
          onChange={(e) => setSearchTerm(e.target.value)}
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
              <td className="p-3">{bill.billNo}</td>
              <td className="p-3">{bill.date}</td>
              <td className="p-3">{bill.customer}</td>
              <td className="p-3">{bill.contactNo}</td>
              <td className="p-3">{bill.total}</td>
              <td className="p-3">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillHistoryPage;
