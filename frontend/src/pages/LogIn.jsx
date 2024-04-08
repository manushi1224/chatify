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
import { ImageUpload } from "../ui/svgs/AllSvgs";

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
      document.getElementById("my_modal_1").close();
    }
  }, [formData.imageUrl]);

  const uploadFile = () => {
    if (imageUpload === null) {
      toast.error("Please select an image");
      return;
    }
    const imageRef = storageRef(storage, `images/${imageUpload + uuid()}`);

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
        const response = await signupUser(formData);
        if (response.data.success) {
          toast.success(response.data.message);
          setTimeout(() => {
            window.location.href("/");
          }, 2000);
          return;
        }
      } catch (error) {
        toast.error("Something went wrong!");
      }
    } else {
      try {
        const { data } = await loginUser(formData);
        if (data.success) {
          authUser.login(data.token, data.user._id, peerId);
          toast.success(data.message);
          navigate("/chat");
          return;
        }
      } catch (error) {
        toast.error("Invalid Credentials!");
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
                  document.getElementById("my_modal_1").showModal()
                }
              >
                Upload Profile Picture
              </span>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Upload Your Picture</h3>
                  <div className="my-10">
                    <div className="flex w-full items-center justify-center bg-grey-lighter">
                      {!imagePreview ? (
                        <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-slate-500">
                          <ImageUpload />
                          <span className="mt-2 text-base leading-normal">
                            Select a file
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              setImagePreview(
                                URL.createObjectURL(e.target.files[0])
                              );
                              setImageUpload(e.target.files[0]);
                            }}
                          />
                        </label>
                      ) : (
                        <img
                          src={imagePreview}
                          alt="profile"
                          className=" w-32 h-32 rounded-full bg-cover"
                        ></img>
                      )}
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
                    <form method="dialog">
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
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
