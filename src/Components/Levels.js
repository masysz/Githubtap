import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import bronze from "../images/bronze.webp";
import silver from "../images/silver.webp";
import gold from "../images/gold.webp";
import platinum from "../images/platinum.webp";
import diamond from "../images/diamond.webp";
import coinsmall from "../images/coinsmall.webp";

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
    const [usersByLevel, setUsersByLevel] = useState({});

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

            return () => unsubscribe();
        }
    }, [levels]);

    useEffect(() => {
        const fetchUsersByLevel = async () => {
            const usersByLevelData = {};

            // Fetch users for each level
            for (let i = 0; i < levels.length; i++) {
                const levelName = levels[i].name;
                const userRef = collection(db, 'telegramUsers');
                const q = query(userRef, where('level', '==', levelName));

                try {
                    const querySnapshot = await getDocs(q);
                    usersByLevelData[levelName] = querySnapshot.docs.map(doc => doc.data());
                } catch (error) {
                    console.error(`Error fetching users for level ${levelName}:`, error);
                    usersByLevelData[levelName] = [];
                }
            }

            setUsersByLevel(usersByLevelData);
        };

        fetchUsersByLevel();
    }, [levels]);

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

                        {/* Display Leaderboards for each level */}
                        {levels.map((lvl, index) => (
                            <div key={index} className={`${lvl.name === currentLevel.name ? 'block' : 'hidden'}`}>
                                <h3 className="text-[22px] font-semibold pb-[16px]">{lvl.name.charAt(0).toUpperCase() + lvl.name.slice(1)} Leaderboard:</h3>
                                <div className="w-full flex flex-col space-y-3">
                                    {usersByLevel[lvl.name]?.length > 0 ? (
                                        usersByLevel[lvl.name].map((user, idx) => (
                                            <div key={idx} className="bg-cards rounded-[10px] p-[14px] flex flex-wrap justify-between items-center">
                                                <div className="flex flex-1 flex-col space-y-1">
                                                    <div className="text-[#fff] pl-1 text-[16px] font-semibold">
                                                        {user.fullname}
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-[14px] text-[#e5e5e5]">
                                                        <div>
                                                            <img src={lvl.image} alt={lvl.name} className="w-[18px]" />
                                                        </div>
                                                        <span className="font-medium text-[#9a96a6]">
                                                            {lvl.name.charAt(0).toUpperCase() + lvl.name.slice(1)}
                                                        </span>
                                                        <span className="bg-[#bdbdbd] w-[1px] h-[13px] mx-2"></span>
                                                        {/* Assuming you have an icon for coins */}
                                                        <span className="w-[20px]">
                                                            <img src={coinsmall} className="w-full" alt="coin" />
                                                        </span>
                                                        <span className="font-normal text-[#ffffff] text-[15px]">
                                                            {user.count}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No users found in {lvl.name.charAt(0).toUpperCase() + lvl.name.slice(1)} League</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default Levels;
