import React from "react";

function ImageAvatar({ children, userName, size }) {
  return (
    <div className="flex">
      <div className="w-full rounded-full flex col-span-5">
        <img
          alt="profile"
          src={`https://ui-avatars.com/api/?name=${userName}&background=random&rounded=true&size=${size}&font-size=0.4&bold=true`}
        />
      </div>
      {children}
    </div>
  );
}

export default ImageAvatar;
