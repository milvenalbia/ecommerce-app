import { useState } from "react";

export default function PhoneNumberField({ value, onChange }) {
  const [phone, setPhone] = useState(value || "");

  const formatPHNumber = (input) => {
    // Remove all non-digits
    let digits = input.replace(/\D/g, "");

    // Remove leading 0 or 63 to normalize
    if (digits.startsWith("0")) digits = digits.slice(1);
    if (digits.startsWith("63")) digits = digits.slice(2);

    // Limit to max 10 digits (standard PH mobile)
    digits = digits.slice(0, 10);

    // Format as 9XX XXX XXXX
    if (digits.length <= 3) return `${digits}`;
    if (digits.length <= 6) return `${digits.slice(0, 3)}${digits.slice(3)}`;
    return `${digits.slice(0, 3)}${digits.slice(3, 6)}${digits.slice(6)}`;
  };

  const handleChange = (e) => {
    const formatted = formatPHNumber(e.target.value);
    setPhone(formatted);
    onChange && onChange(`+63${formatted}`); // pass value back to parent form
  };

  return (
    <div className="flex flex-col">
      <label className="mb-1 font-semibold">Phone Number</label>
      <input
        type="tel"
        value={phone}
        onChange={handleChange}
        placeholder="09XX XXX XXXX"
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
