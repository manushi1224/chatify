import {
  deleteObject,
  getDownloadURL,
  ref,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { CSSTransition } from "react-transition-group";
import { v4 as uuid } from "uuid";
import { editUserProfile } from "../../apis/userApis";
import { BackArrow, EditIcon } from "../../assets/svgs/AllSvgs";
import userContext from "../../context/userContext";
import { storage } from "../../firebase";
import Backdrop from "../../ui/BackDrop";
import ImageAvatar from "../../ui/ImageAvatar";
import ImageModal from "../ImageModal/ImageModal";

function SideBar({ closeModal }) {
  const user = useContext(userContext);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUpload, setImageUpload] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: "",
    userName: user.currentUser.userName,
  });
  const [name, setName] = useState(false);

  useEffect(() => {
    user.getUserData();
    // eslint-disable-next-line
  }, [imagePreview, name]);

  const uploadFile = async () => {
    if (imageUpload === null) {
      toast.error("Please select an image");
      return;
    }
    setLoading(true);
    const fileRef = ref(storage, user.currentUser.imageUrl);
    deleteObject(fileRef)
      .then(() => {})
      .catch((error) => {
        console.log("Error deleting file: " + error);
      });

    const imageRef = storageRef(storage, `images/${imageUpload.name + uuid()}`);

    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setFormData({ ...formData, imageUrl: url });
          editUserProfile(user.currentUser._id, { imageUrl: url }, user);
          document.getElementById("image_upload_modal").close();
          setImagePreview(null);
          setLoading(false);
          toast.success("Image updated successfully");
        });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleName = async (e) => {
    e.preventDefault();
    setFormData({ ...formData, userName: formData.userName });
    await editUserProfile(
      user.currentUser._id,
      { userName: formData.userName },
      user
    );
    setName(false);
  };

  return (
    <CSSTransition
      in={true}
      appear={true}
      timeout={300}
      classNames="sidebar"
      unmountOnExit
    >
      <Backdrop closeModal={closeModal}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-[33%] h-[100%] flex flex-col z-10 p-10 bg-slate-100 rounded-xl shadow-lg gap-8"
        >
          <div>
            <h2 className="text-2xl font-bold flex gap-4">
              <span className="mt-1 cursor-pointer" onClick={closeModal}>
                <BackArrow />
              </span>
              Profile
            </h2>
          </div>
          <div className="flex justify-center">
            <ImageAvatar
              src={user.currentUser.imageUrl}
              alt="Profile"
              width={32}
            />
          </div>
          <div className="flex flex-col gap-2">
            <h4 className=" text-sm text-primary flex justify-between">
              Your Name
              <button onClick={() => setName(!name)}>
                {!name ? <EditIcon /> : "Cancel"}
              </button>
            </h4>
            {name ? (
              <form
                onSubmit={(e) => {
                  handleName(e);
                }}
              >
                <input
                  type="text"
                  className="input"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                />
                <button>
                  <input
                    type="submit"
                    value="Save"
                    className="btn btn-primary"
                  />
                </button>
              </form>
            ) : (
              <h3 className="text-xl font-semibold">
                {user.currentUser.userName}
              </h3>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span
              className="btn btn-primary"
              onClick={() =>
                document.getElementById("image_upload_modal").showModal()
              }
            >
              Edit Profile Picture
            </span>
            <ImageModal
              {...{
                imagePreview,
                setImagePreview,
                setImageUpload,
                uploadFile,
                loading,
              }}
            />
          </div>
        </div>
      </Backdrop>
    </CSSTransition>
  );
}

export default SideBar;
