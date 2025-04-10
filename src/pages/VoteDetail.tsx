
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { VoteReceipt } from '@/components/vote/VoteReceipt';
import { ArrowLeft, Calendar, Check, ChevronRight, Loader2, Shield } from 'lucide-react';
import { mockData, simulateBlockchainVote } from '@/lib/mockData';
import { Vote, VoteReceipt as VoteReceiptType } from '@/types/vote';
import { useWeb3 } from '@/context/Web3Context';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

const VoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account, isConnected, connectWallet, isAdmin } = useWeb3();
  const { toast } = useToast();
  
  const [vote, setVote] = useState<Vote | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [receipt, setReceipt] = useState<VoteReceiptType | null>(null);
  const [results, setResults] = useState<{optionId: number, optionText: string, votes: number}[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  
  useEffect(() => {
    if (id) {
      const foundVote = mockData.votes.find(v => v.id === id);
      setVote(foundVote || null);
      
      if (foundVote) {
        // Check if user has voted
        const userReceipt = mockData.receipts.find(r => 
          r.voteId === id && 
          account && 
          r.voter.toLowerCase() === account.toLowerCase()
        );
        
        if (userReceipt) {
          setHasVoted(true);
          setReceipt(userReceipt);
          setSelectedOption(userReceipt.votedFor);
        }
        
        // Load results
        const voteResults = mockData.results[id];
        if (voteResults) {
          setResults(voteResults);
          setTotalVotes(voteResults.reduce((sum, r) => sum + r.votes, 0));
        }
      }
    }
  }, [id, account]);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleVote = async () => {
    if (!isConnected) {
      toast({
        title: "Connect wallet",
        description: "Please connect your wallet to vote",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedOption) {
      toast({
        title: "No option selected",
        description: "Please select an option to vote",
        variant: "destructive",
      });
      return;
    }
    
    if (!vote || !account) return;
    
    setIsVoting(true);
    
    try {
      // Simulate blockchain transaction
      const voteReceipt = await simulateBlockchainVote(vote.id, selectedOption, account);
      
      setHasVoted(true);
      setReceipt(voteReceipt);
      
      // Refresh results
      if (id && mockData.results[id]) {
        setResults(mockData.results[id]);
        setTotalVotes(mockData.results[id].reduce((sum, r) => sum + r.votes, 0));
      }
      
      toast({
        title: "Vote submitted!",
        description: "Your vote has been recorded on the blockchain",
      });
    } catch (error) {
      console.error("Voting error:", error);
      toast({
        title: "Voting failed",
        description: "There was an error submitting your vote",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };
  
  if (!vote) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Vote not found</h2>
          <Button onClick={() => navigate('/votes')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to votes
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/votes')} 
        className="mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to votes
      </Button>
      
      {/* Vote details card */}
      <Card className="blockchain-card mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{vote.title}</CardTitle>
              <CardDescription className="mt-2">{vote.description}</CardDescription>
            </div>
            <Badge variant={vote.isActive ? "secondary" : "outline"}>
              {vote.isActive ? "Active" : "Ended"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-1 text-sm text-muted-foreground mb-6">
            <div className="flex items-center">
              <Calendar size={16} className="mr-2" />
              <span>
                {formatDate(vote.startDate)} - {formatDate(vote.endDate)}
              </span>
            </div>
            {isAdmin && (
              <div className="flex items-center mt-2">
                <Shield size={16} className="mr-2" />
                <span>Created by: {vote.createdBy.slice(0, 6)}...{vote.createdBy.slice(-4)}</span>
              </div>
            )}
          </div>
          
          {hasVoted ? (
            <div>
              <h3 className="font-medium mb-4">Current Results</h3>
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.optionId} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center">
                        {selectedOption === result.optionText && (
                          <Check size={16} className="mr-2 text-green-600" />
                        )}
                        {result.optionText}
                      </span>
                      <span className="text-sm">
                        {result.votes} votes ({totalVotes > 0 ? Math.round((result.votes / totalVotes) * 100) : 0}%)
                      </span>
                    </div>
                    <Progress 
                      value={totalVotes > 0 ? (result.votes / totalVotes) * 100 : 0} 
                      className={selectedOption === result.optionText ? "bg-muted h-2" : "bg-muted h-2"} 
                    />
                  </div>
                ))}
                <div className="mt-2 text-sm text-muted-foreground">
                  Total votes: {totalVotes}
                </div>
              </div>
            </div>
          ) : (
            vote.isActive ? (
              <div>
                <h3 className="font-medium mb-4">Cast your vote</h3>
                <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                  {vote.options.map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={option} id={`option-${idx}`} />
                      <Label htmlFor={`option-${idx}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ) : (
              <div className="rounded-md bg-muted p-4">
                <p className="text-center text-muted-foreground">This vote has ended</p>
              </div>
            )
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {!hasVoted && vote.isActive ? (
            isConnected ? (
              <Button onClick={handleVote} disabled={isVoting || !selectedOption} className="gradient-bg border-0 hover:opacity-90">
                {isVoting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Confirming on blockchain...
                  </>
                ) : (
                  <>Submit Vote</>
                )}
              </Button>
            ) : (
              <Button onClick={connectWallet} className="gradient-bg border-0 hover:opacity-90">
                Connect Wallet to Vote
                <ChevronRight size={16} className="ml-1" />
              </Button>
            )
          ) : null}
        </CardFooter>
      </Card>
      
      {/* Vote receipt */}
      {receipt && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Your Vote Receipt</h2>
          <VoteReceipt receipt={receipt} />
        </div>
      )}
    </div>
  );
};

export default VoteDetail;
