import React, { useEffect, useState } from "react";
import axios from "axios";

function Conversations({ notification, conversations, userId, current }) {
  const [conversationUser, setConversationUser] = useState([]);

  useEffect(() => {
    const getUser = async (friends) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_KEY}/api/user/${friends}`
        );
        setConversationUser(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    const friends = conversations.members.find((member) => member !== userId);
    getUser(friends);
  }, [conversations, userId, notification]);

  return (
    <span
      className={`${current === conversations._id ? "bg-primary" : ""} w-full`}
    >
      <div className="w-8 rounded-full">
        <img
          alt="profile"
          src={`https://ui-avatars.com/api/?name=${conversationUser.userName}&background=random&rounded=true&size=50&font-size=0.4&bold=true&length=1`}
        />
      </div>
      <span
        className={`${
          current === conversations._id ? "text-base-100 font-semibold" : ""
        } text-base text-base-content w-full`}
      >
        {conversationUser.userName}
      </span>
    </span>
  );
}

export default Conversations;
