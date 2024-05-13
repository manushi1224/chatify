import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import Peer from "peerjs";
import React, { useContext, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { loginUser, signupUser } from "../apis/userApis";
import ImageModal from "../components/ImageModal/ImageModal";
import userContext from "../context/userContext";
import message from "../assets/message.png";
import ImageNavbar from "../assets/chatify.png";
import videoCall from "../assets/videoCall.png";
import image from "../assets/2701007.jpg";
import { storage } from "../firebase";

function LogIn() {
  const authUser = useContext(userContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [imageUpload, setImageUpload] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [peerId, setPeerId] = useState("");
  const [signupForm, setSignupForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id) => {
      setPeerId(id);
    });
    if (authUser.token) {
      navigate("/chat");
    }
  }, [navigate, authUser.token]);

  useEffect(() => {
    if (formData.imageUrl) {
      setLoading(false);
      document.getElementById("image_upload_modal").close();
    }
  }, [formData.imageUrl]);

  const uploadFile = () => {
    if (imageUpload === null) {
      toast.error("Please select an image");
      return;
    }
    console.log(imageUpload);
    const imageRef = storageRef(storage, `images/${imageUpload.name + uuid()}`);

    uploadBytes(imageRef, imageUpload)
      .then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          toast.success("Image uploaded successfully");
          setFormData({ ...formData, imageUrl: url });
        });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all the fields");
      return;
    }
    if (signupForm) {
      try {
        const response = await signupUser(formData, authUser.token);
        if (response.status === 201) {
          toast.success(response.data.message);
          setTimeout(() => {
            authUser.login(
              response.data.token,
              response.data.newUser._id,
              peerId
            );
            setSignupForm(false);
          }, 2000);
          return;
        }
      } catch (error) {
        toast.error("Something went wrong!");
      }
    } else {
      try {
        const response = await loginUser(formData, authUser.token);
        if (response.status === 200) {
          authUser.login(
            response.data.access_token,
            response.data.userId,
            peerId
          );
          toast.success("Logged In Successfully!");
          navigate("/chat");
          return;
        }
      } catch (error) {
        if (error.response.status === 401) {
          toast.error("Please check your password!");
        } else if (error.response.status === 404) {
          toast.error("Accoount doesn't exist! Please sign up!");
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  return (
    <div className="flex h-screen">
      <div className="relative overflow-hidden md:flex w-1/2 i justify-around items-center ps-20">
        {/* <div className="col-start-4 col-end-13 row-span-1 image-stack__item--bottom">
          <img src={message} alt="" />
        </div>
        <div className="image-stack__item--top ">
          <img src={videoCall} alt="" />
        </div> */}
        <img src={image} className="w-full" />
      </div>
      <div className="flex md:w-1/2 justify-center py-10 items-center bg-white">
        {signupForm && (
          <ImageModal
            {...{
              imagePreview,
              setImagePreview,
              setImageUpload,
              uploadFile,
              loading,
            }}
          />
        )}
        <Toaster></Toaster>
        <form
          className="card p-6 w-96 grid gap-4 border-2 border-gray-200 rounded-lg "
          onSubmit={(e) => handleSubmit(e)}
        >
          <img src={ImageNavbar} alt="Chatify" className="w-32 mx-auto" />
          <h1 className="font-bold text-2xl text-center my-5">
            {signupForm ? "Create New Account" : "Login"}
          </h1>
          {signupForm && (
            <>
              <label className="input input-bordered flex items-center gap-2">
                <input
                  type="text"
                  className="grow"
                  placeholder="Username"
                  onChange={(e) => {
                    setFormData({ ...formData, userName: e.target.value });
                  }}
                />
              </label>
              <span
                className="btn"
                onClick={() =>
                  document.getElementById("image_upload_modal").showModal()
                }
              >
                Upload Profile Picture
              </span>
            </>
          )}
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="text"
              className="grow"
              placeholder="Email"
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
              }}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <input
              type="password"
              className="grow"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
            />
          </label>

          <button className="btn btn-active btn-primary" type="submit">
            {signupForm ? "Sign Up" : "Log In"}
          </button>

          <div className="flex justify-center mt-4">
            {signupForm ? (
              <span>
                Already A User?
                <span
                  onClick={() => setSignupForm(!signupForm)}
                  className="text-secondary cursor-pointer"
                >
                  &nbsp;Sign In
                </span>
              </span>
            ) : (
              <span>
                New User?
                <span
                  onClick={() => setSignupForm(!signupForm)}
                  className="text-secondary cursor-pointer"
                >
                  &nbsp;Sign Up
                </span>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
