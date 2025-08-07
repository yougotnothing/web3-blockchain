import { HugeiconsIcon } from '@hugeicons/react';
import logo from '../../assets/matcha.png';
import { NAV_BUTTONS } from './navbuttons';
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { useNavigate } from 'react-router-dom';
import './navmenu.css';

export const NavMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="navmenu-container">
      <div className="navmenu-title_container">
        <img src={logo} alt="Logo" className="navmenu-title_logo" />
        <div className="navmenu-title_text">Matcha Wallet</div>
      </div>
      <div className="navmenu-block">
        <div className="navmenu-block_title">Menu</div>
        {Object.entries(NAV_BUTTONS).map(([key, { label, icon, path }]) => (
          <button
            className="navbutton"
            key={key}
            onClick={() => navigate(path)}
          >
            <HugeiconsIcon icon={icon} />
            <div className="navbutton-text">{label}</div>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="navbutton-arrow-icon"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
