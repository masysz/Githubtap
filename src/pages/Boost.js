import React, { useEffect, useState } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import coinsmall from "../images/coinsmall.webp";
import flash from "../images/flash.webp";
import boost from "../images/boost.webp";
import { db } from "../firebase";
import { collection, getDocs } from "@firebase/firestore";
import Spinner from "../Components/Spinner";

const Boost = () => {
    const [count, setCount] = useState(0);
    const [username, setUsername] = useState("");
    const [idme, setIdme] = useState("");
    const [loading, setLoading] = useState(true);
    const [claimLevel, setClaimLevel] = useState(false);

    useEffect(() => {
        const telegramUsername = window.Telegram.WebApp.initDataUnsafe?.user?.username;
        const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;
        
        if (telegramUsername) {
            setUsername(telegramUsername);
        }
        if (telegramUserid) {
            setIdme(telegramUserid);
            fetchCountFromFirestore(telegramUserid).then((userCount) => {
                setCount(userCount);
                setLoading(false);
            });
        }
    }, []);

    const fetchCountFromFirestore = async (userid) => {
        try {
            const userRef = collection(db, "telegramUsers");
            const querySnapshot = await getDocs(userRef);
            let userCount = 0;
            querySnapshot.forEach((doc) => {
                if (doc.data().userId === userid) {
                    userCount = doc.data().count;
                }
            });
            return userCount;
        } catch (e) {
            console.error("Error fetching document: ", e);
            return 0;
        }
    };

    const formattedCount = new Intl.NumberFormat().format(count).replace(/,/g, " ");

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <Animate>
                    <div className="w-full justify-center flex-col space-y-3 px-5">
                        <div className="fixed top-0 left-0 right-0 pt-8 px-5">
                            <div className="w-full items-center justify-center pb-3 flex pt-2">
                                <h2 className="text-[#9d99a9] text-[20px] font-medium">
                                    Your Share balance
                                </h2>
                            </div>
                            <div className="flex space-x-1 ml-[-8px] justify-center items-center">
                                <div className="w-[50px] h-[50px]">
                                    <img src={coinsmall} className="w-full" alt="coin" />
                                </div>
                                <h1 className="text-[#fff] -mb-2 text-[42px] font-extrabold">
                                    {loading ? (
                                        <div className="bg-[#97979764] animate-pulse w-[30px] h-[10px]"></div>
                                    ) : (
                                        <>{formattedCount}</>
                                    )}
                                </h1>
                            </div>
                            <div className="bg-borders w-full px-5 h-[1px] !mt-3 !mb-5"></div>
                            <div className="w-full flex flex-col">
                                <h3 className="text-[18px] font-semibold pb-4">
                                    Your daily boosters:
                                </h3>
                                <div className="w-full flex justify-between items-center">
                                    <div onClick={() => setClaimLevel(true)} className="bg-cards w-[48%] border-[1px] border-borders">
                                        <div className="w-[40px] flex items-center justify-center">
                                            <img src={boost} alt="boost" className="w-full" />
                                        </div>
                                        <div className="flex flex-l flex-col">
                                            <span className="font-semibold tapguru">
                                                Tapping Guru
                                            </span>
                                            <span className="font-medium tapguru2">3/3</span>
                                        </div>
                                    </div>
                                    <div onClick={() => setClaimLevel(true)} className="bg-cards w-[48%] border-[1px] border-borders">
                                        <div className="w-[40px] flex items-center justify-center">
                                            <img src={flash} alt="flash" className="w-[26px]" />
                                        </div>
                                        <div className="flex flex-l flex-col">
                                            <span className="font-semibold tapguru">
                                                Full Tank
                                            </span>
                                            <span className="font-medium tapguru2">3/3</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col pt-4">
                                    <h3 className="text-[18px] font-semibold">
                                        Boosters:
                                    </h3>
                                </div>
                                <div className="w-full flex flex-col !mt-[292px] h-[68vh] pt-2 pb-[6px]">
                                    <div className="flex alltaskcontainer flex-col w-full space-y-2 pb-2">
                                        <div onClick={() => setClaimLevel(true)} className="bg-cards rounded-[10px]">
                                            {/* Additional Booster Details Here */}
                                        </div>
                                    </div>
                                </div>
                                <Outlet />
                            </div>
                        </div>
                    </div>
                </Animate>
            )}
        </>
    );
};

export default Boost;
