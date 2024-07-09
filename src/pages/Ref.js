import React, { useEffect, useState } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import ClaimLeveler from "../Components/ClaimLeveler";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Spinner from "../Components/Spinner";
import bronze from "../images/bronze.webp";
import coinsmall from "../images/coinsmall.webp";

const Ref = () => {
  const [count, setCount] = useState(0);
  const [username, setUsername] = useState("");
  const [idme, setIdme] = useState("");
  const [claimLevel, setClaimLevel] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const formattedCount = new Intl.NumberFormat().format(count).replace(/,/g, " ");

  useEffect(() => {
    const telegramUsername = window.Telegram?.WebApp?.initDataUnsafe?.user?.username;
    const telegramUserid = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

    if (telegramUsername) setUsername(telegramUsername);
    if (telegramUserid) setIdme(telegramUserid);

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
        if (!uniqueUsernames.has(data.username)) {
          allUsers.push(data);
          uniqueUsernames.add(data.username);
        }
      });

      console.log("All users:", allUsers);
      setUsers(allUsers);
      setFilteredUsers(allUsers.filter(user => user.refereeId === idme));
      setCount(allUsers.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users: ", error);
      setError("Failed to fetch users. Please try again later.");
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const reflink = `https://t.me/Tetekdf_bot?start=r${idme}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(reflink)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          setError("Failed to copy link. Please try again.");
        });
    } else {
      // Fallback method
      const textArea = document.createElement('textarea');
      textArea.value = reflink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
        setError("Failed to copy link. Please try again.");
      }
      document.body.removeChild(textArea);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <Animate>
      <div className="w-full justify-center flex-col space-y-3 px-5">
        <div className="flex space-y-0 flex-col justify-center items-center">
          <h1 className="text-[#fff] -mb-2 text-[42px] font-semibold">
            {formattedCount} Users
          </h1>
        </div>

        <div className="w-full bg-cards rounded-[12px] px-3 py-4 flex flex-col">
          <span className="w-full flex justify-between items-center pb-2">
            <h2 className="text-[18px] font-semibold">My invite link:</h2>
            <span
              onClick={copyToClipboard}
              className="bg-gradient-to-b from-[#094e9d] to-[#0b62c4] font-medium py-[6px] px-4 rounded-[12px] flex items-center justify-center text-[16px]"
            >
              {copied ? <span>Copied!</span> : <span>Copy</span>}
            </span>
          </span>
          <div className="text-[#9a96a6] text-[13px]">
            https://t.me/Tetekdf_bot?start=r{idme}
          </div>
        </div>
        <div className="bg-borders w-full px-5 h-[1px] !mt-6"></div>

        <div className="w-full flex flex-col">
          <h3 className="text-[22px] font-semibold pb-[16px]">My Referrals:</h3>

          <div className="w-full flex flex-col space-y-3">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <div
                  key={index}
                  className="bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center"
                >
                  <div className="flex flex-1 flex-col space-y-1">
                    <div className="text-[#fff] pl-1 text-[16px] font-semibold">
                      {user.fullname}
                    </div>
                    <div className="flex items-center space-x-1 text-[14px] text-[#e5e5e5]">
                      <div className="">
                        <img src={bronze} alt="bronze" className="w-[18px]" />
                      </div>
                      <span className="font-medium text-[#9a96a6]">Bronze</span>
                      <span className="bg-[#bdbdbd] w-[1px] h-[13px] mx-2"></span>
                      <span className="w-[20px]">
                        <img src={coinsmall} className="w-full" alt="coin" />
                      </span>
                      <span className="font-normal text-[#ffffff] text-[15px]">
                        {user.count}
                      </span>
                    </div>
                  </div>
                  <div className="text-[#ffce68] font-semibold text-[14px]">+0</div>
                  <div className="flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-borders">
                    <div className="h-[10px] rounded-[8px] bg-btn w-[.5%]"></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="w-full text-center text-[16px] py-12 font-medium">
                You don't have referrals😭
              </p>
            )}
          </div>
        </div>

        <ClaimLeveler claimLevel={claimLevel} setClaimLevel={setClaimLevel} />
      </div>
      <Outlet />
    </Animate>
  );
};

export default Ref;