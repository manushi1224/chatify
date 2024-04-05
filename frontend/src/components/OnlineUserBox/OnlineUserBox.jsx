// import React, { useEffect, useState } from "react";
// import axios from "axios";

function OnlineUserBox({ onlineUsers }) {
  // const [allusers, setAllUsers] = useState([]);
  //   useEffect(() => {
  //     const fetchCurrentUser = async () => {
  //       try {
  //         const res = await axios.get(
  //           `${process.env.REACT_APP_API_KEY}/api/user/${userId}`
  //         );
  //         setAllUsers(res.data.user);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };

  //     fetchCurrentUser();
  //   }, [userId]);
  return (
    <div>
      {/* {allusers.map((user) => {
        return (
          <li key={user._id} className="flex">
            <span className="py-2">
              <div className="avatar online">
                <div className="w-10 rounded-full">
                  <img
                    alt="profile"
                    src={`https://ui-avatars.com/api/?name=${user.userName}&background=random&rounded=true&size=50&font-size=0.4&bold=true&length=1`}
                  />
                </div>
              </div>
              {user.userName}
            </span>
          </li>
        );
      })} */}
    </div>
  );
}

export default OnlineUserBox;
