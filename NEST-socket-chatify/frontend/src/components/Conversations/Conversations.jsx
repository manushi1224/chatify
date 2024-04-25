import React, { useContext, useEffect, useState } from "react";
import { getUserById } from "../../apis/userApis";
import ImageAvatar from "../../ui/ImageAvatar";
import userContext from "../../context/userContext";

function Conversations({ notification, conversations, userId, current }) {
  const [conversationUser, setConversationUser] = useState([]);
  const user = useContext(userContext);

  useEffect(() => {
    const getUser = async (friends) => {
      try {
        const { data } = await getUserById(user.token, friends);
        setConversationUser(data.user);
      } catch (error) {}
    };
    const friends = conversations.members.find((member) => member !== userId);
    getUser(friends);
  }, [conversations, userId, notification, user.token]);

  return (
    <span
      className={`${
        current === conversations._id ? "bg-primary" : ""
      } w-full p-4`}
    >
      <div className="w-8 rounded-full">
        <ImageAvatar src={conversationUser?.imageUrl} />
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
