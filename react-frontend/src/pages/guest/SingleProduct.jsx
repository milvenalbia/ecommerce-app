import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Loading from "../../components/Loading";
import api from "../../api/axios";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import ProductDisplay from "../../components/guest/single_product/ProductDisplay";
import ProductSuggestion from "../../components/guest/single_product/ProductSuggestion";

const SingleProduct = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const getProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`api/products/${id}`);

      window.scrollTo({ top: 0, behavior: "smooth" });

      const data = response.data;

      console.log(data);
      if (data) {
        setProduct(data.product);
      }
    } catch (error) {
      setProduct({});
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddToCart = (product_id, quantity) => {
    if (!user) {
      setIsOpen(true);
    } else {
      addToCart(product_id, quantity);
      setQuantity(1);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);
  return (
    <>
      {loading && Object.keys(product).length < 1 ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <ProductDisplay
            setQuantity={setQuantity}
            quantity={quantity}
            product={product}
            handleAddToCart={handleAddToCart}
          />
          <ProductSuggestion
            category_id={product.category_id}
            product_id={product.id}
          />
        </div>
      )}

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

export default SingleProduct;
