import React, { useEffect, useState } from "react";
import axios from "axios";

function NotificationModal({
  notification,
  userId,
  socket,
  conversations,
  fetchConversations,
  settingCurrentConversation,
}) {
  const [notify, setNotify] = useState();

  const fetchAllConversationByUser = async (notificationId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_KEY}/api/conversations/conversation/user/${userId}`
      );
      fetchConversations(response.data.conversations);
      settingCurrentConversation(response.data.conversation._id);
    } catch (error) {
      console.log(error);
    }
    handleDelete(notificationId);
  };

  useEffect(() => {
    notification && setNotify((prev) => [...prev, notification]);
  }, [notification]);

  useEffect(() => {
    try {
      const fetchAllNotifications = async () => {
        const res = await axios.get(
          `${process.env.REACT_APP_API_KEY}/api/notifications/${userId}`
        );
        setNotify(res.data.notifications);
      };
      fetchAllNotifications();
    } catch (error) {
      console.log(error);
    }
  }, [userId, notification]);

  const handleAccept = async (recieverId, userName, notificationId) => {
    socket.current.emit("sendNotification", {
      senderId: userId,
      recieverId: recieverId,
      text: "Your request has been accepted",
      userName: userName,
      type: "accepted",
    });
    try {
      await axios.post(`${process.env.REACT_APP_API_KEY}/api/notifications`, {
        senderId: userId,
        recieverId: recieverId,
        text: "Your request has been accepted",
        userName: userName,
        type: "accepted",
      });
      const response = await axios.post(
        `${process.env.REACT_APP_API_KEY}/api/conversations/`,
        {
          senderId: userId,
          recieverId,
        }
      );
      fetchConversations([...conversations, response.data.conversation]);
      settingCurrentConversation(response.data.conversation._id);
      handleDelete(notificationId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecline = async (notificationId, senderId, userName) => {
    // here senderId is the recieverId of the notification
    // suppose pip send a request to ravi and ravi declines it
    // so pip is the senderId and ravi is the recieverId
    // so we have to send the notification to pip that ravi has declined the request

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_KEY}/api/notifications`,
        {
          senderId: userId,
          recieverId: senderId,
          text: "Your request has been declined",
          userName: userName,
          type: "response",
        }
      );
      socket.current.emit("sendNotification", {
        senderId: userId,
        recieverId: senderId,
        userName: userName,
        text: "Your request has been declined",
        type: "response",
        notificationId: res.data.notification._id,
      });
    } catch (error) {
      console.log(error);
    }
    handleDelete(notificationId);
  };

  const handleDelete = async (notificationId) => {
    console.log(notificationId);
    try {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_KEY}/api/notifications/${notificationId}`
      );
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
        {/* if there is a button in form, it will close the modal */}
        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>
      <div className="flex justify-between mt-4">
        {notify ? (
          notify.map((ntfn) => {
            return (
              <div className="bg-primary-content rounded-md p-2 flex w-full justify-around mb-2">
                <div>
                  <span>{ntfn?.text}</span>
                  <h3 className="font-bold text-lg">
                    {ntfn.type === "request"
                      ? `${ntfn?.userName} wants to connect!`
                      : `${ntfn?.userName} has ${
                          ntfn.type === "accepted"
                            ? "accepted your request! :)"
                            : "declined you request :("
                        }`}
                  </h3>
                </div>
                <div className="modal-action">
                  <form method="dialog">
                    {ntfn.type === "request" ? (
                      <div className="flex gap-3 mt-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => {
                            handleAccept(
                              ntfn.senderId,
                              ntfn.userName,
                              ntfn._id
                            );
                          }}
                        >
                          accept
                        </button>
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() =>
                            handleDecline(
                              ntfn._id,
                              ntfn.senderId,
                              ntfn.userName
                            )
                          }
                        >
                          decline
                        </button>
                      </div>
                    ) : ntfn.type === "accepted" ? (
                      <div className="flex gap-3 mt-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => fetchAllConversationByUser(ntfn._id)}
                        >
                          Chat!!
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-3 mt-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleDelete(ntfn._id)}
                        >
                          OK
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            );
          })
        ) : (
          <span>No Notifications!</span>
        )}
      </div>
    </div>
  );
}

export default NotificationModal;
