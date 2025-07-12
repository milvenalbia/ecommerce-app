import React, { useRef, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import api from "../../api/axios";
import { toast } from "sonner";

const Orders = () => {
  const dataTableRef = useRef();

  const [loadingRowId, setLoadingRowId] = useState(null);
  const handleStatus = async (e, rowId) => {
    const status = e.target.value;
    setLoadingRowId(rowId); // set the specific row to "loading"

    try {
      const res = await api.put(`/api/orders/status/${rowId}`, { status });
      const data = res.data;

      if (data) {
        await dataTableRef.current?.fetchData({ status: true });
        toast.success(data.message || "Status updated.");
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 422 && data.errors) {
          toast.error(data.message || "Cannot update status.");
        } else if (status === 429) {
          toast.error(data.error || "Too many attempts.");
        } else {
          toast.error("Something went wrong");
        }
      } else {
        toast.error("Network error or server not responding.");
      }
    } finally {
      setLoadingRowId(null); // clear loading state
    }
  };

  const handleView = (row) => {
    console.log("handle view clicked", row.id);
  };

  const columns = [
    { key: "id", title: "ID", sortable: true, width: "w-[10%]" },
    {
      key: "user",
      title: "Name",
      sortable: true,
      width: "w-[15%]",
      render: (value) => value.name,
    },
    {
      key: "user",
      title: "Email",
      sortable: false,
      width: "w-[20%]",
      render: (value) => value.email,
    },
    {
      key: "total_amount",
      title: "Total Amount",
      sortable: true,
      width: "w-[15%]",
      render: (value) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "PHP", // Change to USD if needed
          minimumFractionDigits: 2,
        }).format(value),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      width: "w-[10%]",
      render: (value, row) => {
        const getStatusColor = (status) => {
          switch (status) {
            case "pending":
              return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "paid":
              return "bg-blue-100 text-blue-800 border-blue-300";
            case "shipped":
              return "bg-purple-100 text-purple-800 border-purple-300";
            case "delivered":
              return "bg-green-100 text-green-800 border-green-300";
            case "cancelled":
              return "bg-red-100 text-red-800 border-red-300";
            default:
              return "bg-gray-100 text-gray-800 border-gray-300";
          }
        };

        const isRowLoading = row.id === loadingRowId;

        return (
          <select
            value={value || ""}
            onChange={(e) => handleStatus(e, row.id)}
            disabled={isRowLoading}
            className={`w-full px-1 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium ${getStatusColor(
              value || ""
            )}`}
          >
            <option value="pending">{isRowLoading ? "..." : "Pending"}</option>
            <option value="paid">{isRowLoading ? "..." : "Paid"}</option>
            <option value="shipped">{isRowLoading ? "..." : "Shipped"}</option>
            <option value="delivered">
              {isRowLoading ? "..." : "Delivered"}
            </option>
            <option value="cancelled">
              {isRowLoading ? "..." : "Cancelled"}
            </option>
          </select>
        );
      },
    },
    {
      key: "created_at",
      title: "Created",
      sortable: true,
      width: "w-[15%]",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="mb-10">
      <div className="container">
        <DataTable
          title="Order Management"
          apiEndpoint="/api/orders"
          columns={columns}
          customActions={false}
          showDateFilter={true}
          showSearch={true}
          showPagination={true}
          showPerPage={true}
          showActions={true}
          onView={handleView}
          defaultPerPage={5}
          ref={dataTableRef}
        />
      </div>
    </div>
  );
};

export default Orders;
