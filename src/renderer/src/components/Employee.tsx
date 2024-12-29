import React, { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';

interface Employee {
  id: number;
  name: string;
  phone: string;
  email: string;
}

const EmployeeListPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: 'John Doe', phone: '1234567890', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', phone: '9876543210', email: 'jane@example.com' },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  // useForm hook from react-hook-form
  const { control, handleSubmit, reset, formState: { errors } } = useForm<Employee>();

  const onSubmit: SubmitHandler<Employee> = (data) => {
    if (editMode && currentEmployee) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === currentEmployee.id ? { ...data, id: emp.id } : emp
        )
      );
      setEditMode(false);
    } else {
      setEmployees((prev) => [...prev, { ...data, id: employees.length + 1 }]);
    }
    reset(); // Reset form fields after submission
    setShowForm(false);
  };

  const handleEditEmployee = (employee: Employee) => {
    setCurrentEmployee(employee);
    setEditMode(true);
    setShowForm(true);
    reset(employee); // Set current employee data into the form
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees((prev) => prev.filter((employee) => employee.id !== id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Employee List</h1>

      {/* Add Employee Button */}
      <button
        onClick={() => {
          setEditMode(false);
          setCurrentEmployee(null);
          reset({ name: '', phone: '', email: '' });
          setShowForm(true);
        }}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition mb-4"
      >
        Add Employee
      </button>

      {/* Employee Table */}
      <table className="w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3">ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Phone</th>
            <th className="p-3">Email</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b">
              <td className="p-3">{employee.id}</td>
              <td className="p-3">{employee.name}</td>
              <td className="p-3">{employee.phone}</td>
              <td className="p-3">{employee.email}</td>
              <td className="p-3 flex space-x-4">
                <button
                  onClick={() => handleEditEmployee(employee)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteEmployee(employee.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {employees.length === 0 && (
            <tr>
              <td className="p-3 text-center text-gray-500" colSpan={5}>
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add/Edit Employee Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">{editMode ? 'Edit Employee' : 'Add Employee'}</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Employee ID</label>
                <input
                  type="text"
                  value={currentEmployee?.id || ''}
                  disabled
                  className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Name</label>
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: 'Name is required' }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Employee Name"
                    />
                  )}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Phone</label>
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Phone is required',
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
              <div className="mb-4">
                <label className="block mb-2 font-medium">Email</label>
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                      message: 'Invalid email address',
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter Email Address"
                    />
                  )}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
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

export default EmployeeListPage;
