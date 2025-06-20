import { useState, useEffect, type FC } from 'react';
import { JsonRpcProvider, formatEther, Contract, formatUnits } from 'ethers';
import './wallet.css';
import { ERC20_ABI } from 'utils/constants';

export const Wallet: FC<{ address: string }> = ({ address }) => {
  const [balance, setBalance] = useState<string>('0.00');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!address) return;

    const fetchBalance = async () => {
      setIsLoading(true);
      try {
        const provider = new JsonRpcProvider(import.meta.env.BSC_RPC_URL);

        const nativeBalance = await provider.getBalance(address);

        const wethContract = new Contract(
          import.meta.env.WETH_BSC_ADDRESS,
          ERC20_ABI,
          provider
        );
        const wethRaw = await wethContract.balanceOf(address);
        const decimals = await wethContract.decimals();
        const wethBalance = parseFloat(formatUnits(wethRaw, decimals));

        const total = parseFloat(formatEther(nativeBalance)) + wethBalance;
        setBalance(total.toFixed(6));
      } catch (err) {
        console.error(err);
        setBalance('0.00');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, [address]);

  return (
    <div className="main-container">
      <div className="wallet-container">
        <h2>Wallet Balance</h2>
        <div className="balance-value">
          {isLoading ? 'Loading...' : `${balance} ETH`}
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
    </div>
  );
};
