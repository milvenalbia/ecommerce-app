import { RotateCcw, Shield, ShoppingCart, Star, Truck } from "lucide-react";
const ProductDisplay = ({
  product,
  setQuantity,
  quantity,
  handleAddToCart,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Images */}
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-square group">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex justify-between items-center gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <Truck className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-sm">Free Shipping</p>
                <p className="text-xs text-gray-600">Orders over $99</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-blue-600" />
              <div>
                <p className="font-semibold text-sm">2-Year Warranty</p>
                <p className="text-xs text-gray-600">Full coverage</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <RotateCcw className="w-6 h-6 text-purple-600" />
              <div>
                <p className="font-semibold text-sm">30-Day Returns</p>
                <p className="text-xs text-gray-600">No questions asked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-xl text-gray-500 mb-2">
              {product.category?.name}
            </p>
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
                <span className="ml-2 text-gray-600">(2,847 reviews)</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-8">
              <span className="text-4xl font-bold text-gray-900">
                ${Number(product.price).toLocaleString()}
              </span>
              <span className="text-2xl text-gray-500 line-through">$449</span>
              <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                22% OFF
              </span>
            </div>
          </div>

          {/* Product Description */}
          <div>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                {product.description} Lorem ipsum dolor sit, amet consectetur
                adipisicing elit. Aspernatur ratione natus tempore sapiente
                soluta ipsum illo eos sunt earum enim saepe, corporis ducimus
                velit consequuntur vel similique fuga deserunt dolorum. Lorem
                ipsum dolor sit amet consectetur adipisicing elit. Odio ipsa
                quibusdam impedit, omnis quis architecto deserunt incidunt
                delectus ex, labore aperiam accusantium, non nesciunt optio
                repellat molestiae eius quod dignissimos? Lorem ipsum dolor sit
                amet consectetur adipisicing elit. Obcaecati rerum et ab nulla
                voluptate atque, vero tenetur quam pariatur in, explicabo
                perferendis eos! Aliquid iusto sapiente ullam quasi voluptatum
                magnam!
              </p>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="flex items-center">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                -
              </button>
              <span className="px-4 py-2 border-x border-gray-300">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Purchase Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => handleAddToCart(product.id, quantity)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-6 h-6" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
