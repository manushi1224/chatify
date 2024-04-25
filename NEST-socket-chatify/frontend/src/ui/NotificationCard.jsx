import React, { useContext } from "react";
import {
  createNewConversation,
  getConversationByUser,
} from "../apis/conversationApis";
import { sendNotification } from "../apis/notificationApis";
import { useSocket } from "../context/SocketProvider";
import userContext from "../context/userContext";
import ResponseButtons from "../lib/renderButtons";

function NotificationCard({
  ntfn,
  handleDelete,
  fetchConversations,
  settingCurrentConversation,
}) {
  const authUser = useContext(userContext);
  const socket = useSocket();

  const fetchAllConversationByUser = async (notificationId) => {
    try {
      const { data } = await getConversationByUser(
        authUser.userId,
        authUser.token
      );
      fetchConversations(data.allConversation);
      settingCurrentConversation(data.allConversation._id);
    } catch (error) {}
    handleDelete(notificationId);
  };

  const handleAccept = async (recieverId, notificationId) => {
    socket.emit("sendNotification", {
      senderId: authUser.userId,
      recieverId: recieverId,
      text: "Your request has been accepted",
      userName: authUser?.currentUser?.userName,
      type: "accepted",
    });
    try {
      await sendNotification({
        senderId: authUser.userId,
        recieverId: recieverId,
        text: "Your request has been accepted",
        userName: authUser?.currentUser?.userName,
        type: "accepted",
        token: authUser.token,
      });
      const response = await createNewConversation({
        senderId: authUser.userId,
        recieverId,
        token: authUser.token,
      });
      fetchConversations((prev) => [...prev, response.data.createConversation]);
      settingCurrentConversation(response.data.createConversation._id);
      handleDelete(notificationId);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecline = async (notificationId, senderId) => {
    // here senderId is the recieverId of the notification, suppose pip send a request to ravi and ravi declines it, so pip is the senderId and ravi is the recieverId
    // so we have to send the notification to pip that ravi has declined the request

    try {
      const { data } = await sendNotification({
        senderId: authUser.userId,
        recieverId: senderId,
        text: "Your request has been declined",
        userName: authUser?.currentUser?.userName,
        type: "response",
        token: authUser.token,
      });
      socket.current.emit("sendNotification", {
        senderId: authUser.userId,
        recieverId: senderId,
        userName: authUser?.currentUser?.userName,
        text: "Your request has been declined",
        type: "response",
        notificationId: data.notification._id,
      });
    } catch (error) {}
    handleDelete(notificationId);
  };
  return (
    <div className="bg-primary-content rounded-md p-2 flex w-full justify-around mb-2">
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
        handleDelete={handleDelete}
        handleAccept={handleAccept}
        handleDecline={handleDecline}
        fetchAllConversationByUser={fetchAllConversationByUser}
      />
    </div>
  );
}

export default NotificationCard;
