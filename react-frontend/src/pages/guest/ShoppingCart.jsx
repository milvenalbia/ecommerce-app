import { useEffect, useRef, useState } from "react";
import { ShoppingBag, Tag } from "lucide-react";
import { Link } from "react-router";
import { CheckoutProvider, Elements } from "@stripe/react-stripe-js";
import Navbar from "../../components/guest/Navbar";
import Carts from "../../components/guest/Carts";
import SmallLoading from "../../components/SmallLoading";
import { useCartStore } from "../../store/cartStore";
import Modal from "../../components/guest/Modal";
import CheckoutForm from "../../components/guest/CheckoutForm";
import stripePromise from "../../utils/stripe";
import api from "../../api/axios";

const ShoppingCart = () => {
  const {
    fetchCartItems,
    items,
    setItems,
    isLoading,
    removeCartItem,
    updateCartQuantity,
  } = useCartStore();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [debounceQuantity, setDebounceQuantity] = useState();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  // const updateQuantity = (id, newQuantity) => {
  //   if (newQuantity <= 0) {
  //     removeCartItem(id);
  //   } else {
  //     updateCartQuantity(id, newQuantity);
  //   }
  // };

  const debounceTimers = useRef({});

  const options = {
    clientSecret,
  };

  const updateQuantity = (id, newQuantity) => {
    // Instantly update the UI
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );

    // Clear previous timer
    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }

    // Set new debounce timer
    debounceTimers.current[id] = setTimeout(() => {
      if (newQuantity <= 0) {
        removeCartItem(id);
      } else {
        updateCartQuantity(id, newQuantity);
      }
      delete debounceTimers.current[id];
    }, 500);
  };

  const closeModal = () => {
    setIsOpen(false);
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
  const shipping = items.length > 0 ? (subtotal > 100 ? 0 : 9.99) : 0.0;
  const tax = subtotal * 0.08;

  let discount = 0;
  if (appliedPromo) {
    discount =
      appliedPromo.type === "percentage"
        ? subtotal * appliedPromo.discount
        : appliedPromo.discount;
  }

  const total = subtotal + shipping + tax - discount;

  const handleOpenModal = async () => {
    setLoading(true);
    try {
      await api
        .post("api/create-payment-intent", { amount: total })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
          setIsOpen(true);
        })
        .catch((error) => {
          console.error("Failed to create payment intent:", error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                    <SmallLoading height={"h-96"} />
                  ) : items.length > 0 ? (
                    <Carts
                      cartItems={items}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                    />
                  ) : (
                    <div className="max-w-4xl mx-auto p-6">
                      <div className="bg-white rounded-2xl p-8 text-center">
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
                          : `$${subtotal.toLocaleString(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>
                        {isLoading
                          ? "Loading..."
                          : shipping === 0
                          ? "Free"
                          : `$${shipping.toLocaleString(2)}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span>
                        {isLoading ? "Loading..." : `$${tax.toLocaleString(2)}`}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${discount.toLocaleString(2)}</span>
                      </div>
                    )}

                    <div className="border-t pt-3">
                      <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>
                          {isLoading
                            ? "Loading..."
                            : `$${total.toLocaleString(2)}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Free Shipping Notice */}
                  {shipping > 0 && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        Add ${(100 - subtotal).toLocaleString(2)} more for free
                        shipping!
                      </p>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <button
                    onClick={handleOpenModal}
                    disabled={loading || total < 1}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors mb-3
                    ${
                      loading || total < 1
                        ? "bg-purple-400 cursor-not-allowed text-gray-200"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                  >
                    {loading ? "Processing..." : "Proceed to Checkout"}
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

      {isOpen && clientSecret && (
        <Modal title={"Checkout Form"} closeModal={closeModal}>
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm setIsOpen={setIsOpen} />
          </Elements>
        </Modal>
      )}
    </>
  );
};

export default ShoppingCart;
