import React, { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Link } from "react-router";

const ProductSuggestion = ({ category_id, product_id }) => {
  const [products, setProducts] = useState([]);

  const get_products = async () => {
    try {
      const response = await api.get("api/product-by-categories", {
        params: { category: category_id, product_id: product_id },
      });

      const data = response.data;

      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    get_products();
  }, [product_id]);

  return (
    products &&
    products.length > 1 && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Product Suggestions
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products &&
            products.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 group aspect-[4/3]" // 4:3 aspect ratio
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
        </div>
      </div>
    )
  );
};

export default ProductSuggestion;
