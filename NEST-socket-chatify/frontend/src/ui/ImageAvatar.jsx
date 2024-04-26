import React from "react";
import userAvatar from "../assets/user.jpg";

function ImageAvatar({ children, src, width }) {
  return (
    <div className="flex gap-4">
      <div className="rounded-full">
        <img
          alt="profile"
          className={width ? "rounded-full" : "rounded-full h-8 w-8"}
          src={src ? src : userAvatar}
        />
      </div>
      {children}
    </div>
  );
}

export default ImageAvatar;
