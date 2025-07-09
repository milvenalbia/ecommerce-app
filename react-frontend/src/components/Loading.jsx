import React from "react";

const Loading = () => {
  return (
    <div className="w-dvw h-dvh flex justify-center items-center">
      <div className="flex flex-row gap-2">
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]" />
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.3s]" />
        <div className="w-4 h-4 rounded-full bg-blue-700 animate-bounce [animation-delay:.7s]" />
      </div>
    </div>
  );
};

export default Loading;
