import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Wallet } from "./components/wallet/wallet.tsx";
import './index.css'
import { NavMenu } from "components/navmenu/navmenu.tsx";
import { Header } from "components/header/header.tsx";
import { Dashboard } from "components/dashboard/dashboard.tsx";
import { Market } from "components/market/market.tsx";

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
    <BrowserRouter>
      <div className="main-container">
        <NavMenu />
        <div className="main-screen_wrapper">
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/" />} />
            <Route path="/wallet" element={<Wallet address={address} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/market" element={<Market />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
