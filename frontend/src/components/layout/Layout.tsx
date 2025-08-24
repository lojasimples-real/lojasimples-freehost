import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-32">
        <Header />
        <main className="flex-1 pt-4 mt-4 overflow-hidden pb-20 md:pb-8">
          <div className="px-3 py-3 pr-2 pl-2 md:p-3">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;