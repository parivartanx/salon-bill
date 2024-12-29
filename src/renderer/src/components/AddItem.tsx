import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X } from 'lucide-react';
import { Product } from '@renderer/types/Product';



const AddItemPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Product>();

  const onSubmit: SubmitHandler<Product> = (data) => {
    console.log('Form Submitted:', data);
    reset();
  };

  return (
    <div className="h-full bg-white shadow-2xl flex flex-col">
      <div className="bg-gradient-to-r from-blue-500 to-purple-700 p-4 md:p-6 shadow-md">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
          Add New Product
        </h2>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 md:p-6">
        <div className="w-full h-full max-w-6xl rounded-2xl overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col p-6 md:p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  {...register('productName', { required: 'Product name is required' })}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition duration-300
                    ${errors.productName
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                  placeholder="Enter product name"
                />
                {errors.productName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <X className="mr-2 h-4 w-4" /> {errors.productName.message}
                  </p>
                )}
              </div>

              {/* Price Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price
                </label>
                <input
                  type="number"
                  {...register('price', { required: 'Price is required', min: 0 })}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition duration-300
                    ${errors.price
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                  placeholder="Enter price"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <X className="mr-2 h-4 w-4" /> {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            {/* Product Description Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Description
              </label>
              <textarea
                {...register('productDescription', { required: 'Product description is required' })}
                className={`w-full px-4 py-3 border-2 rounded-lg transition duration-300
                  ${errors.productDescription
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}`}
                placeholder="Enter product description"
                rows={4}
              />
              {errors.productDescription && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <X className="mr-2 h-4 w-4" /> {errors.productDescription.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-auto">
              <button
                type="submit"
                className="w-full flex items-center justify-center bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemPage;
