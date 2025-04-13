
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3 } from '@/context/Web3Context';
import { Button } from '@/components/ui/button';
import { FileText, Shield, Home, Menu, X, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { account, isConnected, connectWallet, disconnectWallet, isAdmin } = useWeb3();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b">
      <div className="container flex justify-between items-center h-16 mx-auto px-4">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="gradient-bg rounded-full w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold">VC</span>
            </div>
            <span className="font-bold text-xl">VoteChain</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm font-medium flex items-center space-x-1 hover:text-primary">
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link to="/votes" className="text-sm font-medium flex items-center space-x-1 hover:text-primary">
            <FileText size={16} />
            <span>Votes</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium flex items-center space-x-1 hover:text-primary">
              <Shield size={16} />
              <span>Admin</span>
            </Link>
          )}
        </nav>

        {/* Wallet Connect Button and Admin Icon */}
        <div className="hidden md:flex items-center space-x-2">
          {isAdmin && (
            <Link 
              to="/admin" 
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors mr-1"
              title="Admin Panel"
            >
              <Settings size={18} />
            </Link>
          )}
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1 rounded-full bg-muted text-sm">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </div>
              <Button variant="outline" onClick={disconnectWallet} size="sm">Disconnect</Button>
            </div>
          ) : (
            <Button onClick={connectWallet} className="gradient-bg border-0 hover:opacity-90">
              Connect Wallet
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        className={cn(
          "fixed inset-x-0 top-16 bg-white shadow-lg z-20 transition-transform md:hidden",
          mobileMenuOpen ? "transform translate-y-0" : "transform -translate-y-full"
        )}
      >
        <div className="py-2 px-4 space-y-4">
          <Link 
            to="/" 
            className="block px-4 py-2 text-sm hover:bg-muted rounded-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <Home size={16} />
              <span>Home</span>
            </div>
          </Link>
          <Link 
            to="/votes" 
            className="block px-4 py-2 text-sm hover:bg-muted rounded-md"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center space-x-2">
              <FileText size={16} />
              <span>Votes</span>
            </div>
          </Link>
          {isAdmin && (
            <Link 
              to="/admin" 
              className="block px-4 py-2 text-sm hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <Shield size={16} />
                <span>Admin</span>
              </div>
            </Link>
          )}
          
          {isAdmin && (
            <Link 
              to="/admin" 
              className="block px-4 py-2 text-sm hover:bg-muted rounded-md flex items-center space-x-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Settings size={16} />
              <span>Admin Panel</span>
            </Link>
          )}
          
          <div className="pt-2 border-t">
            {isConnected ? (
              <div className="space-y-2 px-4 py-2">
                <div className="text-sm text-muted-foreground break-all">
                  Connected: {account}
                </div>
                <Button variant="outline" onClick={disconnectWallet} size="sm" className="w-full">
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connectWallet} className="w-full gradient-bg border-0 hover:opacity-90 mx-4">
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
