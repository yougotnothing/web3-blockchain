import {
  DashboardSquareEditIcon,
  MarketAnalysisIcon,
  WalletIcon,
} from '@hugeicons/core-free-icons';

export const NavButtons = {
  dashboard: {
    label: 'Dashboard',
    icon: DashboardSquareEditIcon,
    path: 'dashboard',
  },
  wallet: {
    label: 'Wallet',
    icon: WalletIcon,
    path: 'wallet',
  },
  market: {
    label: 'Market',
    icon: MarketAnalysisIcon,
    path: 'market',
  },
};

export const PressButton = (url: string) => {
  window.open(url, '_blank');
};
