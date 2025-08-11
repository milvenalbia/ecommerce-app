import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import CryptoJS from "crypto-js";
import api from "../api/axios";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

const encrypt = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decrypt = (encrypted) => {
  const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      isLoading: false,

      setItems: (newItems) => set({ items: newItems }),
      setTotalItems: (newTotal) => set({ totalItems: newTotal }),

      fetchCartItems: async (controller) => {
        set({ isLoading: true });

        try {
          const res = await api.get("api/carts", { signal: controller.signal });
          const data = res.data;

          set({
            items: data.carts,
            totalItems: data.totalItems,
            isLoading: false,
          });
        } catch (err) {
          if (err.name === "CanceledError") {
            console.log("Fetching cart cancelled!");
            return;
          }
          if (err.response) {
            const { status } = err.response;

            if (status === 401) {
              set({
                items: null,
                totalItems: 0,
                isLoading: false,
              });
            }
          }

          set({
            items: null,
            totalItems: 0,
            isLoading: false,
          });
        }

        set({ isLoading: false });
      },

      addToCart: async (product_id, quantity) => {
        try {
          const res = await api.post(`api/products/carts/${product_id}`, {
            quantity: quantity,
          });

          const data = res.data;

          if (data) {
            set({ totalItems: data.totalItems });
            toast.success(data.message || "Added successfully.");
          }
        } catch (error) {
          if (error.response) {
            const { status } = error.response;

            if (status === 401) {
              set({
                items: null,
                totalItems: 0,
                isLoading: false,
              });
            }
          }

          toast.error("Something went error in adding product");

          set({
            items: null,
            totalItems: 0,
            isLoading: false,
          });
        }
      },

      removeCartItem: async (cart_id) => {
        try {
          const res = await api.delete(`/api/carts/${cart_id}`);

          const data = res.data;

          if (data) {
            set((state) => ({
              items: state.items.filter((item) => item.id !== cart_id),
            }));
            set({ totalItems: data.totalItems });
            toast.success(data.message || "Item removed successfully");
          }
        } catch (error) {
          if (error.response) {
            const { status } = error.response;

            if (status === 401) {
              set({
                items: null,
                totalItems: 0,
                isLoading: false,
              });
            }
          }

          toast.error("Something went error in adding product");

          set({
            items: null,
            totalItems: 0,
            isLoading: false,
          });
        }
      },

      updateCartQuantity: async (cart_id, newQuantity) => {
        try {
          const res = await api.put(`/api/carts/${cart_id}`, {
            quantity: newQuantity,
          });

          const data = res.data;

          if (data) {
            // set((state) => ({
            //   items: state.items.map((item) =>
            //     item.id === cart_id ? data.cart : item
            //   ),
            // }));
            set({ totalItems: data.totalItems });
            toast.success(data.message || "Updated successfully");
          }
        } catch (error) {
          if (error.response) {
            const { status } = error.response;

            if (status === 401) {
              set({
                items: null,
                totalItems: 0,
                isLoading: false,
              });
            }
          }

          toast.error("Something went error in adding product");

          set({
            items: null,
            totalItems: 0,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: "totalItems",
      storage: {
        getItem: (name) => {
          const stored = localStorage.getItem(name);
          if (!stored) return 0;
          try {
            return decrypt(stored);
          } catch (e) {
            console.error("Decryption failed:", e);
            return 0;
          }
        },
        setItem: (name, value) => {
          const encrypted = encrypt(value);
          localStorage.setItem(name, encrypted);
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      partialize: (state) => ({ totalItems: state.totalItems }),
    }
  )
);
