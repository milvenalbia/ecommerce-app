import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import api from "../../api/axios";
import { toast } from "sonner";

const CheckoutForm = ({ setIsOpen }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/",
      },
      redirect: "if_required",
    });

    if (result.error) {
      toast.error(result.error.message);
    } else if (
      result.paymentIntent &&
      result.paymentIntent.status === "succeeded"
    ) {
      const { paymentIntent } = result;

      try {
        // Save order to backend
        await api.post("/api/payments", {
          payment_intent_id: paymentIntent.id,
          amount: paymentIntent.amount,
          payment_method_id: paymentIntent.payment_method,
        });

        toast.success("Payment successful! Thank you for your order.");
      } catch (error) {
        console.error("Failed to store order:", error);
        toast.error("Payment succeeded but order storage failed.");
      }
    }

    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        className="primary-btn w-full mt-3 py-2 px-3 rounded"
        type="submit"
        disabled={!stripe || !elements || isLoading}
      >
        {isLoading ? "Processing..." : "Submit Payment"}
      </button>
    </form>
  );
};

export default CheckoutForm;
