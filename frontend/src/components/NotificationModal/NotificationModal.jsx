import React from "react";
import {
  createNewConversation,
  getConversationByUserId,
} from "../../apis/conversationApis";
import {
  deleteNotification,
  sendNotification,
} from "../../apis/notificationApis";
import ResponseButtons from "../../lib/renderButtons";
import { NoNotification } from "../../ui/svgs/AllSvgs";

function NotificationModal({
  notify,
  setNotify,
  userId,
  socket,
  senderName,
  conversations,
  fetchConversations,
  settingCurrentConversation,
}) {
  const fetchAllConversationByUser = async (notificationId) => {
    try {
      const { data } = await getConversationByUserId(userId);
      fetchConversations(data.conversations);
      settingCurrentConversation(data.conversation._id);
    } catch (error) {}
    handleDelete(notificationId);
  };

  const handleAccept = async (recieverId, notificationId) => {
    socket.current.emit("sendNotification", {
      senderId: userId,
      recieverId: recieverId,
      text: "Your request has been accepted",
      userName: senderName,
      type: "accepted",
    });
    try {
      await sendNotification({
        senderId: userId,
        recieverId: recieverId,
        text: "Your request has been accepted",
        userName: senderName,
        type: "accepted",
      });
      const response = await createNewConversation({
        senderId: userId,
        recieverId,
      });
      fetchConversations([...conversations, response.data.conversation]);
      settingCurrentConversation(response.data.conversation._id);
      handleDelete(notificationId);
    } catch (error) {}
  };

  const handleDecline = async (notificationId, senderId) => {
    // here senderId is the recieverId of the notification, suppose pip send a request to ravi and ravi declines it, so pip is the senderId and ravi is the recieverId
    // so we have to send the notification to pip that ravi has declined the request

    try {
      const { data } = await sendNotification({
        senderId: userId,
        recieverId: senderId,
        text: "Your request has been declined",
        userName: senderName,
        type: "response",
      });
      socket.current.emit("sendNotification", {
        senderId: userId,
        recieverId: senderId,
        userName: senderName,
        text: "Your request has been declined",
        type: "response",
        notificationId: data.notification._id,
      });
    } catch (error) {}
    handleDelete(notificationId);
  };

  const handleDelete = async (notificationId) => {
    try {
      const res = await deleteNotification(notificationId);
      if (res.status === 200) {
        setNotify(notify.filter((ntf) => ntf._id !== notificationId));
      }
    } catch (error) {}
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
        {notify && notify.length !== 0 ? (
          notify.map((ntfn) => {
            return (
              <div
                key={ntfn._id}
                className="bg-primary-content rounded-md p-2 flex w-full justify-around mb-2"
              >
                <div>
                  <span>{ntfn?.text}</span>
                  <h3 className="font-bold text-lg">
                    {ntfn.type === "request"
                      ? `${ntfn?.userName} wants to connect!`
                      : ntfn.type === "notification"
                      ? `from ${ntfn.userName}`
                      : `${ntfn?.userName} has ${
                          ntfn.type === "accepted"
                            ? "accepted your request! :)"
                            : "declined you request :("
                        }`}
                  </h3>
                </div>
                <ResponseButtons
                  ntfn={ntfn}
                  request={ntfn.type}
                  handleAccept={handleAccept}
                  handleDecline={handleDecline}
                  fetchAllConversationByUser={fetchAllConversationByUser}
                  handleDelete={handleDelete}
                />
              </div>
            );
          })
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
