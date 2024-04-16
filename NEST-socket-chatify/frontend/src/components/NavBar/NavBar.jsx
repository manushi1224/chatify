import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageNavbar from "../../assets/chatify.png";
import userContext from "../../context/userContext";
import ImageAvatar from "../../ui/ImageAvatar";
import { BellIcon, NewChat } from "../../assets/svgs/AllSvgs";
import NewChatModal from "../NewChatModal/NewChatModal";
import NotificationModal from "../NotificationModal/NotificationModal";
import SideBar from "../SideBar/SideBar";
import { getAllNotifications } from "../../apis/notificationApis";
import { useSocket } from "../../context/SocketProvider";

function NavBar({
  notification,
  setNotification,
  conversations,
  fetchConversations,
  settingCurrentConversation,
}) {
  const authUser = useContext(userContext);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [notify, setNotify] = useState();
  const socket = useSocket();

  useEffect(() => {
    if (!authUser.isLoggedIn) {
      navigate("/");
    }
  }, [authUser, navigate]);

  useEffect(() => {
    authUser.getUserData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!authUser.userId) return;
    try {
      const fetchAllNotifications = async () => {
        const { data } = await getAllNotifications(authUser.userId);
        setNotify(data.notifications);
      };
      fetchAllNotifications();
    } catch (error) {}
  }, [notification, authUser.userId]);

  useEffect(() => {
    notification && setNotify((prev) => [...prev, notification]);
  }, [notification, setNotify]);

  const handleNotifications = () => {
    setNotification({ ...notification, text: "" });
    document.getElementById("my_modal_3").showModal();
  };

  if (!authUser.token) {
    return (
      <div className="shadow-lg">
        <div className="navbar bg-primary-content rounded-xl h-full flex justify-center">
          <div className="py-2">
            <img src={ImageNavbar} alt="Chatify" className="w-32" />
          </div>
        </div>
      </div>
    );
  }

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div className="justify-center shadow-lg h-[98%]">
      {modalOpen && <SideBar closeModal={() => setModalOpen(false)}></SideBar>}
      <div className="navbar bg-primary-content rounded-xl h-full m-2">
        <div className="w-full h-full py-2 px-4 grid grid-rows-8 gap-2">
          <div className="col-span-1">
            <img src={ImageNavbar} alt="Chatify" />
          </div>
          <div className="col-span-1"></div>
          <div className="col-span-1"></div>
          <div className="col-span-1"></div>
          <div className="col-span-1"></div>
          <div className="col-span-1 flex justify-center">
            {/* BellIcon */}
            <div onClick={() => handleNotifications()}>
              <div className="group relative">
                {(notify && notification?.text) || notify?.length !== 0 ? (
                  <span className="inline-flex items-center justify-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium ">
                    <span className="size-2 inline-block rounded-full bg-blue-800 dark:bg-red-900"></span>
                    <BellIcon />
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium ">
                    <BellIcon />
                  </span>
                )}
                <span className="absolute -top-12 left-[100%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                  Notifications <span> </span>
                </span>
              </div>
            </div>
            <dialog id="my_modal_3" className="modal">
              <NotificationModal
                notify={notify}
                setNotify={setNotify}
                conversations={conversations}
                fetchConversations={fetchConversations}
                settingCurrentConversation={settingCurrentConversation}
              />
            </dialog>
          </div>
          <div className="col-span-1 flex justify-center">
            {/* new chat */}
            <div
              className=""
              onClick={() => document.getElementById("my_modal_1").showModal()}
            >
              <div className="group relative">
                <NewChat />
                <span className="absolute -top-12 left-[100%] -translate-x-[50%] z-20 origin-left scale-0 px-3 rounded-lg border border-gray-300 bg-white py-2 text-sm font-bold shadow-md transition-all duration-300 ease-in-out group-hover:scale-100">
                  Chat <span> </span>
                </span>
              </div>
              <dialog id="my_modal_1" className="modal">
                <NewChatModal socket={socket} notification={notification} />
              </dialog>
            </div>
          </div>
          <div className="col-span-1 flex justify-center">
            <div className="h-20 pt-2" onClick={handleModal}>
              <ImageAvatar
                src={authUser?.currentUser?.imageUrl}
                userName={authUser?.currentUser?.userName}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
