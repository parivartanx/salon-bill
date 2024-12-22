import React, { useState } from 'react';
import { useForm, Controller, FieldValues } from 'react-hook-form';

const BillPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    // setValue,
  } = useForm();

  const [discountType, setDiscountType] = useState('percentage'); // Discount type: 'flat' or 'percentage'
  const [products, setProducts] = useState([
    { productId: '', productName: '', price: 0 },
  ]);

  const handleAddProduct = () => {
    setProducts([
      ...products,
      { productId: '', productName: '', price: 0 },
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    setProducts((prevProducts) => prevProducts.filter((_, i) => i !== index));
  };

  const handleProductChange = (index: number, field: string, value: string | number) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      updatedProducts[index] = { ...updatedProducts[index], [field]: value };
      return updatedProducts;
    });
  };

  const calculateTotal = (discount: number) => {
    const subtotal = products.reduce((total, product) => total + product.price, 0);

    let discountAmount = 0;
    if (discountType === 'percentage') {
      discountAmount = (subtotal * discount) / 100;
    } else {
      discountAmount = discount;
    }

    const grandTotal = subtotal - discountAmount;

    return {
      subtotal,
      discountAmount,
      grandTotal,
    };
  };

  const onSubmit = (data: FieldValues) => {
    // Handle form submission logic
    const { customerName, contactNumber, discount } = data;
    const { subtotal, discountAmount, grandTotal } = calculateTotal(discount);

    alert(`Bill Generated!\n\nCustomer: ${customerName}\nContact: ${contactNumber}\nSubtotal: ₹${subtotal}\nDiscount: ₹${discountAmount}\nGrand Total: ₹${grandTotal}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Bill</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Customer Name */}
        <div>
          <label className="block mb-2 font-medium">Customer Name</label>
          <Controller
            name="customerName"
            control={control}
            defaultValue=""
            rules={{ required: 'Customer name is required' }}
            render={({ field }) => (
              <input
                {...field}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter customer name"
              />
            )}
          />
          {/* {errors.customerName && <p className="text-red-500 text-sm">{errors.customerName.message}</p>} */}
        </div>

        {/* Contact Number */}
        <div>
          <label className="block mb-2 font-medium">Contact Number (Optional)</label>
          <Controller
            name="contactNumber"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter contact number"
              />
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
                      onChange={(e) => handleProductChange(index, 'price', Number(e.target.value) || 0)}
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
              onChange={(e) => setDiscountType(e.target.value)}
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
          {calculateTotal(0) && (
            <>
              <div>Subtotal: ₹{calculateTotal(0).subtotal.toFixed(2)}</div>
              <div>Discount: ₹{calculateTotal(0).discountAmount.toFixed(2)}</div>
              <div>Grand Total: ₹{calculateTotal(0).grandTotal.toFixed(2)}</div>
            </>
          )}
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
  );
};

export default BillPage;
