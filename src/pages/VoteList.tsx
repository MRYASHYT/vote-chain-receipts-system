
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VoteCard from '@/components/vote/VoteCard';
import { mockData } from '@/lib/mockData';
import { Vote } from '@/types/vote';
import { Search } from 'lucide-react';

const VoteList = () => {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [activeVotes, setActiveVotes] = useState<Vote[]>([]);
  const [pastVotes, setPastVotes] = useState<Vote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState('active');

  useEffect(() => {
    // Load votes from mock data
    const allVotes = [...mockData.votes];
    setVotes(allVotes);
    
    // Filter active and past votes
    setActiveVotes(allVotes.filter(vote => vote.isActive));
    setPastVotes(allVotes.filter(vote => !vote.isActive));
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const filterVotes = (voteList: Vote[]) => {
    if (!searchTerm) return voteList;
    
    const term = searchTerm.toLowerCase();
    return voteList.filter(vote => 
      vote.title.toLowerCase().includes(term) ||
      vote.description.toLowerCase().includes(term) ||
      vote.options.some(option => option.toLowerCase().includes(term))
    );
  };
  
  const filteredActiveVotes = filterVotes(activeVotes);
  const filteredPastVotes = filterVotes(pastVotes);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Votes</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search votes..." 
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8"
          />
        </div>
      </div>
      
      <Tabs defaultValue="active" value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active Votes</TabsTrigger>
          <TabsTrigger value="past">Past Votes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {filteredActiveVotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActiveVotes.map((vote) => (
                <VoteCard key={vote.id} vote={vote} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active votes found</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past">
          {filteredPastVotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPastVotes.map((vote) => (
                <VoteCard key={vote.id} vote={vote} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No past votes found</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VoteList;
