import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { Wallet } from "./components/wallet/wallet.tsx";
import './index.css'
import { NavMenu } from "components/navmenu/navmenu.tsx";

function App() {
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const connectWallet = async () => {
      if (!window.ethereum) {
        alert("Metamask extension is required");
        return;
      }

      const ethProvider = new BrowserProvider(window.ethereum);
      const signer = await ethProvider.getSigner();
      const userAddress = await signer.getAddress();

      setAddress(userAddress);
    };

    connectWallet();
  }, []);

  return (
    <div className="main-container">
      <NavMenu />
      <Wallet address={address} />
    </div>
  );
}

export default App;
