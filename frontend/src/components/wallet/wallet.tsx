import { useEffect } from 'react';
import { walletStore } from 'store/wallet';
import './wallet.css';
import { observer } from 'mobx-react-lite';

const Wallet = observer(() => {
  useEffect(() => {
    if (!walletStore.address) return;

    walletStore.getBalance();
  }, [walletStore.address]);

  return (
    <div className="wallet-container">
      <h2>Wallet Balance</h2>
      <div className="balance-value">
        {walletStore.isLoading ? 'Loading...' : `${walletStore.balance} ETH`}
      </div>

      <div className="buttons-container">
        <button className="button" onClick={() => alert('1')}>
          Send
        </button>
        <button className="button" onClick={() => alert('2')}>
          Receive
        </button>
        <button className="button" onClick={() => alert('3')}>
          Swap
        </button>
      </div>
    </div>
  );
});

export default Wallet;
