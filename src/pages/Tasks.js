import React, { useEffect, useState } from 'react';
import Animate from '../Components/Animate';
import { Outlet } from 'react-router-dom';
import coinsmall from "../images/coinsmall.webp";
import taskbook from "../images/taskbook.webp";
import bronze from "../images/bronze.webp";
import silver from "../images/silver.webp";
import gold from "../images/gold.webp";
import ref from "../images/ref.webp";
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import Spinner from '../Components/Spinner';
import TaskOne from '../Components/TaskOne';
import ClaimLeveler from '../Components/ClaimLeveler';
import Levels from '../Components/Levels';
import { IoCheckmarkSharp } from "react-icons/io5";
import congrats from "../images/celebrate.gif";

const Tasks = () => {
    const levels = {
        bronze: {
            name: 'Bronze',
            minCount: 0,
            nextLevel: 'silver',
            claimCount: 10000,
        },
        silver: {
            name: 'Silver',
            minCount: 400000,
            nextLevel: 'gold',
            claimCount: 200000,
        },
        gold: {
            name: 'Gold',
            minCount: 600000,
            nextLevel: 'platinum',
            claimCount: 30000,
        },
        platinum: {
            name: 'Platinum',
            minCount: 800000,
            nextLevel: null,
            claimCount: 50000,
        },
    };

    const [count, setCount] = useState(0);
    const [username, setUsername] = useState("");
    const [idme, setIdme] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [currentLevel, setCurrentLevel] = useState('bronze');
    const [claimLevel, setClaimLevel] = useState(false);
    const [showLevels, setShowLevels] = useState(false);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [taskCompleted2, setTaskCompleted2] = useState(false);
    const [message, setMessage] = useState("");
    const taskID = "task_3100";
    const taskID2 = "task_406";

    const [activeIndex, setActiveIndex] = useState(1);

    const handleMenu = (index) => {
        setActiveIndex(index);
    };

    const taskOne = () => {
        setShowModal(true);
        document.getElementById("footermain").style.zIndex = "50";
    };

    const taskTwo = () => {
        setShowModal2(true);
        document.getElementById("footermain").style.zIndex = "50";
    };

    useEffect(() => {
        const telegramUsername = window.Telegram.WebApp.initDataUnsafe?.user?.username;
        const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;

        if (telegramUsername) {
            setUsername(telegramUsername);
        }
        if (telegramUserid) {
            setIdme(telegramUserid);
        }

        checkTaskCompletion(telegramUserid, taskID).then((completed) => {
            setTaskCompleted(completed);
            if (completed) {
                setMessage("");
            }
        });

        checkTaskCompletion(telegramUserid, taskID2).then((completed) => {
            setTaskCompleted2(completed);
            if (completed) {
                setMessage("");
            }
        });

        if (telegramUserid) {
            const userRef = collection(db, 'telegramUsers');
            const q = query(userRef, where('userId', '==', telegramUserid));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    setCount(data.count);
                    setCurrentLevel(data.level || 'bronze');
                    setLoading(false);
                });
            }, (error) => {
                console.error('Error fetching document: ', error);
                setLoading(false);
            });

            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, []);

    const checkTaskCompletion = async (userid, taskId) => {
        try {
            const userTaskDocRef = doc(db, 'userTasks', `${userid}_${taskId}`);
            const docSnap = await getDoc(userTaskDocRef);
            if (docSnap.exists()) {
                return docSnap.data().completed;
            } else {
                return false;
            }
        } catch (e) {
            console.error('Error checking task completion: ', e);
            return false;
        }
    };

    const levelsAction = () => {
        setShowLevels(true);
    };

    const claimSilverLevel = () => {
        setClaimLevel(true);
    };

    const formattedCount = new Intl.NumberFormat().format(count).replace(/,/g, " ");
    const currentLevelDetails = levels[currentLevel];
    const nextLevel = currentLevelDetails.nextLevel ? levels[currentLevelDetails.nextLevel] : null;
    const progress = nextLevel ? ((count - currentLevelDetails.minCount) / (nextLevel.minCount - currentLevelDetails.minCount)) * 100 : 100;

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <Animate>
                    <div className='w-full justify-center flex-col space-y-3 px-5'>
                        <div className='fixed top-0 left-0 right-0 pt-8 px-5'>
                            <div className="flex space-x-2 justify-center items-center relative">
                                <div id="congrat" className='opacity-0 invisible w-[80%] absolute pl-10 ease-in-out duration-500 transition-all'>
                                    <img src={congrats} alt="congrats" className="w-full" />
                                </div>
                                <div className="w-[50px] h-[50px]">
                                    <img src={coinsmall} className="w-full" alt="coin" />
                                </div>
                                <h1 className="text-[#fff] text-[42px] font-extrabold">
                                    {formattedCount}
                                </h1>
                            </div>
                            <div onClick={levelsAction} className="w-full flex ml-[6px] space-x-1 items-center justify-center">
                                <img src={bronze} className="w-[30px] h-[30px] relative" alt="bronze" />
                                <h2 className="text-[#9d99a9] text-[20px] font-medium">{currentLevelDetails.name}</h2>
                                <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#9d99a9] mt-[2px]" />
                            </div>
                            <div className='bg-borders w-full px-5 h-[1px] !mt-5 !mb-5'></div>
                            <div className='w-full border-[1px] border-borders rounded-[10px] p-1 flex items-center'>
                                <div onClick={() => handleMenu(1)} className={`${activeIndex === 1 ? 'bg-btn text-[10px] border border-[#452e77]' : 'bg-[#271a40]'} w-full p-2 text-white text-[12px] flex justify-center rounded-[10px] transition-all ease-in-out duration-700`}>
                                    Special
                                </div>
                                <div onClick={() => handleMenu(2)} className={`${activeIndex === 2 ? 'bg-btn text-[10px] border border-[#452e77]' : 'bg-[#271a40]'} w-full p-2 text-white text-[12px] flex justify-center rounded-[10px] transition-all ease-in-out duration-700`}>
                                    Leagues
                                </div>
                                <div onClick={() => handleMenu(3)} className={`${activeIndex === 3 ? 'bg-btn text-[10px] border border-[#452e77]' : 'bg-[#271a40]'} w-full p-2 text-white text-[12px] flex justify-center rounded-[10px] transition-all ease-in-out duration-700`}>
                                    Ref Tasks
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex flex-col items-center'>
                            {activeIndex === 1 && (
                                <>
                                    <button onClick={taskOne} disabled={taskCompleted} className={`bg-taskbtn mt-5 ${taskCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purples text-white transition-all ease-in-out duration-700'} p-5 rounded-[10px] flex justify-between w-full`}>
                                        <div className="flex items-center space-x-3">
                                            <img src={taskbook} className="w-[40px] h-[40px]" alt="task book" />
                                            <span className='text-left'>
                                                <h2 className="text-[20px] text-white">Task 1</h2>
                                                <p className="text-[14px] text-[#9d99a9]">Click to claim 10000 coins</p>
                                            </span>
                                        </div>
                                        {taskCompleted ? (
                                            <div className="text-right flex items-center">
                                                <span className='text-[16px] text-[#9d99a9]'>Completed</span>
                                                <IoCheckmarkSharp className='ml-2 text-[20px] text-[#9d99a9]' />
                                            </div>
                                        ) : (
                                            <div className="text-right flex items-center">
                                                <span className='text-[16px] text-white'>Click to complete</span>
                                            </div>
                                        )}
                                    </button>
                                    <button onClick={taskTwo} disabled={taskCompleted2} className={`bg-taskbtn mt-5 ${taskCompleted2 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purples text-white transition-all ease-in-out duration-700'} p-5 rounded-[10px] flex justify-between w-full`}>
                                        <div className="flex items-center space-x-3">
                                            <img src={ref} className="w-[40px] h-[40px]" alt="referral task" />
                                            <span className='text-left'>
                                                <h2 className="text-[20px] text-white">Task 2</h2>
                                                <p className="text-[14px] text-[#9d99a9]">Invite 5 friends to claim 200000 coins</p>
                                            </span>
                                        </div>
                                        {taskCompleted2 ? (
                                            <div className="text-right flex items-center">
                                                <span className='text-[16px] text-[#9d99a9]'>Completed</span>
                                                <IoCheckmarkSharp className='ml-2 text-[20px] text-[#9d99a9]' />
                                            </div>
                                        ) : (
                                            <div className="text-right flex items-center">
                                                <span className='text-[16px] text-white'>Click to complete</span>
                                            </div>
                                        )}
                                    </button>
                                </>
                            )}
                            {activeIndex === 2 && (
                                <>
                                    <button onClick={claimSilverLevel} className='bg-taskbtn mt-5 hover:bg-purples text-white transition-all ease-in-out duration-700 p-5 rounded-[10px] flex justify-between w-full'>
                                        <div className="flex items-center space-x-3">
                                            <img src={silver} className="w-[40px] h-[40px]" alt="silver" />
                                            <span className='text-left'>
                                                <h2 className="text-[20px] text-white">Claim Silver Level</h2>
                                                <p className="text-[14px] text-[#9d99a9]">Claim silver level and get 200000 coins</p>
                                            </span>
                                        </div>
                                    </button>
                                    <div className='w-full text-center'>
                                        <h3 className='text-white text-[18px] mt-4'>Level Progress</h3>
                                        <div className='bg-[#271a40] rounded-[10px] p-3 mt-3'>
                                            <div className='flex items-center justify-between'>
                                                <span className='text-[#9d99a9] text-[14px]'>Current Level</span>
                                                <span className='text-[#fff] text-[16px]'>{currentLevelDetails.name}</span>
                                            </div>
                                            <div className='flex items-center justify-between mt-3'>
                                                <span className='text-[#9d99a9] text-[14px]'>Next Level</span>
                                                <span className='text-[#fff] text-[16px]'>{nextLevel ? nextLevel.name : 'Max Level'}</span>
                                            </div>
                                            <div className='mt-4 w-full bg-[#452e77] h-[8px] rounded-[10px]'>
                                                <div className={`bg-[#00bcd4] h-[8px] rounded-[10px]`} style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            {activeIndex === 3 && (
                                <>
                                    <div className='w-full text-center'>
                                        <h3 className='text-white text-[18px] mt-4'>Refer Tasks</h3>
                                        <div className='bg-[#271a40] rounded-[10px] p-3 mt-3'>
                                            <p className='text-[#9d99a9] text-[14px]'>Invite your friends and complete referral tasks to earn more coins!</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {showModal && <TaskOne onClose={() => setShowModal(false)} />}
                    {showModal2 && <TaskTwo onClose={() => setShowModal2(false)} />}
                    {showLevels && <Levels onClose={() => setShowLevels(false)} />}
                    {claimLevel && <ClaimLeveler onClose={() => setClaimLevel(false)} />}
                </Animate>
            )}
            <Outlet />
        </>
    );
};

export default Tasks;
