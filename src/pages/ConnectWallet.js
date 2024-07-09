import React, { useState } from "react";
import "../App.css";
import Animate from "../Components/Animate";
import Spinner from "../Components/Spinner";
import { TonConnectButton } from "@tonconnect/ui-react";



function ConnectWallet() {

  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <Animate>
          <TonConnectButton />
        </Animate>
      )}
    </>
  );
}

export default ConnectWallet;
