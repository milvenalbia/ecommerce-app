import React from "react";
import DashboardCard from "../../components/admin/DashboardCard";
import { DollarSign, ShoppingCart, Users, Warehouse } from "lucide-react";
import Charts from "../../components/admin/Charts";

const Dashboard = () => {
  return (
    <div className="mb-10">
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-5">
        <DashboardCard
          title={"Total Revenue"}
          icon={<DollarSign size={35} />}
          total={"$100,000"}
          text={"Lorem ipsum dolor sit amet consectetur adipisicing elit."}
        />
        <DashboardCard
          title={"Total Orders"}
          icon={<ShoppingCart size={35} />}
          total={"2000"}
          text={"Lorem ipsum dolor sit amet consectetur adipisicing elit."}
        />
        <DashboardCard
          title={"Total Users"}
          icon={<Users size={35} />}
          total={"5000"}
          text={"Lorem ipsum dolor sit amet consectetur adipisicing elit."}
        />
        <DashboardCard
          title={"Inventory Stocks"}
          icon={<Warehouse size={35} />}
          total={"1000"}
          text={"Lorem ipsum dolor sit amet consectetur adipisicing elit."}
        />
      </div>
      <div className="container h-[500px]">
        <h1 className="text-2xl font-semibold mb-5">Analytics Overview</h1>
        <Charts />
      </div>
    </div>
  );
};

export default Dashboard;
