
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, CheckCircle2 } from 'lucide-react';
import { Vote } from '@/types/vote';
import { useWeb3 } from '@/context/Web3Context';

interface VoteCardProps {
  vote: Vote;
}

export function VoteCard({ vote }: VoteCardProps) {
  const navigate = useNavigate();
  const { isConnected } = useWeb3();
  const [hasVoted, setHasVoted] = useState(false);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleViewDetails = () => {
    navigate(`/votes/${vote.id}`);
  };

  return (
    <Card className="blockchain-card hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle className="text-lg md:text-xl mb-1">{vote.title}</CardTitle>
            <CardDescription className="line-clamp-2">{vote.description}</CardDescription>
          </div>
          <Badge variant={vote.isActive ? "secondary" : "outline"}>
            {vote.isActive ? "Active" : "Ended"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar size={14} className="mr-2" />
            <span>
              {formatDate(vote.startDate)} - {formatDate(vote.endDate)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {vote.options.map((option, idx) => (
              <Badge key={idx} variant="outline" className="bg-white/50">
                {option}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground flex items-center">
          {hasVoted && (
            <span className="flex items-center text-green-600">
              <CheckCircle2 size={16} className="mr-1" />
              You voted
            </span>
          )}
        </div>
        <Button variant="default" onClick={handleViewDetails} className="gap-1">
          View details <ArrowRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default VoteCard;
