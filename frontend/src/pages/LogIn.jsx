import axios from "axios";
import Peer from "peerjs";
import React, { useContext, useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import userContext from "../context/userContext";

function LogIn() {
  const authUser = useContext(userContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [peerId, setPeerId] = useState("");
  const [signupForm, setSignupForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const peer = new Peer();
    peer.on("open", (id) => {
      setPeerId(id);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(process.env.REACT_APP_API_KEY);
    if (!formData.email || !formData.password) {
      toast.error("Please fill all the fields");
      return;
    }
    console.log(formData);
    if (signupForm) {
      const response = await axios.post(
        `${process.env.REACT_APP_API_KEY}/api/user/signup`,
        formData
      );
      console.log(response);
      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
        return;
      }
    } else {
      const response = await axios.post(
        `${process.env.REACT_APP_API_KEY}/api/user/login`,
        formData
      );
      console.log(response);
      if (response.data.success) {
        authUser.login(response.data.token, response.data.user._id, peerId);

        toast.success(response.data.message);
        // setTimeout(() => {
        navigate("/chat");
        // }, 2000);
        return;
      }
      toast.error(response.data.message);
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
                <span onClick={() => setSignupForm(!signupForm)}>Sign In</span>
              </span>
            ) : (
              <span>
                New User?
                <span onClick={() => setSignupForm(!signupForm)}>Sign Up</span>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogIn;
