import React, { useRef, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import api from "../../api/axios";
import { toast } from "sonner";

const Payment = () => {
  const dataTableRef = useRef();

  const [loadingRowId, setLoadingRowId] = useState(null);
  //   const handleStatus = async (e, rowId) => {
  //     const status = e.target.value;
  //     setLoadingRowId(rowId); // set the specific row to "loading"

  //     try {
  //       const res = await api.put(`/api/orders/status/${rowId}`, { status });
  //       const data = res.data;

  //       if (data) {
  //         await dataTableRef.current?.fetchData({ status: true });
  //         toast.success(data.message || "Status updated.");
  //       }
  //     } catch (error) {
  //       if (error.response) {
  //         const { status, data } = error.response;
  //         if (status === 422 && data.errors) {
  //           toast.error(data.message || "Cannot update status.");
  //         } else if (status === 429) {
  //           toast.error(data.error || "Too many attempts.");
  //         } else {
  //           toast.error("Something went wrong");
  //         }
  //       } else {
  //         toast.error("Network error or server not responding.");
  //       }
  //     } finally {
  //       setLoadingRowId(null); // clear loading state
  //     }
  //   };

  const handleView = (row) => {
    console.log("handle view clicked", row.id);
  };

  const columns = [
    { key: "id", title: "ID", sortable: true, width: "w-[10%]" },
    {
      key: "order",
      title: "Name",
      sortable: true,
      width: "w-[15%]",
      render: (value) => value.user.name,
    },
    {
      key: "order",
      title: "Email",
      sortable: false,
      width: "w-[15%]",
      render: (value) => value.user.email,
    },
    {
      key: "payment_method",
      title: "Method",
      sortable: true,
      width: "w-[10%]",
      render: (value, row) => {
        return <span className="capitalize text-sm">{value}</span>;
      },
    },
    {
      key: "amount",
      title: "Amount",
      sortable: true,
      width: "w-[10%]",
      render: (value) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD", // Change to PHP if needed
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
            case "failed":
              return "bg-red-100 text-red-800 border-red-300";
            default:
              return "bg-gray-100 text-gray-800 border-gray-300";
          }
        };

        const isRowLoading = row.id === loadingRowId;

        return (
          <span
            className={`w-full px-2 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium ${getStatusColor(
              value || ""
            )}`}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: "payment_date",
      title: "Payment Date",
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
          apiEndpoint="/api/payments"
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

export default Payment;
