import React from "react";

const Spinner = ({ size = 48, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="animate-spin rounded-full border-4 border-primary/20 border-t-primary"
        style={{
          width: size,
          height: size,
        }}
      />
    </div>
  );
};

export default Spinner;
