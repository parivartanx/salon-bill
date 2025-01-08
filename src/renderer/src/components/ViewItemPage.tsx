import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Product } from '../types/Product';
import { useProductStore } from '../stores/product-store';

type SearchFormData = {
  search: string;
};



const ViewItemPage: React.FC = () => {
  const { products, addProduct,getAllProducts,removeProduct,updateProduct} = useProductStore();

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const { register, handleSubmit } = useForm<SearchFormData>();
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  useEffect(() => {
    getAllProducts().then((data) => {
      setFilteredProducts(data);
    })
  }, [getAllProducts,]);

  const onSearch: SubmitHandler<SearchFormData> = (data) => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(data.search.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleAddOrUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProduct?.name && currentProduct?.price && currentProduct?.description) {
      if (editMode) {
        updateProduct(currentProduct);
        getAllProducts().then((data) => {
          setFilteredProducts(data);
        })
        setEditMode(false);
      } else {
        addProduct(currentProduct);
        getAllProducts().then((data) => {
          setFilteredProducts(data);
        })
      }
      setCurrentProduct(null);
      setShowForm(false);
    } else {
      alert('Please fill out all fields!');
    }
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDeleteProduct = (id: number) => {
    console.log('remove product', id);
    removeProduct(id);
    setFilteredProducts((prev) => prev.filter((product) => product.id !== id));
    
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
        <button
          type="button"
          onClick={() => {
            setCurrentProduct({ id:1, name: '', price: 1, description: '' });
            setEditMode(false);
            setShowForm(true);
          }}
          className="ml-4 p-2 bg-green-500 text-white rounded"
        >
          Add Product
        </button>
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Product ID</th>
            <th className="p-3 text-left">Product Name</th>
            <th className="p-3 text-left">Price</th>
            {/* <th className="p-3 text-left">Description</th> */}
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
                {/* <td className="p-3">{product.description}</td> */}
                <td className="p-3">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-3 text-center text-gray-500">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              {editMode ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleAddOrUpdateProduct}>
              {/* <div className="mb-4">
                <label className="block mb-2 font-medium">Product ID</label>
                <input
                  type="text"
                  value={
                    editMode
                      ? currentProduct?.id
                      : (products.length + 1).toString().padStart(3, '0')
                  }
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                />
              </div> */}
              <div className="mb-4">
                <label className="block mb-2 font-medium">Name</label>
                <input
                  type="text"
                  value={currentProduct?.name || ''}
                  onChange={(e) =>
                    setCurrentProduct((prev) => ({
                      ...prev!,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Product Name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Price</label>
                <input
                  type="text"
                  value={currentProduct?.price || ''}
                  onChange={(e) =>
                    setCurrentProduct((prev) => ({
                      ...prev!,
                      price: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Product Price"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Description</label>
                <textarea
                  value={currentProduct?.description || ''}
                  onChange={(e) =>
                    setCurrentProduct((prev) => ({
                      ...prev!,
                      description: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter Product Description"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  {editMode ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewItemPage;
