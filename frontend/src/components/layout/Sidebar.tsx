import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Clientes", path: "/clients" },
  { icon: CreditCard, label: "Boletos", path: "/bills" },
  { icon: BarChart, label: "Relatórios", path: "/reports" },
  { icon: Settings, label: "Configurações", path: "/settings" },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 w-64">
        <nav className="h-full flex flex-col">
          <div className="flex-1 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors ${
                  location.pathname === item.path
                    ? "bg-gray-50 text-primary"
                    : "hover:bg-gray-50 hover:text-primary"
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-4">
        <div className="flex justify-around items-center h-16">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center px-3 py-2 text-xs ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-gray-600"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};