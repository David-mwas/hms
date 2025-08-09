import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const toogleSideBar = () => {
    setIsSideBarOpen((prev) => !prev);
  };
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isSideBarOpen={isSideBarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={title}
          isSideBarOpen={isSideBarOpen}
          toogleSideBar={toogleSideBar}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
