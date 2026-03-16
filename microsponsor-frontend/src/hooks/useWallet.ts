// Thin re-export so all existing call-sites keep working unchanged.
// The real state lives in StacksProvider (one shared instance per app).
export { useStacks as useWallet } from '../contexts/StacksProvider';

export interface WalletState {
  connected: boolean;
  address: string;
  mainnetAddress: string;
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
}
