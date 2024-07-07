import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Spinner from "../Components/Spinner";

const Ref = () => {
  const [idme, setIdme] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const telegramUserid = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
    if (telegramUserid) {
      setIdme(telegramUserid);
      fetchUsersByRefereeId(telegramUserid);
    }
  }, []);

  const fetchUsersByRefereeId = async (refereeId) => {
    try {
      const userRef = collection(db, "telegramUsers");
      const querySnapshot = await getDocs(userRef);
      const filteredUsers = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.refereeId === refereeId) {
          filteredUsers.push(data);
        }
      });

      setUsers(filteredUsers);
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
            {users.length} Referrals
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
