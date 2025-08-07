import {
  DashboardSquareEditIcon,
  MarketAnalysisIcon,
  WalletIcon,
} from '@hugeicons/core-free-icons';

export const NAV_BUTTONS = {
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
} as const;

export const pressButton = (url: string) => {
  window.open(url, '_blank');
};
