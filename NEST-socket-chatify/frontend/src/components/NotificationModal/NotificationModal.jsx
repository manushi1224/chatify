import React, { useContext } from "react";
import { deleteNotification } from "../../apis/notificationApis";
import { NoNotification } from "../../assets/svgs/AllSvgs";
import userContext from "../../context/userContext";
import NotificationCard from "../../ui/NotificationCard";

function NotificationModal({
  notify,
  setNotify,
  conversations,
  fetchConversations,
  settingCurrentConversation,
}) {
  const authUser = useContext(userContext);

  const handleDelete = async (notificationId) => {
    try {
      const res = await deleteNotification(notificationId, authUser.token);
      if (res.status === 200) {
        setNotify(notify.filter((ntf) => ntf._id !== notificationId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modal-box">
      <h3 className="font-bold text-lg">Notifications</h3>
      <form method="dialog">
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div className="flex flex-col justify-between mt-4">
        {notify.length ? (
          notify.map((ntfn, index) => (
            <NotificationCard
              key={index}
              ntfn={ntfn}
              handleDelete={handleDelete}
              fetchConversations={fetchConversations}
              settingCurrentConversation={settingCurrentConversation}
              conversation={conversations}
            />
          ))
        ) : (
          <span className="w-full">
            <NoNotification />
            <span className="flex justify-center mt-5">No Notifications!</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default NotificationModal;
