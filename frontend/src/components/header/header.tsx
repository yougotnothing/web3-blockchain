import { HugeiconsIcon } from '@hugeicons/react'
import './header.css'
import { BitcoinSearchIcon, UserSharingIcon } from '@hugeicons/core-free-icons'
import { useRef } from 'react';

export const Header = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="header-container">
      <div className='searchbar-container' onClick={() => inputRef.current?.focus()}>
        <HugeiconsIcon icon={BitcoinSearchIcon} className='searchbar-icon' />
        <input
          ref={inputRef}
          type="text"
          className="searchbar-input"
          placeholder="Search"
        />
      </div>
      <div className='profile-container'>
        {/* Temporary solution till backend profiles */}
        <div className="profile-image">
          <HugeiconsIcon className="profile-image" icon={UserSharingIcon} />
        </div>
        {/* Temporary solution till backend profiles */}
        <div className="profile-user_container">
          <div className="profile-user_name">
            Vlad Troyan
          </div>
          <div className="profile-user_subname">
            Profile
          </div>
        </div> 
      </div>
    </div>
  )
}