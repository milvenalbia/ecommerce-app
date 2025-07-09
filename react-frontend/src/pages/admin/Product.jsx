import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import { useDispatch, useSelector } from "react-redux";
import GroupField from "../../components/admin/form/GroupField";
import api from "../../api/axios";
import { setError } from "../../redux/slices/error";
import { toast } from "sonner";

const Product = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.error);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock_quantity: 1,
    category_id: 0,
    image_url: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategory = async () => {
    try {
      const res = await api.get("/api/categories");

      const data = res.data;

      setCategories(data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleAddModal = () => {
    setIsOpen(true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await api.post("/api/products", formData);

      const data = res.data;

      if (data) {
        setIsSubmitting(false);
        toast.success(data.message);
        setIsOpen(false);
        setFormData({
          name: "",
          description: "",
          price: 0,
          stock_quantity: 1,
          category_id: 0,
          image_url: "",
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      if (error.response) {
        const { status, data } = error.response;

        if (status === 422 && data.errors) {
          dispatch(setError(data.errors || data.message));
        } else if (status === 429) {
          const message =
            `${data.message} Try again in a moment.` || "Too many requests.";
          toast.error(message);
        } else {
          toast.error(data.message || "Something went wrong.");
        }
      } else {
        toast.error("Network error or server not responding.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);

    dispatch(setError({}));
    setFormData({
      name: "",
      description: "",
      price: 0,
      stock_quantity: 1,
      category_id: 0,
      image_url: "",
    });
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      // onClick: handleChangeRole,
    },
  ];

  const columns = [
    { key: "id", title: "ID", sortable: true, width: "w-[10%]" },
    { key: "name", title: "Name", sortable: true, width: "w-[15%]" },
    {
      key: "description",
      title: "Description",
      sortable: true,
      width: "w-[15%]",
    },
    {
      key: "price",
      title: "Price",
      sortable: true,
      width: "w-[10%]",
      render: (value) =>
        new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "PHP", // Change to PHP if needed
          minimumFractionDigits: 2,
        }).format(value),
    },
    {
      key: "stock_quantity",
      title: "Stocks",
      sortable: true,
      width: "w-[10%]",
    },
    {
      key: "category",
      title: "Category",
      sortable: true,
      width: "w-[10%]",
      render: (value) => value.name,
    },
    {
      key: "is_active",
      title: "Status",
      sortable: true,
      width: "w-[10%]",
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
      width: "w-[10%]",
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
          onEdit={handleEdit}
          onDelete={handleDelete}
          customActions={false}
          showDateFilter={true}
          showSearch={true}
          showPagination={true}
          showPerPage={true}
          showActions={true}
          defaultPerPage={5}
          addButton={"Add Product"}
          onAdd={handleAddModal}
        />

        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 h-screen">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={closeModal}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md mx-4 animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 border border-white/20">
              {/* Decorative gradient border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-purple-500 rounded-3xl blur opacity-30"></div>

              <div className="relative bg-white rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-semibold">Add Product</h1>
                  </div>

                  <button
                    onClick={closeModal}
                    className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200 group"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  <form onSubmit={handleSubmit}>
                    <GroupField
                      label={"Product Name"}
                      labelFor={"name"}
                      name={"name"}
                      placeholder={"Enter product name"}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {error.name && (
                      <span className="error">{error.name[0]}</span>
                    )}
                    <div className="flex items-center gap-2">
                      <GroupField
                        label={"Price"}
                        labelFor={"price"}
                        type="number"
                        min={1}
                        max={999999999}
                        className={"w-full"}
                        name={"price"}
                        value={formData.price}
                        onChange={handleChange}
                      />
                      {error.price && (
                        <span className="error">{error.price[0]}</span>
                      )}
                      <GroupField
                        label={"Quantity"}
                        labelFor={"quantity"}
                        type="number"
                        min={1}
                        max={999999999}
                        name={"stock_quantity"}
                        value={formData.stock_quantity}
                        onChange={handleChange}
                        className={"w-full"}
                      />
                      {error.stock_quantity && (
                        <span className="error">{error.stock_quantity[0]}</span>
                      )}
                    </div>
                    <GroupField
                      label={"Image Url"}
                      labelFor={"image"}
                      name={"image_url"}
                      placeholder={"Enter product image url/address"}
                      value={formData.image_url}
                      onChange={handleChange}
                    />
                    {error.image_url && (
                      <span className="error">{error.image_url[0]}</span>
                    )}
                    <div className="flex flex-col gap-2 mt-4 w-full">
                      <label htmlFor="category">Product Category</label>
                      <select
                        id="category"
                        name="category_id"
                        className="input-field-1"
                        value={formData.category_id}
                        onChange={inputChange}
                      >
                        <option value={0}>Select product category</option>
                        {categories &&
                          categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                      </select>
                      {error.category_id && (
                        <span className="error">{error.category_id[0]}</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 mt-4 w-full">
                      <label htmlFor="description">Description</label>
                      <textarea
                        rows={4}
                        id="description"
                        name="description"
                        className="input-field-1"
                        value={formData.description}
                        onChange={inputChange}
                      />
                      {error.description && (
                        <span className="error">{error.description[0]}</span>
                      )}
                    </div>

                    <div className="mt-4 flex justify-end items-center">
                      <button className="primary-btn py-3 px-4 rounded-md">
                        {isSubmitting
                          ? "Creating Product ..."
                          : "Create Product"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Product;
