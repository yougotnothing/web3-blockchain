import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { Wallet } from 'components/wallet/Wallet';

function App() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    const connectWallet = async () => {
      if (!window.ethereum) {
        alert('Metamask extension is required');
        return;
      }

      const ethProvider = new BrowserProvider(window.ethereum);
      const signer = await ethProvider.getSigner();
      const userAddress = await signer.getAddress();

      setProvider(ethProvider);
      setAddress(userAddress);
    };

    connectWallet();
  }, []);
  console.log(address, provider);

  return <Wallet address={address} />;
}

export default App;
