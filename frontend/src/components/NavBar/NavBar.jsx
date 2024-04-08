import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import userContext from "../../context/userContext";
import { BellIcon, NewChat } from "../../ui/svgs/AllSvgs";
import NewChatModal from "../NewChatModal/NewChatModal";
import NotificationModal from "../NotificationModal/NotificationModal";
import ImageAvatar from "../../ui/ImageAvatar";
import ImageNavbar from "../../assets/chatify.png";

function NavBar({
  notification,
  socket,
  conversations,
  fetchConversations,
  settingCurrentConversation,
}) {
  const authUser = useContext(userContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser.isLoggedIn) {
      navigate("/");
    }
  }, [authUser, navigate]);

  useEffect(() => {
    authUser.getUserData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {authUser.token ? (
        <div className="justify-center shadow-lg h-[98%]">
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
                {/* bell BellIcon */}
                <div
                  onClick={() =>
                    document.getElementById("my_modal_3").showModal()
                  }
                >
                  <div className="group relative">
                    {notification?.text ? (
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
                    notification={notification}
                    userId={authUser.userId}
                    senderName={authUser?.currentUser?.userName}
                    socket={socket}
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
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
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
                {/* three dots */}
                <div className="dropdown dropdown-top">
                  <div tabIndex={0} role="button" className=" h-20 pt-2">
                    <ImageAvatar
                      src={authUser?.currentUser?.imageUrl}
                      userName={authUser?.currentUser?.userName}
                    >
                      {/* <h1 className="text-base-content font-semibold content-center ps-2 w-full">
                  {authUser?.currentUser?.userName}
                </h1> */}
                    </ImageAvatar>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-secondary-content rounded-box w-52 mt-5"
                  >
                    <li>
                      <span onClick={() => authUser.logout()}>Log Out</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="shadow-lg">
          <div className="navbar bg-primary-content rounded-xl h-full flex justify-center">
            <div className="py-2">
              <img src={ImageNavbar} alt="Chatify" className="w-32" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
