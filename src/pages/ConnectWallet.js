import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { TonConnectButton } from "@tonconnect/ui-react";
import tonwallet from "../images/tonwallet.png";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { IoClose } from "react-icons/io5";

const Connect = () => {
  const [isConnectModalVisible, setIsConnectModalVisible] = useState(false);

  return (
    <>
      <div className="w-full flex flex-col h-[50vh] pt-2 pb-[60px] overflow-y-auto">
        <div className="flex alltaskscontainer flex-col w-full space-y-2 pb-20">
          <button
            onClick={() => setIsConnectModalVisible(true)}
            className="bg-cards rounded-[10px] px-[14px] py-[8px] flex justify-between items-center"
          >
            <div className="flex flex-1 items-center space-x-2">
              <div>
                <img src={tonwallet} alt="connect" className="w-[35px]" />
              </div>
              <div className="flex flex-col space-y-1 text-left">
                <span className="font-semibold text-[17px]">
                  Connect your TON wallet
                </span>
              </div>
            </div>
            <div>
              <MdOutlineKeyboardArrowRight className="w-[20px] h-[20px] text-[#e0e0e0] mt-[2px]" />
            </div>
          </button>
        </div>
      </div>

      {/* Connect Modal */}
      <div
        className={`${
          isConnectModalVisible ? "visible" : "invisible"
        } absolute bottom-0 left-0 right-0 h-fit bg-[#1e2340f7] z-[100] rounded-tl-[20px] rounded-tr-[20px] flex justify-center px-4 py-5`}
      >
        <div className="w-full flex flex-col justify-between py-8">
          <button
            onClick={() => setIsConnectModalVisible(false)}
            className="flex items-center justify-center absolute right-8 top-8 text-center rounded-[12px] font-medium text-[16px]"
          >
            <IoClose size={24} className="text-[#9a96a6]" />
          </button>

          <div className="w-full flex justify-center flex-col items-center">
            <div className="w-[120px] h-[120px] rounded-[25px] bg-[#252e57] flex items-center justify-center">
              <img alt="claim" src={multi} className="w-[80px]" />
            </div>
            <h3 className="font-semibold text-[32px] py-4">
              Connect your TON wallet
            </h3>
            <p className="pb-6 text-[#9a96a6] text-[16px] text-center">
              Don't forget to connect your TON wallet <br />
              Distribution token soon.
            </p>

            <div className="w-full justify-center flex-col space-y-3 px-5">
              <div className="fixed top-0 left-0 right-0 pt-8 px-5">
                <div className="w-full items-center justify-center pb-3 flex pt-2">
                  <TonConnectButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Outlet />
    </>
  );
};

export default Connect;
