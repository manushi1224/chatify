import React, { useContext, useEffect, useState } from "react";
import { getAllConversationsByUser } from "../../apis/conversationApis";
import userContext from "../../context/userContext";
import UserList from "../../ui/UserList";

function NewChatModal({ socket }) {
  const user = useContext(userContext);
  const [newChatUser, setNewChatUser] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllConversationsByUser(user.userId);
        setNewChatUser(response.data.newUsers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [user.userId]);

  return (
    <div className="modal-box">
      <h3 className="font-bold text-lg"> Create New Chat</h3>
      <div className="py-4">
        <ul>
          {newChatUser.length === 0 ? (
            <>No user to be shown!</>
          ) : (
            newChatUser.map((u) => {
              return (
                <UserList
                  key={u._id}
                  recieverId={u._id}
                  senderId={user.userId}
                  userName={u.userName}
                  senderName={user.currentUser.userName}
                  imageUrl={u.imageUrl}
                  newChat={true}
                  socket={socket}
                />
              );
            })
          )}
        </ul>
      </div>
      <div className="modal-action">
        <form method="dialog">
          <button className="btn">Close</button>
        </form>
      </div>
    </div>
  );
}

export default NewChatModal;
