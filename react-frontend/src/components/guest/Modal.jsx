import { X } from "lucide-react";

const Modal = ({ children, closeModal, title }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 h-screen">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeModal}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg mx-4 duration-300 border border-white/20">
        <div className="relative bg-white rounded-3xl p-8 max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">{title}</h1>
            </div>

            <button
              onClick={closeModal}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors duration-200 group"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
