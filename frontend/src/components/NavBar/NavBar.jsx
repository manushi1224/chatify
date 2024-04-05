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
    <div className="justify-center shadow-lg h-[98%]">
      <div className="navbar bg-primary-content rounded-xl h-full m-2">
        {authUser.token && (
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
                {notification?.text ? (
                  <span className="inline-flex items-center justify-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium ">
                    <span class="size-2 inline-block rounded-full bg-blue-800 dark:bg-red-900"></span>
                    <BellIcon />
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium ">
                    <BellIcon />
                  </span>
                )}
              </div>
              <dialog id="my_modal_3" className="modal">
                <NotificationModal
                  notification={notification}
                  userId={authUser.userId}
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
                <NewChat />
                <dialog id="my_modal_1" className="modal">
                  <NewChatModal socket={socket} notification={notification} />
                </dialog>
              </div>
            </div>
            <div className="col-span-1 flex justify-center">
              {/* three dots */}
              <div className="dropdown dropdown-top">
                <div tabIndex={0} role="button" className="h-4 pt-2">
                  <ImageAvatar
                    userName={authUser?.currentUser?.userName}
                    size={40}
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
        )}
      </div>
    </div>
  );
}

export default NavBar;
