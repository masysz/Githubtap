import React, { useEffect, useState } from 'react';
import coinsmall from "../images/coinsmall.webp";
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import youtubeicon from "../images/youtube.png";
import telegramicon from "../images/telegram.png";
import twittericon from "../images/twitter.png";
import facebookicon from "../images/facebook.png";
import instagramicon from "../images/instagram.png";
import tiktokicon from "../images/tiktok.png";
import { useUser } from "../context/userContext";
import congratspic from "../images/celebrate.gif";
import { IoCheckmarkCircle } from 'react-icons/io5';

const JoinTelegram = () => {
  const [tasks, setTasks] = useState([]);
  const { tapBalance, setTapBalance, balance, setBalance, id, claimedWatch, setClaimedWatch } = useUser();
  const [isopenModalVisible, setIsopenModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [watchedTasks, setWatchedTasks] = useState({});
  const [congrats, setCongrats] = useState(false);
  const [showCheckButton, setShowCheckButton] = useState(false);
  const [showDoneButton, setShowDoneButton] = useState(false);
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'tgtasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);

      const watchedTasksData = {};
      tasksData.forEach(task => {
        watchedTasksData[task.id] = claimedWatch.includes(task.id);
      });
      setWatchedTasks(watchedTasksData);
    });

    return () => unsubscribe();
  }, [claimedWatch]);

  const openModal = (task) => {
    setSelectedTask(task);
    setIsopenModalVisible(true);
  };

  const claimPoints = async () => {
    if (!watchedTasks[selectedTask.id]) {
      console.error('Task not watched yet.');
      return;
    }
    
    setIsClaiming(true);
    
    try {
      const newBalance = balance + selectedTask.points;
      const newBalanceTap = tapBalance + selectedTask.points;
      
      const userRef = doc(db, 'telegramUsers', id);
      await updateDoc(userRef, {
        balance: newBalance,
        tapBalance: newBalanceTap,
        claimedWatch: [...claimedWatch, selectedTask.id],
      });
      
      setBalance(newBalance);
      setTapBalance(newBalanceTap);
      setClaimedWatch([...claimedWatch, selectedTask.id]);
      setWatchedTasks(prev => ({ ...prev, [selectedTask.id]: true }));
      setCongrats(true);
      
      setTimeout(() => {
        setCongrats(false);
      }, 4000);
      
      setIsopenModalVisible(false);
    } catch (error) {
      console.error('Error claiming reward:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  const clickLink = () => {
    if (selectedTask && selectedTask.link) {
      window.open(selectedTask.link, '_blank');
      setWatchedTasks(prev => ({ ...prev, [selectedTask.id]: true }));
      setShowCheckButton(true);
    }
  };

  const handleVerify = async () => {
    setShowCheckButton(false);
    setMessage("Verifying...");

    const response = await fetch(
      `https://api.telegram.org/bot7436444125:AAGB8IwBNOvRbpW-AjR0HPvMOC0qGSTnILU/getChatMember?chat_id=@geto_spirit_announcement&user_id=${id}`
    );
    const data = await response.json();

    if (data.ok && (data.result.status === "member" || data.result.status === "administrator" || data.result.status === "creator")) {
      setIsVerified(true);
      setShowDoneButton(true);
      setMessage("Verification successful!");
    } else {
      setShowCheckButton(true);
      setMessage("Please join the Telegram channel first before you can claim this task bonus.");
    }

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const getImage = (icon) => {
    switch (icon) {
      case 'youtube': return youtubeicon;
      case 'telegram': return telegramicon;
      case 'twitter': return twittericon;
      case 'facebook': return facebookicon;
      case 'instagram': return instagramicon;
      case 'tiktok': return tiktokicon;
      default: return null;
    }
  };

  const formatNumber = (num) => {
    if (num < 100000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    } else if (num < 1000000) {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    // } else {
    //   return (num / 1000000).toFixed(3).replace(".", ".") + " M";
    } else {
      return new Intl.NumberFormat().format(num).replace(/,/g, " ");
    }
  };

  return (
    <div className='w-full h-full flex flex-col space-y-5'>
      <div className="w-full flex flex-col space-y-3 overflow-y-auto max-h-[90vh]">
        {tasks.map(task => (
          <button
            key={task.id}
            onClick={() => openModal(task)}
            className="bg-cards rounded-[10px] px-[14px] py-[8px] flex justify-between items-center"
          >
            <div className="flex flex-1 items-center space-x-2">
              <img src={getImage(task.icon)} className="w-[35px]" alt={task.name} />
              <div className="flex flex-col space-y-1 text-left">
                <span className="font-semibold text-[17px]">{task.name}</span>
                <div className="flex items-center space-x-1">
                  <img src={coinsmall} className="w-[20px]" alt="coin" />
                  <span className="font-medium flex items-center text-[15px]">+{formatNumber(task.points)}</span>
                </div>
              </div>
            </div>
            <div>
              {claimedWatch.includes(task.id) ? (
                <IoCheckmarkCircle className="w-[20px] h-[20px] text-[#5bd173] mt-[2px]" />
              ) : (
                <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]" />
              )}
            </div>
          </button>
        ))}

        {isopenModalVisible && selectedTask && (
          <div className="absolute bottom-0 left-0 right-0 h-fit bg-[#1e2340f7] z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center px-4 py-5 custom-shadow">
            <div className="w-full flex flex-col justify-between py-8">
              <button
                onClick={() => setIsopenModalVisible(false)}
                className="flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]"
              >
                <IoClose size={24} className="text-[#9a96a6]" />
              </button>

              <div className="w-full flex justify-center flex-col items-center">
                <div className="w-[120px] h-[120px] rounded-[25px] bg-[#252e57] flex items-center justify-center shadow-lg shadow-red/50">
                  <img alt="claim" src={getImage(selectedTask.icon)} className="w-[80px]" />
                </div>
                <h3 className="font-semibold text-[32px] py-4">{selectedTask.name}</h3>
                <p className="pb-6 text-[#9a96a6] text-[16px] text-center">{selectedTask.desc}</p>

                <div className="w-full flex justify-center pb-6 pt-4">
                  {!watchedTasks[selectedTask.id] && (
                    <button
                      onClick={clickLink}
                      className="bg-gradient-to-b from-[#f96800] to-[#c30000] w-full py-5 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[22px]"
                    >
                      {selectedTask?.buttonLabel || 'Watch'}
                    </button>
                  )}

                  {watchedTasks[selectedTask.id] && !isVerified && (
                    <>
                      {showCheckButton ? (
                        <button
                          onClick={handleVerify}
                          className="bg-gradient-to-b from-[#f96800] to-[#c30000] w-full py-5 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[22px]"
                        >
                          Check
                        </button>
                      ) : (
                        <div className="text-center"></div>
                      )}
                    </>
                  )}

                  {isVerified && showDoneButton && (
                    <button
                      className="bg-gray-400 w-full py-5 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[22px]"
                      disabled
                    >
                      Completed
                    </button>
                  )}
                </div>

                {message && <div className="text-center mt-2">{message}</div>}

                <div className="flex flex-1 items-center space-x-2">
                  <img src={coinsmall} className="w-[25px]" alt="Coin Icon" />
                  <div className="font-bold text-[26px] flex items-center">+{formatNumber(selectedTask.points)}</div>
                </div>

                <div className="w-full flex justify-center pb-6 pt-4">
                  <button
                    onClick={claimPoints}
                    disabled={!watchedTasks[selectedTask.id] || isClaiming || claimedWatch.includes(selectedTask.id) || !isVerified}
                    className={`${
                      !watchedTasks[selectedTask.id] || isClaiming || claimedWatch.includes(selectedTask.id) || !isVerified
                        ? 'bg-btn2 text-[#979797]'
                        : 'bg-gradient-to-b from-[#f96800] to-[#c30000]'
                    } w-full py-5 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[22px]`}
                  >
                    {isClaiming ? 'Claiming...' : claimedWatch.includes(selectedTask.id) ? 'Claimed' : 'Claim'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-full absolute top-[-35px] left-0 right-0 flex justify-center z-20 pointer-events-none select-none">
          {congrats ? <img src={congratspic} alt="congrats" className="w-[80%]" /> : null}
        </div>

        <div className={`${congrats === true ? "visible bottom-6" : "invisible bottom-[-10px]"} z-[60] ease-in duration-300 w-full fixed left-0 right-0 px-4`}>
          <div className="w-full text-[#54d192] flex items-center space-x-2 px-4 bg-[#121620ef] h-[50px] rounded-[8px]">
            <IoCheckmarkCircle size={24} />
            <span className="font-medium">{selectedTask?.succesLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinTelegram;