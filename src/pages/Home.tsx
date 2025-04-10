
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWeb3 } from '@/context/Web3Context';
import { ArrowRight, Check, FileText, Lock, LucideIcon, Shield, Vote } from 'lucide-react';

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const Feature = ({ icon: Icon, title, description }: FeatureProps) => (
  <div className="flex flex-col items-center text-center p-6">
    <div className="bg-primary/10 p-3 rounded-full mb-4">
      <Icon size={24} className="text-primary" />
    </div>
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { isConnected, connectWallet } = useWeb3();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 gradient-bg opacity-40 -z-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Secure Voting on the Blockchain</h1>
            <p className="text-xl mb-8">
              VoteChain provides transparent, tamper-proof voting with instant verifiable results and downloadable receipts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {isConnected ? (
                <Button onClick={() => navigate('/votes')} className="gradient-bg border-0 hover:opacity-90">
                  View Active Votes
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              ) : (
                <Button onClick={connectWallet} className="gradient-bg border-0 hover:opacity-90">
                  Connect Wallet to Start
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature 
              icon={Lock}
              title="Secure Blockchain Voting"
              description="All votes are securely recorded on the blockchain, ensuring immutability and transparency."
            />
            <Feature 
              icon={FileText}
              title="Downloadable Receipts"
              description="Get verifiable proof of your vote with all transaction details in a downloadable receipt."
            />
            <Feature 
              icon={Shield}
              title="Admin Dashboard"
              description="Powerful tools for creating and managing votes with detailed analytics."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-10">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Connect Your Wallet</h3>
                  <p className="text-muted-foreground">
                    Connect your blockchain wallet to verify your identity and enable secure voting.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Browse Active Votes</h3>
                  <p className="text-muted-foreground">
                    View all ongoing voting proposals and read their details to make informed decisions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Cast Your Vote</h3>
                  <p className="text-muted-foreground">
                    Select your preferred option and confirm your vote, which is then recorded on the blockchain.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Download Your Receipt</h3>
                  <p className="text-muted-foreground">
                    After voting, download a receipt with all the transaction details as proof of your participation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg -z-10" />
        <div className="container mx-auto px-4 relative z-10">
          <Card className="blockchain-card max-w-3xl mx-auto p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to participate in secure voting?</h2>
            <p className="text-lg mb-6">
              Connect your wallet and start voting on proposals that matter to you.
            </p>
            {isConnected ? (
              <Button onClick={() => navigate('/votes')} size="lg" className="gradient-bg border-0 hover:opacity-90">
                View Active Votes
              </Button>
            ) : (
              <Button onClick={connectWallet} size="lg" className="gradient-bg border-0 hover:opacity-90">
                Connect Your Wallet
              </Button>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
