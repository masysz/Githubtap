import React, { useEffect, useState } from "react";
import { TonConnectButton, useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import tonwallet from "../images/tonwallet.webp";
import getocoin from "../images/getocoin.webp";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoClose, IoCheckmarkCircle } from "react-icons/io5";
import { useUser } from "../context/userContext";
import { db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import "../App.css"; // Pastikan file CSS Anda terimport
import Spinner from '../Components/Spinner';
import Animate from '../Components/Animate';

const Connect = () => {
    const { loading, address, id } = useUser();
    const [isConnectModalVisible, setIsConnectModalVisible] = useState(false);
    const [isHistory, setIsHistory] = useState(false);
    const [isCopied, setIsCopied] = useState(false); // State untuk menandai apakah alamat sudah dicopy
    const userFriendlyAddress = useTonAddress();
    const [tonConnectUI] = useTonConnectUI();
    const [firestoreAddress, setFirestoreAddress] = useState("");
    const [claimRequests, setClaimRequests] = useState([]);

    useEffect(() => {
        if (userFriendlyAddress) {
            saveWalletToFirestore(id, userFriendlyAddress).then(() => {
                console.log('Wallet address saved to Firestore.');
            });
        }
    }, [userFriendlyAddress, id]);

    const saveWalletToFirestore = async (id, address) => {
        try {
            const userWallet = doc(db, 'telegramUsers', id);
            await updateDoc(userWallet, {
                address: address,
            });
            console.log('Wallet saved to Firestore.');
        } catch (e) {
            console.error("Error saving wallet: ", e);
        }
    };

    const handleDisconnect = async () => {
        try {
            await tonConnectUI.disconnect();
            console.log('Disconnected from wallet.');
        } catch (e) {
            console.error("Error disconnecting wallet: ", e);
        }
    };

    const fetchAddressFromFirestore = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'telegramUsers', id));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setFirestoreAddress(data.address || "");
          }
        } catch (error) {
          console.error("Error fetching address from Firestore:", error);
        }
      };

      useEffect(() => {
        fetchAddressFromFirestore();
      }, [id]);

    const handleCopyAddress = async () => {
  const addressToCopy = firestoreAddress || userFriendlyAddress;
  navigator.clipboard.writeText(addressToCopy);
        setIsCopied(true);

        // Reset copied status after 3 seconds
        setTimeout(() => {
            setIsCopied(false);
        }, 3000);
};

const fetchClaimRequests = async () => {
    try {
      const userRef = doc(db, 'telegramUsers', id.toString());
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setClaimRequests(data.claimRequests || []);
      }
    } catch (error) {
      console.error('Error fetching claim requests:', error);
    }
  };

  useEffect(() => {
    if (isHistory) {
      fetchClaimRequests();
    }
  }, [isHistory]);

  const formatClaimAddress = (address) => {
    if (!address) return '';
    const start = address.substring(0, 5);
    const end = address.substring(address.length - 5);
    return `${start}...${end}`;
  };

    return (
        <>
        {loading ? (
        <Spinner />
      ) : (
        <Animate>
            <div className="w-full justify-center flex-col space-y-3 px-5">
                        <div className="flex flex-col w-full">
                            <div className="w-full items-center justify-center pb-2 flex">
                                <img src={getocoin} className="w-[200px]" />
                            </div>
                            <div className="flex space-x-1 ml-[-8px] justify-center items-center">
                                <h1 className="text-[#fff] text-[18px] font-semibold text-center">
                                Connect your TON wallet to receive the airdrop distribution.
                                </h1>
                            </div>
                            <div className="bg-borders w-full px-5 h-[1px] !mt-3 !mb-5"></div>
                            <div onClick={() => setIsConnectModalVisible(true)} className="bg-[#3cb8f7] rounded-[10px] p-[14px] flex justify-between items-center mx-[20px]">
                                <div className="flex flex-1 items-center space-x-2">
                                    <div>
                                        <img src={tonwallet} alt="tonwallet" className="w-[50px]" />
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-semibold">Connect your TON wallet</span>
                                    </div>
                                </div>
                                <div>
                                    {userFriendlyAddress ? (
                                        <IoCheckmarkCircle className="w-[20px] h-[20px] text-[#5bd173] mt-[2px]" />
                                    ) : (
                                        <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]" />
                                    )}
                                </div>
                            </div>
                        </div>

                            <div onClick={() => setIsHistory(true)} className="bg-[#3cb8f7] rounded-[10px] p-[14px] flex justify-between items-center mx-[20px]">
                                <div className="flex flex-1 items-center space-x-2">
                                    <div>
                                        <img src={tonwallet} alt="tonwallet" className="w-[50px]" />
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <span className="font-semibold">Reward History</span>
                                    </div>
                                </div>
                            </div>


                        {/* Connect Modal */}
                        <div className={`${isConnectModalVisible ? "visible" : "invisible"} absolute bottom-0 left-0 right-0 h-fit bg-[#1e2340f7] z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center px-4 py-5 custom-shadow`}>
                            <div className="w-full flex flex-col justify-between py-8">
                                <button onClick={() => setIsConnectModalVisible(false)} className="flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]">
                                    <IoClose size={24} className="text-[#9a96a6]" />
                                </button>
                                <div className="w-full flex justify-center flex-col items-center">
                                    <div className="w-[120px] h-[120px] rounded-[25px] bg-[#252e57] flex items-center justify-center">
                                        <img alt="claim" src={tonwallet} className="w-[80px]" />
                                    </div>
                                    <h3 className="font-semibold text-[32px] py-4">Connect your TON wallet</h3>
                                    <p className="pb-6 text-[#9a96a6] text-[16px] text-center">
                                        Don't forget to connect your TON wallet <br />
                                        Distribution token soon.
                                    </p>
                                    <div className="w-full flex justify-center pb-6 pt-4">
                                        {!userFriendlyAddress && (
                                            <button className="w-full py-5 px-3 flex items-center justify-center text-center rounded-[12px] font-semibold text-[22px]">
                                                <TonConnectButton />
                                            </button>
                                        )}
                                    </div>
                                    {userFriendlyAddress && (
                                        <div className="flex items-center mt-4 space-x-2">
                                            <button
                                                onClick={handleCopyAddress}
                                                className="p-3 rounded-[12px] bg-gray-200 flex items-center justify-center"
                                            >
                                                {isCopied ? "Copied" : "Copy"}
                                            </button>
                                            <input
                                                type="text"
                                                value={userFriendlyAddress}
                                                readOnly
                                                className="flex-grow p-3 text-center rounded-[12px] bg-gray-200"
                                            />
                                            <button
                                                onClick={handleDisconnect}
                                                className="p-3 rounded-[12px] bg-gray-200 flex items-center justify-center"
                                            >
                                                <IoClose size={24} className="text-[#9a96a6]" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* History Modal */}
                        <div className={`${isHistory ? "visible" : "invisible"} fixed bottom-0 left-0 right-0 h-screen bg-[#1e2340f7] z-[100] rounded-tl-[20px] rounded-tr-[20px] flex flex-col justify-between px-4 py-5 custom-shadow`}>
                            <button onClick={() => setIsHistory(false)} className="flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]">
                                <IoClose size={24} className="text-[#9a96a6]" />
                            </button>
                        <div className="w-full flex flex-col flex-grow py-8">
                        <div className="w-full flex flex-col">
          <h2 className="font-semibold text-[24px] py-4 text-center">Claim Request History</h2>
          <div className="w-full max-h-[500px] overflow-y-auto p-4">
  {claimRequests.length > 0 ? (
    <ul className="w-full">
      {claimRequests.map((request, index) => (
        <li
          key={index}
          className="bg-gradient-to-b from-[#f96800] to-[#c30000] p-4 mb-2 rounded-lg shadow-md"
        >
          <p className="font-medium text-[18px]">Claim Status: {request.claimBoxStatus}</p>
          <p className="text-[16px]">Claim Amount: {request.claimTon} USDT</p>
          <p className="text-[16px]">Address: {formatClaimAddress(request.address)}</p>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-[#9a96a6] text-[16px]">No claim requests found.</p>
  )}
</div>

        </div>
                        </div>
                            </div>

                    </div>
                </Animate>
        )}
        </>
    );
};

export default Connect;
