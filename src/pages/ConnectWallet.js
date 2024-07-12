import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { TonConnectButton } from "@tonconnect/ui-react";

const Connect = () => {


  return (
    <>

          <div className="w-full justify-center flex-col space-y-3 px-5">
            <div className="fixed top-0 left-0 right-0 pt-8 px-5">
              <div className="w-full items-center justify-center pb-3 flex pt-2">
                <TonConnectButton className="ton-connect-button" />
              </div>
            </div>
            </div>
            <Outlet />
    </>
  );
};

export default Connect;
