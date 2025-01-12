import React, { useState, useEffect } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { useEmployeeStore } from '../stores/employee-store'
import { useBillStore } from '../stores/bill-store'
import { useProductStore } from '../stores/product-store'
import { Product } from '../types/Product'
import { Bill } from '@renderer/types/Bill'
import toast from 'react-hot-toast'
// interface Product {
//   productId: string
//   productName: string
//   price: number
// }

interface Totals {
  subtotal: number
  discountAmount: number
  grandTotal: number
}

interface FormData {
  customerName?: string
  phone?: string
  selectedEmployee: string
  discount: number
  billDate: string
}

const BillPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    watch,
    getValues,
    reset,
    formState: { errors }
  } = useForm<FormData>()
  const { employees, getAllEmployees } = useEmployeeStore()

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(0)

  const [discountType, setDiscountType] = useState<'flat' | 'percentage'>('flat')

  const { getAllProducts, products } = useProductStore()

  const [totals, setTotals] = useState<Totals>({ subtotal: 0, discountAmount: 0, grandTotal: 0 })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProducts, setSelectedProduct] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const watchDiscount = watch('discount', 0)

  let print = true;

  const { addBill } = useBillStore()

  useEffect(() => {
    getAllEmployees().then(() => {
      if (employees.length > 0) {
        setSelectedEmployeeId(employees[0].id)
      }
    })
    getAllProducts()
  }, [])

  useEffect(() => {
    const calculateTotal = (discount: number) => {
      const subtotal = selectedProducts.reduce((total, product) => total + product.price, 0)

      let discountAmount = 0
      if (discountType === 'percentage') {
        discountAmount = (subtotal * discount) / 100
      } else {
        discountAmount = discount
      }

      const grandTotal = subtotal - discountAmount
      setTotals({ subtotal, discountAmount, grandTotal })
    }

    calculateTotal(Number(watchDiscount))
  }, [selectedProducts, watchDiscount, discountType])

  const handleAddProduct = (product: Product) => {
    setSelectedProduct([...selectedProducts, product])
    setDialogOpen(false)
  }

  const handleRemoveProduct = (index: number) => {
    setSelectedProduct((prevProducts) => prevProducts.filter((_, i) => i !== index))
  }

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const { customerName, phone, selectedEmployee, billDate } = data;

    if (totals.subtotal === 0) {
      toast.error('Please enter amount')
      return
    }
    console.log(billDate)

    const selectedProductIds = selectedProducts.map((p) => p.id)

    const bill: Bill = {
      customerName: customerName ?? null,
      customerPhone: phone ?? null,
      employeeId: selectedEmployee !== 'NA' ? parseInt(selectedEmployee) : selectedEmployeeId,
      discount: totals.discountAmount,
      finalTotal: totals.grandTotal,
      subTotal: totals.subtotal,
      productIds: selectedProductIds,
      date: new Date(billDate).toISOString(),
      isPrint: print
    }

    addBill(bill).then(()=>{
      reset()
      setSelectedProduct([])
    })
    // alert(
    //   `Bill Generated!\n\nCustomer: ${customerName}\nContact: ${phone}\nService By: ${selectedEmployee ?? selectedEmployeeId}\nSubtotal: ₹${totals.subtotal.toFixed(
    //     2
    //   )}\nDiscount: ₹${totals.discountAmount.toFixed(2)}\nGrand Total: ₹${totals.grandTotal.toFixed(
    //     2
    //   )}`
    // )
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Bill</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Customer Name */}
        <div>
          <label className="block mb-2 font-medium">Customer Name (Optional)</label>
          <Controller
            name="customerName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter customer name"
              />
            )}
          />
        </div>

        {/* Contact Number */}
        <div>
          <label className="block mb-2 font-medium">Contact Number (Optional)</label>
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            rules={{
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Phone number must be exactly 10 digits'
              }
            }}
            render={({ field }) => (
              <input
                {...field}
                type="tel"
                maxLength={10}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Phone Number"
              />
            )}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
        </div>

        {/* Employee Dropdown */}
        <div>
          <label className="block mb-2 font-medium">Service By</label>
          <Controller
            name="selectedEmployee"
            control={control}
            defaultValue="Select Employee"
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Select Employee" disabled>
                  Select Employee
                </option>
                {employees.map((employee, index) => (
                  <option key={index} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* Date Field */}
        <div>
          <label className="block mb-2 font-medium">Bill Date</label>
          <Controller
            name="billDate"
            control={control}
            defaultValue={new Date().toISOString().substring(0, 10)} // Set default to today's date
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          />
        </div>

        {/* Products Section */}
        <div>
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add Products
          </button>
          <div className="mt-4">
            {selectedProducts.map((product, index) => (
              <div key={index} className="flex justify-between items-center border-b py-2">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">₹{product.price.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Discount Field */}
        <div>
          <label className="block mb-2 font-medium">Discount</label>
          <div className="flex space-x-4">
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as 'flat' | 'percentage')}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
            <Controller
              name="discount"
              control={control}
              defaultValue={0}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    discountType === 'percentage'
                      ? 'Enter discount percentage'
                      : 'Enter flat discount amount'
                  }
                />
              )}
            />
          </div>
        </div>

        {/* Total Price */}
        <div className="text-right font-bold text-lg text-gray-800">
          <div>Subtotal: ₹{totals.subtotal.toFixed(2)}</div>
          <div>Discount: ₹{totals.discountAmount.toFixed(2)}</div>
          <div>Grand Total: ₹{totals.grandTotal.toFixed(2)}</div>
        </div>

        {/* Submit Button */}
        <div className='flex gap-4'>
        <button
          onClick={()=>{print = true}}
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Generate Bill
        </button>
        <button
          type="button"
          onClick={() => {
            print = false;
            onSubmit(getValues())
          }}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Save
        </button>
        </div>
        

      </form>

      {/* Product Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Select Product</h3>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full mb-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search product..."
            />
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex justify-between items-center p-2 border rounded hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleAddProduct(product)}
                >
                  <span>{product.name}</span>
                  <span>₹{product.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setDialogOpen(false)}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BillPage
