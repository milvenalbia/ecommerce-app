import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import { store } from "./redux/store.js";
import { Toaster } from "sonner";
import AppProvider from "../context/AppContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster
        richColors
        expand={true}
        position="top-right"
        duration={3000}
        toastOptions={{
          classNames: {
            title: "text-[16px] font-semibold",
          },
        }}
      />
      <App />
    </Provider>
  </StrictMode>
);
