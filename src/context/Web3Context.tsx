
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { VoterVerification } from '@/components/VoterVerification';

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isAdmin: boolean;
  isVoterVerified: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  networkName: string;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  isConnected: false,
  isAdmin: false,
  isVoterVerified: false,
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
  const [isVoterVerified, setIsVoterVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { toast } = useToast();

  const isConnected = !!account;
  const isAdmin = account ? account.toLowerCase() === ADMIN_ADDRESS.toLowerCase() : false;

  const checkVoterVerification = async (address: string) => {
    try {
      const { data: voter } = await supabase
        .from('voters')
        .select('is_verified')
        .eq('wallet_address', address.toLowerCase())
        .maybeSingle();
      
      setIsVoterVerified(!!voter?.is_verified);
      return !!voter?.is_verified;
    } catch (error) {
      console.error('Error checking voter verification:', error);
      return false;
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          
          const network = await provider.getNetwork();
          setNetworkName(network.name === 'homestead' ? 'Ethereum Mainnet' : network.name);
          
          // Check if the wallet is already verified
          const isVerified = await checkVoterVerification(accounts[0]);
          
          if (!isVerified) {
            setShowVerification(true);
          }
          
          toast({
            title: "Wallet Connected",
            description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          });
          
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
      const wasConnected = localStorage.getItem('walletConnected') === 'true';
      const savedAddress = localStorage.getItem('walletAddress');
      
      if (wasConnected && window.ethereum && savedAddress) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            await checkVoterVerification(accounts[0]);
            
            const network = await provider.getNetwork();
            setNetworkName(network.name === 'homestead' ? 'Ethereum Mainnet' : network.name);
          }
        } catch (error) {
          console.error("Auto-connect error:", error);
        }
      }
    };
    
    checkConnection();
    
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        await checkVoterVerification(accounts[0]);
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
        isVoterVerified,
        connectWallet, 
        disconnectWallet,
        networkName
      }}
    >
      {children}
      {showVerification && account && (
        <VoterVerification
          isOpen={showVerification}
          onClose={() => setShowVerification(false)}
          walletAddress={account}
        />
      )}
    </Web3Context.Provider>
  );
};
