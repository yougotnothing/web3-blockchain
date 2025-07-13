import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { Wallet } from "./components/wallet/wallet.tsx";
import './index.css'
import { NavMenu } from "components/navmenu/navmenu.tsx";
import { Header } from "components/header/header.tsx";

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
      <div className="main-screen_wrapper">
        <Header />
        <Wallet address={address} />
      </div>
    </div>
  );
};

export default App;
