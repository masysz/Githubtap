import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Spinner from "../Components/Spinner";

const Ref = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      const allUsers = [];
      const uniqueUsernames = new Set();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const { username, fullname, refereeId, count } = data;

        if (!uniqueUsernames.has(username)) {
          allUsers.push({ username, fullname, refereeId, count });
          uniqueUsernames.add(username);
        }
      });

      setUsers(allUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users: ", error);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="w-full flex flex-col space-y-3 px-5">
          <h1 className="text-[#fff] text-[42px] font-semibold">
            {users.length} Users
          </h1>
          <div className="w-full flex flex-col space-y-3">
            {users.map((user, index) => (
              <div
                key={index}
                className="bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center"
              >
                <div className="flex flex-1 flex-col space-y-1">
                  <div className="text-[#fff] text-[16px] font-semibold">
                    {user.fullname}
                  </div>
                  <div className="text-[#9a96a6] text-[14px]">
                    Username: {user.username}
                  </div>
                  <div className="text-[#9a96a6] text-[14px]">
                    Referee ID: {user.refereeId}
                  </div>
                  <div className="text-[#9a96a6] text-[14px]">
                    Count: {user.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Ref;
