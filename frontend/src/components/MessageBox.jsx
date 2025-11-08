import React, { useEffect, useState } from "react";

const MessageBox = ({ message, type }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const colors = {
    info: "bg-yellow-500",
    success: "bg-green-500",
    error: "bg-red-500",
  };

  return (
    <div
      className={`fixed bottom-4 right-4 ${colors[type]} text-gray-900 p-4 rounded-lg shadow-2xl transform transition-transform duration-300 ${
        visible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {message}
    </div>
  );
};

export default MessageBox;
