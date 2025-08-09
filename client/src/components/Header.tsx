import { LogOut, MenuIcon, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface HeaderProps {
  title: string;
  isSideBarOpen: boolean;
  toogleSideBar: () => void;
}

const Header = ({ title, isSideBarOpen, toogleSideBar }: HeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
        </div>

        <div className="flex items-center space-x-4">
          {/* <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div> */}

          {/* Notifications */}
          {/* <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button> */}

          {/* User Menu */}
          <div className="flex items-center space-x-3 md:space-x-8">
            <div className="flex items-center space-x-3">
              {user?.avatar ? (
                <img
                  src={
                    user?.avatar ||
                    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1"
                  }
                  alt={user?.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <p className="h-8 w-8 rounded-full bg-gray-400 text-white text-center flex justify-center items-center font-semibold">
                  {user?.name.slice(0, 2)}
                </p>
              )}
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
              </div>
            </div>

            <button className="text-gray-600 md:hidden" onClick={toogleSideBar}>
              {isSideBarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={logout}
              className="p-1 px-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center text-center gap-2 border border-gray-400 text-gray-600"
              title="Logout"
            >
              <span>Logout</span> <LogOut className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
