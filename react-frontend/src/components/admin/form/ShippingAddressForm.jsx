import { useState } from "react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import api from "../../../api/axios";
import AddressAutoComplete from "../Geoapify/AddressAutoComplete";
import PhoneNumberField from "./PhoneNumberField";
import { setError } from "../../../redux/slices/error";
import { useAuthStore } from "../../../store/authStore";

const ShippingAddressForm = () => {
  const [shippingData, setShippingData] = useState({
    address: "",
    city: "",
    postal_code: "",
  });
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("");
  const { error } = useSelector((state) => state.error);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateShippingAddress } = useAuthStore();
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      const formData = {
        address: shippingData.address,
        city: shippingData.city,
        postal_code: shippingData.postal_code,
        phone_number: phone,
      };
      const res = await api.post("/api/shipping-address", formData);

      const { address: newAddress } = res.data; // destructure the nested address object

      updateShippingAddress(newAddress);

      console.log("Updated user:", useAuthStore.getState().user);

      setShippingData({
        address: "",
        city: "",
        postal_code: "",
      });

      setPhone(null);
      toast.success("Address saved!");
    } catch (error) {
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
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PhoneNumberField value={phone} onChange={setPhone} />
      {error.phone_number && (
        <p className="error -mt-2">{error.phone_number[0]}</p>
      )}
      <AddressAutoComplete onSelect={setShippingData} />
      {error.address && <p className="error -mt-2">{error.address[0]}</p>}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 transition-all text-white rounded-lg cursor-pointer"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
};

export default ShippingAddressForm;
