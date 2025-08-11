import { ChevronDown, Filter, RefreshCw } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { toast } from "sonner";
import SmallLoading from "../SmallLoading";

const FilterBar = ({
  isFilterOpen = false,
  setIsFilterOpen,
  handleByCategory,
  handlePriceRange,
}) => {
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [loading, setLoading] = useState(false);

  const fetctCategory = async (controller) => {
    setLoading(true);
    try {
      const res = await api.get("api/categories/filters", {
        signal: controller.signal,
      });

      const data = res.data;

      if (data) {
        setCategories(data);
      }
    } catch (error) {
      if (error.name === "CanceledError") {
        console.log("Fetching filter data cancelled!");
        return;
      } else {
        toast.error("Cannot fetch category.");
      }
    }

    setLoading(false);
  };

  const handleInputChange = (type, value) => {
    // Remove non-numeric characters and convert to number
    const numericValue = parseInt(value.replace(/[^0-9]/g, "")) || 0;

    let [min, max] = priceRange;

    if (type === "min") {
      min = Math.min(numericValue);
    } else {
      max = Math.max(numericValue);
    }

    if (min && max) {
      if (min > max) {
        min = Math.min(numericValue, max - 1);
      }

      if (max < min) {
        max = Math.min(numericValue, min + 1);
      }
    }

    const newRange = [min, max];
    setPriceRange(newRange);
    handlePriceRange(newRange); // call parent filter handler
  };

  // Format number with commas for display
  const formatDisplayValue = (value) => {
    return value.toLocaleString();
  };

  useEffect(() => {
    const controller = new AbortController();
    fetctCategory(controller);

    return () => controller.abort();
  }, []);
  return (
    <div
      className={`w-full lg:w-64 space-y-6 ${
        isFilterOpen ? "block" : "hidden lg:block"
      } lg:sticky lg:top-24 lg:h-fit`}
    >
      <div className="bg-white p-4 rounded-lg shadow-sm lg:shadow-none lg:bg-transparent lg:p-0">
        <div className="flex items-center justify-between mb-4 lg:mb-0">
          <h3 className="text-lg font-medium text-gray-900">Filter</h3>
          <button className="lg:hidden" onClick={() => setIsFilterOpen(false)}>
            <span className="text-gray-500">×</span>
          </button>
        </div>

        <div className="flex justify-between items-center mb-4 lg:mb-6">
          <span className="text-sm text-gray-600">Advanced</span>
          <Filter className="w-4 h-4 text-gray-400" />
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h4 className="font-medium text-lg text-gray-900 mb-3">Category</h4>
          <div className="space-y-2">
            {categories.length > 0
              ? categories.map((cat) => (
                  <div key={cat.id} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      id={cat.id}
                      value={cat.id}
                      onChange={() => handleByCategory("category", cat.id)}
                    />
                    <label htmlFor={cat.id} className="text-[16px]">
                      {cat.name}
                    </label>
                  </div>
                ))
              : loading && <SmallLoading />}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-medium text-lg text-gray-900 mb-3">Price</h4>
          <div className="space-y-3">
            {/* Price Range Inputs */}
            <div className="flex items-center space-x-3">
              {/* Min Price Input */}
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">
                  Min Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₱
                  </span>
                  <input
                    type="text"
                    value={formatDisplayValue(priceRange[0])}
                    onChange={(e) => handleInputChange("min", e.target.value)}
                    disabled={priceRange[1] < 1}
                    onKeyDown={(e) => {
                      // Allow: backspace, delete, tab, escape, enter, and .
                      if (
                        [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !==
                          -1 ||
                        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                        (e.keyCode === 65 && e.ctrlKey === true) ||
                        (e.keyCode === 67 && e.ctrlKey === true) ||
                        (e.keyCode === 86 && e.ctrlKey === true) ||
                        (e.keyCode === 88 && e.ctrlKey === true) ||
                        // Allow: home, end, left, right
                        (e.keyCode >= 35 && e.keyCode <= 39)
                      ) {
                        return;
                      }
                      // Ensure that it is a number and stop the keypress
                      if (
                        (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
                        (e.keyCode < 96 || e.keyCode > 105)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className={`w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      priceRange[1] < 1
                        ? "bg-gray-100 cursor-not-allowed opacity-50"
                        : ""
                    }`}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Separator */}
              <div className="text-gray-500 pt-6">to</div>

              {/* Max Price Input */}
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">
                  Max Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ₱
                  </span>
                  <input
                    type="text"
                    value={formatDisplayValue(priceRange[1])}
                    onChange={(e) => handleInputChange("max", e.target.value)}
                    onKeyDown={(e) => {
                      // Allow: backspace, delete, tab, escape, enter, and .
                      if (
                        [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !==
                          -1 ||
                        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
                        (e.keyCode === 65 && e.ctrlKey === true) ||
                        (e.keyCode === 67 && e.ctrlKey === true) ||
                        (e.keyCode === 86 && e.ctrlKey === true) ||
                        (e.keyCode === 88 && e.ctrlKey === true) ||
                        // Allow: home, end, left, right
                        (e.keyCode >= 35 && e.keyCode <= 39)
                      ) {
                        return;
                      }
                      // Ensure that it is a number and stop the keypress
                      if (
                        (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
                        (e.keyCode < 96 || e.keyCode > 105)
                      ) {
                        e.preventDefault();
                      }
                    }}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2,000,000"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
