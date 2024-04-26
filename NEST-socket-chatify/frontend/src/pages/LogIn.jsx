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
import NavBar from "../components/NavBar/NavBar";
import userContext from "../context/userContext";
import { storage } from "../firebase";
import ImageModal from "../components/ImageModal/ImageModal";

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
    <div>
      <NavBar />
      <div className="flex justify-center mt-40">
        <Toaster></Toaster>
        <form
          className="card p-6 w-96 grid gap-4 border border-gray-200 rounded-lg bg-neutral-content"
          onSubmit={(e) => handleSubmit(e)}
        >
          <h1 className="font-bold text-3xl text-center my-5">
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
              <ImageModal
                {...{
                  imagePreview,
                  setImagePreview,
                  setImageUpload,
                  uploadFile,
                  loading,
                }}
              />
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
