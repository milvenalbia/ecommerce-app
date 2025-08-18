import { Filter, RefreshCw, ShoppingCart, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { scale } from "@cloudinary/url-gen/actions/resize";
import { AdvancedImage } from "@cloudinary/react";
import api from "../../api/axios";
import { toast } from "sonner";
import FilterBar from "./Filter";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router";
import Modal from "./Modal";
import SmallLoading from "../SmallLoading";

const ProductList = () => {
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalProduct, setTotalProduct] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [perPage, setPerPage] = useState(15);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [params, setParams] = useState({
    category: [],
    price_from: null,
    price_to: null,
  });

  const fetchProduct = async (controller) => {
    setLoading(true);
    try {
      const res = await api.get("api/products", {
        params: { ...params, per_page: perPage, search: debouncedSearchTerm },
        signal: controller.signal,
      });

      setProducts(res.data.data);
      setTotalProduct(res.data.total);
    } catch (error) {
      if (error.name === "CanceledError") {
        console.log("Fetching product data cancelled!");
        return;
      }
      if (error.response?.status === 429) {
        toast.error("Too many requests. Try again later");
      } else {
        toast.error("Network error or server not responding.");
      }
    }

    setLoading(false);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddToCart = (product_id) => {
    if (!user) {
      setIsOpen(true);
    } else {
      addToCart(product_id);
    }
  };

  const handleByCategory = (name, category_id) => {
    setParams((prev) => {
      const existing = prev[name] || [];

      // Toggle logic: if already selected, remove it; otherwise, add it
      const updated = existing.includes(category_id)
        ? existing.filter((id) => id !== category_id)
        : [...existing, category_id];

      return {
        ...prev,
        [name]: updated,
      };
    });
  };

  const handlePriceRange = (priceRange) => {
    const [min, max] = priceRange;

    setParams((prev) => ({
      ...prev,
      price_from: min,
      price_to: max,
    }));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    fetchProduct(controller);

    return () => controller.abort();
  }, [params, debouncedSearchTerm]);
  return (
    <>
      <div className="lg:hidden">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 w-full justify-center"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Sidebar Filter */}
      <FilterBar
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        handleByCategory={handleByCategory}
        handlePriceRange={handlePriceRange}
      />

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-xl font-medium text-gray-900">
            {totalProduct && `${totalProduct} results`}
          </h2>
          <div className="flex items-center w-1/2 space-x-2">
            <label htmlFor={"search"} className="text-lg text-gray-600">
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={params.search}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-gray-800 w-full py-1 px-2 outline-1 outline-gray-500 rounded-md"
            />
          </div>
        </div>

        {loading ? (
          <SmallLoading />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {products.map((product) => {
              const cld = new Cloudinary({
                cloud: { cloudName: import.meta.env.VITE_CLOUD_NAME },
              });

              let img = null;
              if (product.image_public_id) {
                img = cld
                  .image(product.image_public_id)
                  .format("auto")
                  .quality("auto")
                  .resize(scale().width(500));
              }
              return (
                <div
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  key={product.id}
                >
                  <Link to={`/product/${product.id}`} className="group">
                    <div className="relative overflow-hidden">
                      {img ? (
                        <AdvancedImage
                          cldImg={img}
                          className="w-full h-48 sm:h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 sm:h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {/* {product.sale && (
                  <span className="absolute top-3 left-3 bg-purple-500 text-white text-xs px-2 py-1 rounded">
                    SALE
                  </span>
                )} */}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-bold text-purple-600">
                          ${Number(product.price).toLocaleString()}
                        </span>
                        {/* <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice}
                  </span> */}
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </Link>
                  <div className="px-4 pb-4">
                    <button
                      onClick={(e) => handleAddToCart(product.id)}
                      className="w-full p-2 px-3 mt-2 rounded cursor-pointer text-center transition text-white bg-purple-400 hover:bg-purple-500 hover:scale-105 duration-300"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:gap-6">
            <span className="text-gray-500 text-center">No product found</span>
          </div>
        )}
      </div>

      {isOpen && (
        <Modal title={"Notification"} closeModal={closeModal}>
          <p className="text-gray-800 text-2xl">
            Please sign in before making action.
          </p>
          <div className="h-0.25 w-full bg-gray-200"></div>
          <div className="flex items-center justify-end gap-2">
            <Link to="/login" className="primary-btn py-2 px-5 rounded-lg">
              Sign In
            </Link>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProductList;
