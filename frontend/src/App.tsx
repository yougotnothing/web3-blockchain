import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { NavMenu } from 'components/navmenu/navmenu.tsx';
import { Header } from 'components/header/header.tsx';
import { walletStore } from 'store/wallet';
import './index.css';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    walletStore.connectWallet();
  }, []);

  useEffect(() => {
    if (
      !localStorage.getItem('access_token') &&
      !document.cookie.includes('refresh_token')
    ) {
      navigate('/login');
    }
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
