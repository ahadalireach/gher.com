/* eslint-disable no-unused-vars */
import React from "react";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex-col gap-4 flex items-center justify-center">
        <div className="w-28 h-28 border-8 text-green-700 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-green-700 rounded-full"></div>
      </div>
    </div>
  );
};

export default Loader;
