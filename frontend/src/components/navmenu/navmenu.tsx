import { HugeiconsIcon } from '@hugeicons/react'
import './navmenu.css'
import logo from '../../assets/matcha.png'
import { NavButtons, PressButton } from './navbuttons'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons';

export const NavMenu = () => {
  return (
    <div className='navmenu-container'>
      <div className='navmenu-title_container'>
        <img src={logo} alt="Logo" className='navmenu-title_logo'/>
        <div className='navmenu-title_text'>
          Matcha Wallet
        </div>
      </div>
      <div className='navmenu-block'>
        <div className='navmenu-block_title'>
          Menu
        </div>
        {Object.entries(NavButtons).map(([key, { label, icon }]) => (
          <button onClick={() => PressButton('https://www.youtube.com/watch?v=BFqHyCoypfM')} className='navbutton' key={key}>
            <HugeiconsIcon icon={icon} />
            <div className='navbutton-text'>{label}</div>
            <HugeiconsIcon icon={ArrowRight01Icon} />
          </button>
        ))}
      </div>
    </div>
  );
};