import { action, makeObservable, observable } from 'mobx';
import {
  BrowserProvider,
  JsonRpcProvider,
  formatEther,
  Contract,
  formatUnits,
} from 'ethers';
import { ERC20_ABI } from 'utils/constants';

class WalletStore {
  @observable balance: string = '0.00';
  @observable address: string = '';
  @observable isLoading: boolean = false;

  constructor() {
    makeObservable(this);
  }

  @action
  private setAddress(address: string) {
    this.address = address;
  }

  @action
  private setBalance(balance: string) {
    this.balance = balance;
  }

  @action
  private setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  @action.bound
  public async connectWallet() {
    if (!window.ethereum) {
      alert('Metamask extension is required');
      return;
    }

    const ethProvider = new BrowserProvider(window.ethereum);
    const signer = await ethProvider.getSigner();
    const userAddress = await signer.getAddress();

    this.setAddress(userAddress);
  }

  @action.bound
  public async getBalance() {
    this.setIsLoading(true);

    try {
      const provider = new JsonRpcProvider(import.meta.env.VITE_BSC_RPC_URL);

      const nativeBalance = await provider.getBalance(this.address);

      const wethContract = new Contract(
        import.meta.env.VITE_WETH_BSC_ADDRESS,
        ERC20_ABI,
        provider
      );
      const wethRaw = await wethContract.balanceOf(this.address);
      const decimals = await wethContract.decimals();
      const wethBalance = parseFloat(formatUnits(wethRaw, decimals));

      const total = parseFloat(formatEther(nativeBalance)) + wethBalance;
      this.setBalance(total.toFixed(6));
    } catch (err) {
      console.error(err);
      this.setBalance('0.00');
    } finally {
      this.setIsLoading(false);
    }
  }
}

export const walletStore = new WalletStore();
