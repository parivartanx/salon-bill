import React from 'react';
import { LayoutDashboard, Receipt, PlusSquare, List, FileText, Users } from 'lucide-react'; // Added Users icon

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
    { icon: Receipt, label: 'Make Bill', page: 'bill' },
    { icon: PlusSquare, label: 'Add Product', page: 'addItem' },
    { icon: List, label: 'View Product', page: 'viewItem' },
    { icon: FileText, label: 'Bill History', page: 'billHistory' },
    { icon: Users, label: 'Employee List', page: 'employeeList' }, // Added Employee List menu item
  ];

  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800">Salon Billing</h1>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => (
          <button
            key={item.page}
            onClick={() => setActivePage(item.page)}
            className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors duration-200 ${
              activePage === item.page
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="mr-3" size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
