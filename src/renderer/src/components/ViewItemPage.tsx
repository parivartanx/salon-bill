import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

// Define the form data type
type SearchFormData = {
  search: string;
};

// Define the product type
type Product = {
  id: string;
  name: string;
  price: string;
};

const ViewItemPage: React.FC = () => {
  // Sample product list
  const products: Product[] = [
    { id: '001', name: 'Burger', price: '$8.99' },
    { id: '002', name: 'Pizza', price: '$12.99' },
    { id: '003', name: 'Chicken Biriyani', price: '$15.99' },
    { id: '004', name: 'Pasta', price: '$7.99' },
    { id: '005', name: 'Salad', price: '$5.99' },
  ];

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const { register, handleSubmit } = useForm<SearchFormData>();

  // Handle search logic
  const onSearch: SubmitHandler<SearchFormData> = (data) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(data.search.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  return (
    <div className="p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">View Products</h2>

      <form onSubmit={handleSubmit(onSearch)} className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          {...register('search')}
          className="p-2 border rounded w-1/2 mr-2"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          Search
        </button>
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Product ID</th>
            <th className="p-3 text-left">Product Name</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-3">{product.id}</td>
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.price}</td>
                <td className="p-3">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-10">Edit</button>
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-3 text-center text-gray-500">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewItemPage;
