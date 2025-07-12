import { 
  DashboardSquareEditIcon, 
  MarketAnalysisIcon, 
  WalletIcon 
} from '@hugeicons/core-free-icons';

export const NavButtons = {
  dashboard: {
    label: 'Dashboard',
    icon: DashboardSquareEditIcon
  },
  wallet: {
    label: 'Wallet',
    icon: WalletIcon
  },
  market: {
    label: 'Market',
    icon: MarketAnalysisIcon
  }
};

export const PressButton = (url: string) => {
  window.open(url, '_blank');
}