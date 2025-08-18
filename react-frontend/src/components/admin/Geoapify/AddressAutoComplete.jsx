import React, { useState } from "react";
import {
  GeoapifyContext,
  GeoapifyGeocoderAutocomplete,
} from "@geoapify/react-geocoder-autocomplete";
import "@geoapify/geocoder-autocomplete/styles/minimal.css";

const AddressAutoComplete = ({ onSelect }) => {
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const handleSelect = (value) => {
    if (!value) return;

    // Geoapify returns structured address data
    setAddress(value.properties.formatted);
    setCity(value.properties.city || value.properties.state || "");
    setPostalCode(value.properties.postcode || "");

    console.log(value);
    // Send the structured data back to parent (form)
    onSelect({
      address: value.properties.formatted,
      city: value.properties.city || value.properties.county || "",
      postal_code: value.properties.postcode || "",
    });
  };

  const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

  return (
    <div>
      <label className="block font-semibold mb-1">Shipping Address</label>
      <GeoapifyContext apiKey={GEOAPIFY_KEY}>
        <GeoapifyGeocoderAutocomplete
          placeholder="Enter address here"
          type={"locality"}
          placeSelect={handleSelect}
          debounceDelay={500}
        />
      </GeoapifyContext>

      {/* Preview fields */}
      <div className="mt-3 text-sm text-gray-700">
        <p>
          <strong>Address:</strong> {address}
        </p>
        <p>
          <strong>City:</strong> {city}
        </p>
        <p>
          <strong>Postal Code:</strong> {postalCode}
        </p>
      </div>
    </div>
  );
};

export default AddressAutoComplete;
