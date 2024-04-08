import React, { useContext, useEffect, useState } from "react";
import UserList from "../../ui/UserList";
import axios from "axios";
import userContext from "../../context/userContext";

function NewChatModal({ socket }) {
  const user = useContext(userContext);
  const [newChatUser, setNewChatUser] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_KEY}/api/conversations/allConversations/${user?.userId}`
        );
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
            <>nothing</>
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
