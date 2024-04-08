import React from "react";

function ImageAvatar({ children, src }) {
  return (
    <div className="flex">
      <div className="w-full rounded-full flex col-span-5">
        <img alt="profile" className="w-14 rounded-full" src={src} />
      </div>
      {children}
    </div>
  );
}

export default ImageAvatar;
