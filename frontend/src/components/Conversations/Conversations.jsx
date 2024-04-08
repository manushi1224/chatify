import React, { useEffect, useState } from "react";
import { getUserById } from "../../apis/userApis";

function Conversations({ notification, conversations, userId, current }) {
  const [conversationUser, setConversationUser] = useState([]);

  useEffect(() => {
    const getUser = async (friends) => {
      try {
        const { user } = await getUserById(friends);
        setConversationUser(user);
      } catch (error) {}
    };
    const friends = conversations.members.find((member) => member !== userId);
    getUser(friends);
  }, [conversations, userId, notification]);

  return (
    <span
      className={`${
        current === conversations._id ? "bg-primary" : ""
      } w-full p-4`}
    >
      <div className="w-8 rounded-full">
        <img
          alt="profile"
          src={conversationUser?.imageUrl}
          className="w-14 rounded-full"
        />
      </div>
      <span
        className={`${
          current === conversations._id
            ? "text-base-100 font-semibold"
            : "text-base text-base-content"
        } w-full`}
      >
        {conversationUser.userName}
      </span>
    </span>
  );
}

export default Conversations;
