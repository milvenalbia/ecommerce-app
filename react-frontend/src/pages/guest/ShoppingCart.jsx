import { useEffect, useState } from "react";
import { RefreshCw, ShoppingBag, Tag } from "lucide-react";
import { Link } from "react-router";
import Navbar from "../../components/guest/Navbar";
import Carts from "../../components/guest/Carts";
import { useCartStore } from "../../store/cartStore";
import api from "../../api/axios";
import { toast } from "sonner";

const ShoppingCart = () => {
  const {
    fetchCartItems,
    items,
    isLoading,
    removeCartItem,
    updateCartQuantity,
  } = useCartStore();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeCartItem(id);
    } else {
      updateCartQuantity(id, newQuantity);
    }
  };

  const removeItem = async (id) => {
    removeCartItem(id);
  };

  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save20") {
      setAppliedPromo({ code: "SAVE20", discount: 0.2, type: "percentage" });
    } else if (promoCode.toLowerCase() === "free10") {
      setAppliedPromo({ code: "FREE10", discount: 10, type: "fixed" });
    } else {
      alert("Invalid promo code");
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;

  let discount = 0;
  if (appliedPromo) {
    discount =
      appliedPromo.type === "percentage"
        ? subtotal * appliedPromo.discount
        : appliedPromo.discount;
  }

  const total = subtotal + shipping + tax - discount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-40">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="max-w-7xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Shopping Cart
                    </h2>
                    <p className="text-gray-600">
                      {isLoading ? "Loading..." : `${items.length} items`}
                    </p>
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center h-96">
                      <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mr-2" />
                      <span className="text-gray-500">Loading...</span>
                    </div>
                  ) : items.length > 0 ? (
                    <Carts
                      cartItems={items}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                    />
                  ) : (
                    <div className="max-w-4xl mx-auto p-6">
                      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Your cart is empty
                        </h2>
                        <p className="text-gray-600 mb-6">
                          Add some items to get started!
                        </p>
                        <Link
                          to={"/"}
                          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Continue Shopping
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Order Summary
                  </h3>

                  {/* Promo Code */}
                  <div className="mb-6">
                    {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promo Code
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Apply
                      </button>
                    </div> */}

                    {appliedPromo && (
                      <div className="mt-2 flex items-center space-x-1 text-green-600">
                        <Tag className="h-4 w-4" />
                        <span className="text-sm">
                          {appliedPromo.code} applied!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>
                        {isLoading
                          ? "Loading..."
                          : `₱${subtotal.toLocaleString(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>
                        {isLoading
                          ? "Loading..."
                          : shipping === 0
                          ? "Free"
                          : `₱${shipping.toLocaleString(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>
                        {isLoading ? "Loading..." : `₱${tax.toLocaleString(2)}`}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₱{discount.toLocaleString(2)}</span>
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>
                          {isLoading
                            ? "Loading..."
                            : `₱${total.toLocaleString(2)}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Free Shipping Notice */}
                  {shipping > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        Add ₱{(100 - subtotal).toLocaleString(2)} more for free
                        shipping!
                      </p>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors mb-3">
                    Proceed to Checkout
                  </button>

                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    <Link to={"/"}>Continue Shopping</Link>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
