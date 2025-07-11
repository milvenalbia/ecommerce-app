import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import DataTable from "../../components/admin/DataTable";
import { useDispatch, useSelector } from "react-redux";
import GroupField from "../../components/admin/form/GroupField";
import api from "../../api/axios";
import { setError } from "../../redux/slices/error";
import { toast } from "sonner";
import FormModal from "../../components/admin/FormModal";

const Product = () => {
  const dispatch = useDispatch();
  const dataTableRef = useRef();
  const { error } = useSelector((state) => state.error);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [productId, setProductId] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    stock_quantity: 1,
    category_id: 0,
    image_url: "",
  });

  const fetchCategory = async () => {
    try {
      const res = await api.get("/api/categories");

      const data = res.data;

      setCategories(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleAddModal = () => {
    setIsEdit(false);
    setIsOpen(true);
  };

  const handleEdit = (row) => {
    setIsEdit(true);

    setProductId(row.id);
    setFormData({
      name: row.name,
      description: row.description,
      price: row.price,
      stock_quantity: row.stock_quantity,
      category_id: row.category_id,
      image_url: row.image_url,
    });

    setIsOpen(true);
  };

  const handleDelete = async (row) => {
    try {
      const res = await api.delete(`/api/products/${row.id}`);

      const data = res.data;

      if (data) {
        toast.success(data.message || "Deleted successfully.");
        dataTableRef.current?.fetchData();
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 422 && data.errors) {
          toast.error(
            data.message || "Something went wrong in deleting the product"
          );
        } else if (status === 429) {
          const message =
            `${data.message} Try again in a moment.` || "Too many requests.";
          toast.error(message);
        } else {
          toast.error(data.message || "Something went wrong.");
        }
      } else {
        toast.error(data.message || "Network error or server not responding.");
      }
    }
  };

  const handleView = (row) => {
    console.log("View user:", row);
    // Navigate to view page
    // Example: navigate(`/users/${row.id}`);
  };

  const toggleStatus = async (row) => {
    try {
      const res = await api.put(`/api/products/status/${row.id}`);

      const data = res.data;

      if (data) {
        toast.success(data.message || "Status updated.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await (isEdit
        ? api.put(`/api/products/${productId}`, formData)
        : api.post("/api/products", formData));

      const data = res.data;

      if (data) {
        setIsSubmitting(false);
        toast.success(data.message);
        dataTableRef.current?.fetchData();
        setIsOpen(false);
        setFormData({
          name: "",
          description: "",
          price: 0,
          stock_quantity: 1,
          category_id: 0,
          image_url: "",
        });
        if (isEdit) {
          setProductId(0);
        }
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
    if (isEdit) {
      setProductId(0);
      setIsEdit(false);
    }

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
      sortable: false,
      width: "w-[15%]",
      render: (value) => {
        const maxLength = 16;
        const display =
          value?.length > maxLength ? value.slice(0, maxLength) + "..." : value;

        return (
          <span className="px-2 py-1 rounded-full text-sm font-medium text-wrap">
            {display}
          </span>
        );
      },
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
      render: (value, row) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            defaultChecked={value}
            onChange={() => toggleStatus(row)}
          />
          <div className="group peer bg-white rounded-full duration-300 w-14 h-6 ring-2 ring-red-500 peer-checked:ring-green-500 after:duration-300 after:bg-red-500 peer-checked:after:bg-green-500 after:rounded-full after:absolute after:h-4 after:w-4 after:top-1 after:left-1 after:flex after:justify-center after:items-center peer-checked:after:translate-x-8 peer-hover:after:scale-95"></div>
          <span className="peer-checked:hidden ml-2 text-sm font-medium text-gray-700">
            Inactive
          </span>
          <span className="peer-checked:inline hidden ml-2 text-sm font-medium text-gray-700">
            Active
          </span>
        </label>
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
          ref={dataTableRef}
        />

        {isOpen && (
          <FormModal closeModal={closeModal} isEdit={isEdit} title={"Product"}>
            <form onSubmit={handleSubmit}>
              <GroupField
                label={"Product Name"}
                labelFor={"name"}
                name={"name"}
                placeholder={"Enter product name"}
                value={formData.name}
                onChange={handleChange}
              />
              {error.name && <span className="error">{error.name[0]}</span>}
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
                {error.price && <span className="error">{error.price[0]}</span>}
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
                <Select
                  id="category"
                  name="category_id"
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                  }))}
                  className="text-sm"
                  classNamePrefix="react-select"
                  placeholder="Search or select category"
                  value={
                    categories.find((cat) => cat.id === formData.category_id)
                      ? {
                          value: formData.category_id,
                          label: categories.find(
                            (cat) => cat.id === formData.category_id
                          ).name,
                        }
                      : null
                  }
                  onChange={(selected) =>
                    setFormData((prev) => ({
                      ...prev,
                      category_id: selected ? selected.value : 0,
                    }))
                  }
                  isClearable
                />
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
                    ? isEdit
                      ? "Updating ..."
                      : "Creating ..."
                    : isEdit
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            </form>
          </FormModal>
        )}
      </div>
    </div>
  );
};

export default Product;
