import React from "react";
import DataTable from "../../components/admin/DataTable";

const Product = () => {
  const handleRowClick = (row) => {
    console.log("Row clicked:", row);
  };

  const handleEdit = (row) => {
    console.log("Edit user:", row);
    // Navigate to edit page or open modal
    // Example: navigate(`/users/${row.id}/edit`);
  };

  const handleDelete = (row) => {
    console.log("Delete user:", row);
    // Call API to delete user
    // Example: deleteUser(row.id);
  };

  const handleView = (row) => {
    console.log("View user:", row);
    // Navigate to view page
    // Example: navigate(`/users/${row.id}`);
  };

  const handleChangeRole = (row) => {
    console.log("Change role for user:", row);
    // Open role change modal
  };

  const customActions = [
    {
      label: "View Details",
      icon: ({ className }) => (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      onClick: handleView,
    },
    {
      label: "Change Role",
      icon: ({ className }) => (
        <svg
          className={className}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      onClick: handleChangeRole,
    },
  ];

  const columns = [
    { key: "id", title: "ID", sortable: true, width: "w-16" },
    { key: "name", title: "Name", sortable: true, width: "w-48" },
    { key: "description", title: "Description", sortable: true, width: "w-64" },
    {
      key: "price",
      title: "Price",
      sortable: true,
      width: "w-32",
      render: (value) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "PHP", // Change to PHP if needed
          minimumFractionDigits: 2,
        }).format(value),
    },
    { key: "stock_quantity", title: "Stocks", sortable: true, width: "w-32" },
    {
      key: "category",
      title: "Category",
      sortable: true,
      width: "w-32",
      render: (value) => value.name,
    },
    {
      key: "is_active",
      title: "Status",
      sortable: true,
      width: "w-24",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 1
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Active" : "In Active"}
        </span>
      ),
    },
    {
      key: "created_at",
      title: "Created",
      sortable: true,
      width: "w-32",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="mb-10">
      <div className="container">
        <DataTable
          title="Product Management"
          apiEndpoint="/api/products"
          columns={columns}
          onRowClick={handleRowClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
          customActions={false}
          showDateFilter={true}
          showSearch={true}
          showPagination={true}
          showPerPage={true}
          showActions={true}
          defaultPerPage={5}
        />
      </div>
    </div>
  );
};

export default Product;
