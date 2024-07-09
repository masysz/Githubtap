import React, { useEffect, useState } from "react";
import Animate from "../Components/Animate";
import { Outlet } from "react-router-dom";
import coinsmall from "../images/coinsmall.webp";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Spinner from "../Components/Spinner";
import { TonConnectButton } from "@tonconnect/ui-react";

const Connect = () => {
  
  return (
    <>

        <Animate>
          <TonConnectButton />
          <Outlet />
        </Animate>

    </>
  );
};

export default Connect;
