import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import bronze from "../images/bronze.webp";
import silver from "../images/sliver.webp";
import gold from "../images/gold.webp";
import platinum from "../images/platinum.webp";
import diamond from "../images/diamond.webp";

const Levels = ({ showLevels, setShowLevels }) => {
    const levelss = {
        bronze: {
            name: 'Bronze',
            minCount: 0,
            nextLevel: 'silver',
            claimCount: 10000,
        },
        silver: {
            name: 'Silver',
            minCount: 10000,
            nextLevel: 'gold',
            claimCount: 100000,
        },
        gold: {
            name: 'Gold',
            minCount: 100000,
            nextLevel: 'platinum',
            claimCount: 0,
        },
        platinum: {
            name: 'Platinum',
            minCount: 200000,
            nextLevel: 'diamond',
            claimCount: 0,
        },
        diamond: {
            name: 'Diamond',
            minCount: 300000,
            nextLevel: null,
            claimCount: 0,
        },
    };

    const [count, setCount] = useState(0);
    const [level, setLevel] = useState('bronze');
    const [activeIndex, setActiveIndex] = useState(0);

    const handleLevels = () => {
        setActiveIndex(prevIndex => Math.min(prevIndex + 1, Object.keys(levelss).length - 1));
    };

    const handPrevleLevels = () => {
        setActiveIndex(prevIndex => Math.max(prevIndex - 1, 0));
    };

    useEffect(() => {
        const handleBackButtonClick = () => {
            setShowLevels(false);
            document.getElementById("footermain").style.zIndex = "";
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
                    setLevel(data.level || 'bronze');
                });
            }, (error) => {
                console.error('Error fetching document: ', error);
            });

            return () => unsubscribe();
        }
    }, []);

    const currentLevel = levelss[level];
    const nextLevel = currentLevel.nextLevel ? levelss[currentLevel.nextLevel] : null;
    const progress = nextLevel ? ((count - currentLevel.minCount) / (nextLevel.minCount - currentLevel.minCount)) * 100 : 100;

    return (
        <>
            {showLevels ? (
                <div className="fixed z-50 left-0 right-0 top-0 bottom-0 flex justify-center taskbg px-[16px] h-full">
                    <div className="w-full flex flex-col items-center justify-start">
                        <div className="flex w-full flex-col items-center text-center">
                            <h1 className="text-[20px] font-semibold">
                                {currentLevel.name} League
                            </h1>
                            <p className="text-[#9a96a6] text-[14px] font-medium pt-1 pb-10 px-4">
                                Your number of shares determines the league you enter:
                            </p>
                        </div>
                        <div className="w-full flex justify-between items-center px-6">
                            <MdOutlineKeyboardArrowLeft onClick={handPrevleLevels} size={40} className={`${activeIndex === 0 ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"} text-[#e8e8e8]`} />
                            <img src={bronze} alt="bronze" className={`${activeIndex === 0 ? "block" : "hidden"} w-[200px]`} />
                            <MdOutlineKeyboardArrowRight onClick={handleLevels} size={40} className={`${activeIndex === Object.keys(levelss).length - 1 ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"} text-[#e8e8e8]`} />
                            <img src={silver} alt="silver" className={`${activeIndex === 1 ? "block" : "hidden"} w-[200px]`} />
                            <img src={gold} alt="gold" className={`${activeIndex === 2 ? "block" : "hidden"} w-[200px]`} />
                            <img src={platinum} alt="platinum" className={`${activeIndex === 3 ? "block" : "hidden"} w-[200px]`} />
                            <img src={diamond} alt="diamond" className={`${activeIndex === 4 ? "block" : "hidden"} w-[200px]`} />
                        </div>
                        <div className="font-semibold text-[18px] pt-10 pb-5">
                            From {currentLevel.minCount}
                        </div>
                        <div className={`${activeIndex === 0 ? "block" : "hidden"} w-full overflow-hidden`}>
                            {nextLevel && count <= nextLevel.claimCount && (
                                <div className="flex w-full mt-2 p-[4px] items-center bg-energybar rounded-[10px] border-[1px] border-[#403f5c]">
                                    <div className="h-[8px] rounded-[8px] bg-btn" style={{ width: `${progress}%` }} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};

export default Levels;
