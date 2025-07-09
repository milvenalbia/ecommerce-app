import React from "react";
import { Outlet } from "react-router";
import Sidebar from "./admin/Sidebar";
import Header from "./admin/Header";

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex flex-col w-full max-w-[calc(100%-280px)] py-3 px-5">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
