import { useRef, useState } from "react";
import {
  Package,
  Truck,
  MapPin,
  CreditCard,
  Calendar,
  CheckCircle,
} from "lucide-react";
import DataTable from "../../components/admin/DataTable";
import api from "../../api/axios";
import { toast } from "sonner";
import Modal from "../../components/guest/Modal";
import SmallLoading from "../../components/SmallLoading";

const Orders = () => {
  const dataTableRef = useRef();

  const [orderData, setOrderData] = useState(null);
  const [view, setView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const closeModal = () => {
    setView(false);
    setOrderData(null);
  };

  const handleView = async (row) => {
    setView(true);
    setIsLoading(true);

    try {
      const res = await api.get(`/api/orders/${row.id}`);

      const data = res.data;

      console.log(data);
      if (data) {
        setOrderData(data);
      }
    } catch (error) {
      console.log("Error: ", error);
    }

    setIsLoading(false);
  };

  const subtotal = orderData?.total_amount / 1.08;
  const shipping = orderData?.total_amount > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;

  const total = subtotal + shipping + tax;

  const columns = [
    { key: "id", hidden: true },
    {
      key: "index",
      title: "No.",
      sortable: false,
      width: "w-[10%]",
      render: (value, row, index) => {
        return <span className="ml-5">{index + 1}</span>;
      },
    },
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

      {view && (
        <Modal
          title={"Order Details"}
          closeModal={closeModal}
          classname={"max-w-4xl overflow-y-auto"}
        >
          {isLoading ? (
            <SmallLoading />
          ) : (
            <div className="max-w-4xl mx-auto p-5 bg-gray-50">
              {/* Order Status Timeline */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Ordered: {new Date(orderData.created_at).toDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      Est. Delivery: August 20, 2025
                    </span>
                  </div>
                </div>
                {orderData.trackingNumber && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      <Package className="w-4 h-4 inline mr-1" />
                      Tracking Number:
                      <span className="font-mono">1Z999AA1234567890</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Order Items
                    </h2>
                    <div className="space-y-4">
                      {orderData.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg"
                        >
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              ${item.price_at_purchase}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary Sidebar */}
                <div className="space-y-6">
                  {/* Pricing Summary */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Order Summary
                    </h2>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">
                          ${subtotal.toLocaleString(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-900">
                          {shipping > 0
                            ? `$${shipping.toLocaleString(2)}`
                            : "free"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">
                          ${tax.toLocaleString(2)}
                        </span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="text-base font-semibold text-gray-900">
                            Total
                          </span>
                          <span className="text-base font-semibold text-gray-900">
                            ${total.toLocaleString(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                      Shipping Address
                    </h2>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-900">
                        {orderData.user.name}
                      </p>
                      <p>
                        {orderData.user.shipping_addresses.address ?? "n/a"}
                      </p>
                      <p>
                        {orderData.user.shipping_addresses.city ?? "n/a"},{" "}
                        {orderData.user.shipping_addresses.postal_code ?? "n/a"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Orders;
