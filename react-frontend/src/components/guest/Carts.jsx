import { Minus, Plus, Trash2 } from "lucide-react";

const Carts = ({ cartItems, updateQuantity, removeItem }) => {
  return (
    <div className="divide-y divide-gray-200">
      {cartItems.map((item) => (
        <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-4">
            <img
              src={item.product.image_url}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-lg"
            />

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {item.name}
              </h3>
              {/* <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <span>Color: {item.color}</span>
                <span>Size: {item.size}</span>
              </div> */}
              <p className="text-xl font-bold text-gray-900 mt-2">
                ${Number(item.price).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="w-8 text-center font-medium">
                {item.quantity}
              </span>

              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Carts;
