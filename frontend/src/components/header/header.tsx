import { HugeiconsIcon } from '@hugeicons/react';
import { BitcoinSearchIcon, UserSharingIcon } from '@hugeicons/core-free-icons';
import { useRef } from 'react';
import { user } from 'store/user';
import './header.css';
import { observer } from 'mobx-react-lite';

export const Header = observer(() => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="header-container">
      <div
        className="searchbar-container"
        onClick={() => inputRef.current?.focus()}
      >
        <HugeiconsIcon icon={BitcoinSearchIcon} className="searchbar-icon" />
        <input
          ref={inputRef}
          type="text"
          className="searchbar-input"
          placeholder="Search"
        />
      </div>
      <button className="profile-container" onClick={user.getSelf}>
        {user.avatar ? (
          <img src={user.avatar} className="profile-image" />
        ) : (
          <div className="profile-image">
            <HugeiconsIcon className="profile-image" icon={UserSharingIcon} />
          </div>
        )}
        <div className="profile-user_container">
          <div className="profile-user_name">{user.name}</div>
          <div className="profile-user_subname">Profile</div>
        </div>
      </button>
    </div>
  );
});
