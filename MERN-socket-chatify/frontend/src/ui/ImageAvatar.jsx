import React from "react";
import userAvatar from "../assets/user.jpg";

function ImageAvatar({ children, src, width }) {
  return (
    <div className="flex gap-2">
      <div className="rounded-full">
        <img
          alt="profile"
          className={
            width
              ? `w-${width} h-${width} rounded-full`
              : `w-8 h-8 rounded-full`
          }
          src={src ? src : userAvatar}
        />
      </div>
      {children}
    </div>
  );
}

export default ImageAvatar;
