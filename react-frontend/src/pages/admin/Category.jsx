import { useRef, useState } from "react";
import DataTable from "../../components/admin/DataTable";
import { useDispatch, useSelector } from "react-redux";
import GroupField from "../../components/admin/form/GroupField";
import api from "../../api/axios";
import { setError } from "../../redux/slices/error";
import { toast } from "sonner";
import FormModal from "../../components/admin/FormModal";

const Category = () => {
  const dispatch = useDispatch();
  const dataTableRef = useRef();
  const { error } = useSelector((state) => state.error);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [categoryId, setCategoryId] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleAddModal = () => {
    setIsEdit(false);
    setIsOpen(true);
  };

  const handleEdit = (row) => {
    setIsEdit(true);

    setCategoryId(row.id);
    setFormData({
      name: row.name,
      description: row.description,
    });

    setIsOpen(true);
  };

  //   const handleDelete = async (row) => {
  //     try {
  //       const res = await api.delete(`/api/categories/${row.id}`);

  //       const data = res.data;

  //       if (data) {
  //         toast.success(data.message || "Deleted successfully.");
  //         dataTableRef.current?.fetchData();
  //       }
  //     } catch (error) {
  //       if (error.response) {
  //         const { status, data } = error.response;

  //         if (status === 422 && data.errors) {
  //           toast.error(
  //             data.message || "Something went wrong in deleting the category"
  //           );
  //         } else if (status === 429) {
  //           const message =
  //             `${data.message} Try again in a moment.` || "Too many requests.";
  //           toast.error(message);
  //         } else {
  //           toast.error(data.message || "Something went wrong.");
  //         }
  //       } else {
  //         toast.error(data.message || "Network error or server not responding.");
  //       }
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const res = await (isEdit
        ? api.put(`/api/categories/${categoryId}`, formData)
        : api.post("/api/categories", formData));

      const data = res.data;

      if (data) {
        setIsSubmitting(false);
        toast.success(data.message);
        dataTableRef.current?.fetchData();
        setIsOpen(false);
        setFormData({
          name: "",
          description: "",
        });
        if (isEdit) {
          setCategoryId(0);
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
      setCategoryId(0);
      setIsEdit(false);
    }

    dispatch(setError({}));
    setFormData({
      name: "",
      description: "",
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

  //   const customActions = [
  //     {
  //       label: "View Details",
  //       icon: ({ className }) => (
  //         <svg
  //           className={className}
  //           fill="none"
  //           stroke="currentColor"
  //           viewBox="0 0 24 24"
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             strokeWidth={2}
  //             d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  //           />
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             strokeWidth={2}
  //             d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
  //           />
  //         </svg>
  //       ),
  //       onClick: handleView,
  //     },
  //     {
  //       label: "Change Role",
  //       icon: ({ className }) => (
  //         <svg
  //           className={className}
  //           fill="none"
  //           stroke="currentColor"
  //           viewBox="0 0 24 24"
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             strokeWidth={2}
  //             d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
  //           />
  //         </svg>
  //       ),
  //       // onClick: handleChangeRole,
  //     },
  //   ];

  const columns = [
    { key: "id", title: "ID", sortable: true, width: "w-[10%]" },
    { key: "name", title: "Name", sortable: true, width: "w-[15%]" },
    {
      key: "description",
      title: "Description",
      sortable: false,
      width: "w-[50%]",
      render: (value) => {
        const maxLength = 70;
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
          title="Category Management"
          apiEndpoint="/api/categories"
          columns={columns}
          onEdit={handleEdit}
          customActions={false}
          showDateFilter={true}
          showSearch={true}
          showPagination={true}
          showPerPage={true}
          showActions={true}
          defaultPerPage={5}
          addButton={"Add Category"}
          onAdd={handleAddModal}
          ref={dataTableRef}
        />

        {isOpen && (
          <FormModal closeModal={closeModal} isEdit={isEdit} title={"Category"}>
            <form onSubmit={handleSubmit}>
              <GroupField
                label={"Category Name"}
                labelFor={"name"}
                name={"name"}
                placeholder={"Enter category name"}
                value={formData.name}
                onChange={handleChange}
              />
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
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </FormModal>
        )}
      </div>
    </div>
  );
};

export default Category;
