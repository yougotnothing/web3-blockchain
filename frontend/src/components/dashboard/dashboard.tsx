import { HugeiconsIcon } from '@hugeicons/react';
import { UserSharingIcon } from '@hugeicons/core-free-icons';
import './dashboard.css';
import { observer } from 'mobx-react-lite';
import { user } from 'store/user';
import { useEffect } from 'react';

const Dashboard = observer(() => {
  useEffect(() => {
    user.getSelf();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-profile_container">
        <div className="dashboard-profile_avatar">
          <HugeiconsIcon
            className="dashboard-profile_avatar"
            icon={UserSharingIcon}
          />
        </div>
        <div className="username-wrapper">
          <div className="dashboard-profile_name">{user.name}</div>
          <div className="dashboard-profile_socials">twitter: link</div>
        </div>
        <div className="dashboard-profile_info">
          <div className="dashboard-profile_item">
            <div className="dashboard-profile_label">Email</div>
            <div className="dashboard-profile_value">{user.email}</div>
          </div>
          <div className="dashboard-profile_item">
            <div className="dashboard-profile_label">Transactions count</div>
            <div className="dashboard-profile_value">
              {user.transactions?.length || '0'}
            </div>
          </div>
          <div className="dashboard-profile_item">
            <div className="dashboard-profile_label">Created at</div>
            <div className="dashboard-profile_value">
              {new Date(user.created_at).toUTCString().replace('GMT', '')}
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard-profile__transactions"></div>
    </div>
  );
});

export default Dashboard;
