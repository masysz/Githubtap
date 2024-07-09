import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import bronze from "../images/bronze.webp";
import silver from "../images/sliver.webp";
import gold from "../images/gold.webp";
import platinum from "../images/platinum.webp";
import diamond from "../images/diamond.webp";

const Levels = ({ showLevels, setShowLevels }) => {
    const levels = [
        { name: 'bronze', minCount: 0, nextLevel: 'silver', image: bronze, threshold: 500 },
        { name: 'silver', minCount: 10000, nextLevel: 'gold', image: silver, threshold: 10000 },
        { name: 'gold', minCount: 20000, nextLevel: 'platinum', image: gold, threshold: 20000 },
        { name: 'platinum', minCount: 30000, nextLevel: 'diamond', image: platinum, threshold: 30000 },
        { name: 'diamond', minCount: 40000, nextLevel: null, image: diamond, threshold: 40000 },
    ];

    const [count, setCount] = useState(0);
    const [level, setLevel] = useState('bronze');
    const [activeIndex, setActiveIndex] = useState(0);
    const [bronzeUsers, setBronzeUsers] = useState([]);

    useEffect(() => {
        const handleBackButtonClick = () => {
            setShowLevels(false);
        };

        if (showLevels) {
            window.Telegram.WebApp.BackButton.show();
            window.Telegram.WebApp.BackButton.onClick(handleBackButtonClick);
        } else {
            window.Telegram.WebApp.BackButton.hide();
            window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
        }

        return () => {
            window.Telegram.WebApp.BackButton.offClick(handleBackButtonClick);
        };
    }, [showLevels, setShowLevels]);

    useEffect(() => {
        const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;

        if (telegramUserid) {
            const userRef = collection(db, 'telegramUsers');
            const q = query(userRef, where('userId', '==', telegramUserid));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    setCount(data.count);

                    // Update level based on count
                    const currentLevelIndex = levels.findIndex(l => l.name.toLowerCase() === data.level || 'bronze');
                    let newLevelIndex = currentLevelIndex;

                    while (newLevelIndex < levels.length - 1 && data.count >= levels[newLevelIndex + 1].minCount) {
                        newLevelIndex++;
                    }

                    setLevel(levels[newLevelIndex].name.toLowerCase());
                    setActiveIndex(newLevelIndex);
                });
            }, (error) => {
                console.error('Error fetching document: ', error);
            });

            // Clean up the listener on unmount
            return () => unsubscribe();
        }
    }, [levels]);

    useEffect(() => {
        const fetchBronzeUsers = async () => {
            const userRef = collection(db, 'telegramUsers');
            const q = query(userRef, where('level', '==', 'bronze')); // Fetch users where level is 'bronze'
            const querySnapshot = await getDocs(q);
            const users = querySnapshot.docs.map(doc => doc.data());
            setBronzeUsers(users);
        };

        fetchBronzeUsers();
    }, []);

    const handleNextLevel = () => {
        setActiveIndex((prevIndex) => Math.min(prevIndex + 1, levels.length - 1));
    };

    const handlePrevLevel = () => {
        setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const currentLevel = levels[activeIndex];
    const nextLevel = currentLevel.nextLevel ? levels.find(l => l.name.toLowerCase() === currentLevel.nextLevel) : null;
    const progress = nextLevel ? ((count - currentLevel.minCount) / (nextLevel.minCount - currentLevel.minCount)) * 100 : 100;

    return (
        <>
            {showLevels && (
                <div className="fixed z-50 left-0 right-0 top-0 bottom-0 flex justify-center taskbg px-[16px] h-full">
                    <div className="w-full flex flex-col items-center justify-start">
                        <div className="flex w-full flex-col items-center text-center">
                            <h1 className="text-[20px] font-semibold">
                                {currentLevel.name.charAt(0).toUpperCase() + currentLevel.name.slice(1)} League
                            </h1>
                            <p className="text-[#9a96a6] text-[14px] font-medium pt-1 pb-10 px-4">
                                Your number of shares determines the league you enter:
                            </p>
                        </div>
                        <div className="w-full flex justify-between items-center px-6">
                            <MdOutlineKeyboardArrowLeft onClick={handlePrevLevel} size={40} className={`${activeIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"} text-[#e8e8e8]`} />
                            <img src={currentLevel.image} alt={currentLevel.name} className="w-[200px]" />
                            <MdOutlineKeyboardArrowRight onClick={handleNextLevel} size={40} className={`${activeIndex === levels.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"} text-[#e8e8e8]`} />
                        </div>
                        <div className="font-semibold text-[18px] pt-10 pb-5">
                            From {currentLevel.threshold}
                        </div>
                        {nextLevel && count <= 20000 && (
                            <div className="w-full overflow-hidden">
                                <div className="flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-[#403f5c]">
                                    <div className="h-[8px] rounded-[8px] bg-btn" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        )}

                        {/* Display Bronze League users */}
                        {currentLevel.name === 'bronze' && (
                            <div className="w-full mt-4">
                                <h2 className="text-lg font-semibold mb-2">Bronze League Users</h2>
                                <ul>
                                    {bronzeUsers.map(user => (
                                        <li key={user.userId}>{user.username}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Levels;
