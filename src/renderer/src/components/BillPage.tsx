import React, { useState, useEffect } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

interface Product {
  productId: string
  productName: string
  price: number
}

interface Totals {
  subtotal: number
  discountAmount: number
  grandTotal: number
}

interface FormData {
  customerName?: string
  phone?: string // Make phone optional
  selectedEmployee: string
  discount: number
}

const BillPage: React.FC = () => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>()

  const [discountType, setDiscountType] = useState<'flat' | 'percentage'>('flat') // Default discount type
  const [products, setProducts] = useState<Product[]>([{ productId: '', productName: '', price: 0 }])
  const [totals, setTotals] = useState<Totals>({ subtotal: 0, discountAmount: 0, grandTotal: 0 })
  const [employeeList] = useState(['Alice', 'Bob', 'Charlie', 'Diana']) // Replace with your employee list
  const watchDiscount = watch('discount', 0)

  // Recalculate totals whenever products or discount changes
  useEffect(() => {
    const calculateTotal = (discount: number) => {
      const subtotal = products.reduce((total, product) => total + product.price, 0)

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
  }, [products, watchDiscount, discountType])

  const handleAddProduct = () => {
    setProducts([...products, { productId: '', productName: '', price: 0 }])
  }

  const handleRemoveProduct = (index: number) => {
    setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index))
  }

  const handleProductChange = (index: number, field: string, value: string | number) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts]
      updatedProducts[index] = { ...updatedProducts[index], [field]: value }
      return updatedProducts
    })
  }

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const { customerName, phone, selectedEmployee } = data
    alert(
      `Bill Generated!\n\nCustomer: ${customerName}\nContact: ${phone}\nService By: ${selectedEmployee}\nSubtotal: ₹${totals.subtotal.toFixed(
        2
      )}\nDiscount: ₹${totals.discountAmount.toFixed(2)}\nGrand Total: ₹${totals.grandTotal.toFixed(
        2
      )}`
    )
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
                message: 'Phone number must be exactly 10 digits',
              },
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
            defaultValue={employeeList[0]}
            render={({ field }) => (
              <select
                {...field}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {employeeList.map((employee, index) => (
                  <option key={index} value={employee}>
                    {employee}
                  </option>
                ))}
              </select>
            )}
          />
        </div>

        {/* Products Section */}
        <div>
          <label className="block mb-2 font-medium">Products</label>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Product ID</th>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">
                    <input
                      type="text"
                      value={product.productId}
                      onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="Product ID"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="text"
                      value={product.productName}
                      onChange={(e) => handleProductChange(index, 'productName', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                      placeholder="Product Name"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={product.price || ''}
                      onChange={(e) =>
                        handleProductChange(index, 'price', Number(e.target.value) || 0)
                      }
                      className="w-full px-2 py-1 border rounded"
                      placeholder="Price"
                    />
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={handleAddProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add Product
          </button>
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
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Generate Bill
        </button>
      </form>
    </div>
  )
}

export default BillPage
