import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { NavMenu } from 'components/navmenu/navmenu.tsx';
import { Header } from 'components/header/header.tsx';
import { walletStore } from 'store/wallet';
import './index.css';

function App() {
  useEffect(() => {
    walletStore.connectWallet();
  }, []);

  return (
    <div className="main-container">
      <NavMenu />
      <div className="main-screen_wrapper">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
