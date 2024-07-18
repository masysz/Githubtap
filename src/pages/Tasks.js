import React, { useEffect, useState } from 'react';
import Animate from '../Components/Animate';
import coinsmall from "../images/coinsmall.webp";
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import Spinner from '../Components/Spinner';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import youtubeicon from "../images/youtube.png";
import telegramicon from "../images/telegram.png";
import twittericon from "../images/twitter.png";
import facebookicon from "../images/facebook.png";
import instagramicon from "../images/instagram.png";
import tiktokicon from "../images/tiktok.png";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const { loading } = useUser();
  const [isopenModalVisible, setIsopenModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);
  const [hasWatched, setHasWatched] = useState(false); // Assuming you have this state

  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openModal = (task) => {
    setSelectedTask(task);
    setIsopenModalVisible(true);
  };

  const claimPoints = () => {
    setIsClaiming(true);
    // Add logic to claim points
    // After claiming
    setHasClaimed(true);
    setIsClaiming(false);
  };

  const clickLink = () => {
    if (selectedTask && selectedTask.link) {
      window.open(selectedTask.link, '_blank');
      setHasWatched(true); // Assuming you want to update `hasWatched` after the link is opened
    }
  };
  

  const getImage = (icon) => {
    switch (icon) {
      case 'youtube':
        return youtubeicon;
      case 'telegram':
        return telegramicon;
      case 'twitter':
        return twittericon;
      case 'facebook':
        return facebookicon;
      case 'instagram':
        return instagramicon;
      case 'tiktok':
        return tiktokicon;
      default:
        return null; // Return a default image or null if no match is found
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Animate>
          <div className='w-full h-full flex justify-center px-5'>
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
                      <span className="font-semibold text-[17px]">
                        {task.name}
                      </span>
                      <div className="flex items-center space-x-1">
                        <img src={coinsmall} className="w-[20px]" alt="coin" />
                        <span className="font-medium flex items-center text-[15px]">
                          +{task.points}
                        </span>
                      </div>
                    </div>
                  </div>
                  <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]" />
                </button>
              ))}

              {isopenModalVisible && selectedTask && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-fit bg-[#1e2340f7] z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center px-4 py-5 custom-shadow"
                >
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
                      <h3 className="font-semibold text-[32px] py-4">
                        {selectedTask.name}
                      </h3>
                      <p className="pb-6 text-[#9a96a6] text-[16px] text-center">
                        {selectedTask.desc}
                      </p>

                      <div className="w-full flex justify-center pb-6 pt-4">
                        <button
                          disabled={hasWatched}
                          className={`${
                            hasWatched
                              ? 'bg-gray-400 cursor-not-allowed' // Style for disabled state
                              : 'bg-gradient-to-b from-[#f96800] to-[#c30000]'
                          } w-full py-5 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[22px]`}
                        >
                          {hasWatched ? 'Watched' : 'Check'}
                        </button>
                      </div>

                      <div className="flex flex-1 items-center space-x-2">
                        <img src={coinsmall} className="w-[25px]" alt="Coin Icon" />
                        <div className="font-bold text-[26px] flex items-center">
                          +{selectedTask.points}
                        </div>
                      </div>

                      <div className="w-full flex justify-center pb-6 pt-4">
                        <button
                          onClick={claimPoints}
                          disabled={!hasClaimed}
                          className={`${
                            !hasClaimed
                              ? 'bg-btn2 text-[#979797]'
                              : 'bg-gradient-to-b from-[#f96800] to-[#c30000]'
                          } w-full py-5 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[22px]`}
                        >
                          {isClaiming ? 'Claiming...' : hasClaimed ? 'Go ahead!' : 'Claim'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Animate>
      )}
    </>
  );
};

export default Tasks;
