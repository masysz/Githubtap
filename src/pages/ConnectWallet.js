import React, { useState } from "react";
import "../App.css";
import Animate from "../Components/Animate";
import Spinner from "../Components/Spinner";
import { TonConnectButton } from "@tonconnect/ui-react";



function ConnectWallet() {

  const [loading, setLoading] = useState(true);

  return (
    <>

<div className="ConnectWallet">
          <TonConnectButton />
          </div>

    </>
  );
}

export default ConnectWallet;
