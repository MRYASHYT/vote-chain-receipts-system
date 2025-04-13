
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from "@/hooks/use-toast";

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isAdmin: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  networkName: string;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  isConnected: false,
  isAdmin: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  networkName: ''
});

export const useWeb3 = () => useContext(Web3Context);

// Mock admin address - in a real app, this would come from a contract
const ADMIN_ADDRESS = '0x8ba1f109551bD432803012645Ac136ddd64DBA72';

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>('');
  const { toast } = useToast();

  const isConnected = !!account;
  // Check both address match AND if admin access is granted via secret code
  const isAdmin = (account ? account.toLowerCase() === ADMIN_ADDRESS.toLowerCase() : false) || 
                  sessionStorage.getItem('adminAccess') === 'true';

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          
          const network = await provider.getNetwork();
          setNetworkName(network.name === 'homestead' ? 'Ethereum Mainnet' : network.name);
          
          toast({
            title: "Wallet Connected",
            description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          });
          
          // Save to local storage
          localStorage.setItem('walletConnected', 'true');
          localStorage.setItem('walletAddress', accounts[0]);
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
        toast({
          title: "Connection Failed",
          description: "Failed to connect wallet. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Metamask Required",
        description: "Please install Metamask to use this application",
        variant: "destructive",
      });
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
    // Clear admin access on disconnect
    sessionStorage.removeItem('adminAccess');
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  useEffect(() => {
    const checkConnection = async () => {
      // Check if user was previously connected
      const wasConnected = localStorage.getItem('walletConnected') === 'true';
      const savedAddress = localStorage.getItem('walletAddress');
      
      if (wasConnected && window.ethereum && savedAddress) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            
            const network = await provider.getNetwork();
            setNetworkName(network.name === 'homestead' ? 'Ethereum Mainnet' : network.name);
          }
        } catch (error) {
          console.error("Auto-connect error:", error);
        }
      }
    };
    
    checkConnection();
    
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        localStorage.setItem('walletAddress', accounts[0]);
      }
    };
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    
    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [account]);

  return (
    <Web3Context.Provider 
      value={{ 
        account, 
        isConnected, 
        isAdmin, 
        connectWallet, 
        disconnectWallet,
        networkName
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
