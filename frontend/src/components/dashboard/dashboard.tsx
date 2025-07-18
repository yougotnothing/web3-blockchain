import { HugeiconsIcon } from '@hugeicons/react';
import { UserSharingIcon } from '@hugeicons/core-free-icons';
import './dashboard.css';

const Dashboard = () => {
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
          <div className="dashboard-profile_name">pipka</div>
          <div className="dashboard-profile_socials">twitter: link</div>
        </div>
        <div className="dashboard-profile_info">
          <div className="dashboard-profile_item">
            <div className="dashboard-profile_label">ID</div>
            <div className="dashboard-profile_value">id2281488</div>
          </div>
          <div className="dashboard-profile_item">
            <div className="dashboard-profile_label">VIP</div>
            <div className="dashboard-profile_value">vip</div>
          </div>
          <div className="dashboard-profile_item">
            <div className="dashboard-profile_label">Followers</div>
            <div className="dashboard-profile_value">100</div>
          </div>
          <div className="dashboard-profile_item">
            <div className="dashboard-profile_label">Follows</div>
            <div className="dashboard-profile_value">254</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
