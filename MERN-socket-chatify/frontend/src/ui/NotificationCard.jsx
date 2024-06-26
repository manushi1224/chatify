import React, { useContext } from "react";
import userContext from "../context/userContext";
import { useSocket } from "../context/SocketProvider";
import ResponseButtons from "../lib/renderButtons";
import {
  createNewConversation,
  getConversationByUserId,
} from "../apis/conversationApis";
import { sendNotification } from "../apis/notificationApis";

function NotificationCard({
  ntfn,
  handleDelete,
  conversations,
  fetchConversations,
  settingCurrentConversation,
}) {
  const authUser = useContext(userContext);
  const socket = useSocket();

  const fetchAllConversationByUser = async (notificationId) => {
    try {
      const { data } = await getConversationByUserId(authUser.userId);
      fetchConversations(data.conversations);
      settingCurrentConversation(data.conversation._id);
    } catch (error) {}
    handleDelete(notificationId);
  };

  const handleAccept = async (recieverId, notificationId) => {
    socket.current.emit("sendNotification", {
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
        handleDelete={handleDelete}
        handleAccept={handleAccept}
        handleDecline={handleDecline}
        fetchAllConversationByUser={fetchAllConversationByUser}
      />
    </div>
  );
}

export default NotificationCard;
