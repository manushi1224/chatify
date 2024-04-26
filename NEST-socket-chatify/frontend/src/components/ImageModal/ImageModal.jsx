import React from "react";
import { ImageUpload } from "../../assets/svgs/AllSvgs";

function ImageModal({
  imagePreview,
  setImagePreview,
  setImageUpload,
  uploadFile,
  loading,
}) {
  return (
    <dialog id="image_upload_modal" className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Upload Your Picture</h3>
        <div className="my-10">
          <div className="flex w-full flex-col items-center justify-center bg-grey-lighter">
            {imagePreview && (
              <img
                src={imagePreview}
                alt="profile"
                className=" w-32 h-32 rounded-full bg-cover"
              ></img>
            )}
            <label className="w-64 flex gap-4 justify-center items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-slate-500">
              <ImageUpload />
              <span className="text-base leading-normal">Select a file</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  setImagePreview(URL.createObjectURL(e.target.files[0]));
                  setImageUpload(e.target.files[0]);
                }}
              />
            </label>
          </div>
          {loading ? (
            <div className="flex justify-center">
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-12 w-12"></div>
            </div>
          ) : (
            <span
              className="btn my-4 w-full btn-primary"
              onClick={() => uploadFile()}
            >
              Upload
            </span>
          )}
        </div>

        <div className="modal-action">
          <span method="dialog">
            <button className="btn">Close</button>
          </span>
        </div>
      </div>
    </dialog>
  );
}

export default ImageModal;
