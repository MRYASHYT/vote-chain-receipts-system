
import { useState } from 'react';
import { Candidate } from '@/types/vote';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from 'lucide-react';

interface CandidateCardListProps {
  candidates: Candidate[];
  options: string[];
}

const CandidateCardList = ({ candidates, options }: CandidateCardListProps) => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setViewDialogOpen(true);
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((candidate, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-square w-full overflow-hidden bg-gray-100">
              {candidate.photoUrl ? (
                <img 
                  src={candidate.photoUrl} 
                  alt={candidate.name}
                  className="h-full w-full object-cover transition-all hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <User size={64} className="text-gray-300" />
                </div>
              )}
            </div>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">{candidate.name}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {options[candidate.optionId]}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button 
                variant="ghost" 
                onClick={() => handleViewCandidate(candidate)}
                className="w-full"
              >
                View Profile
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Candidate Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Candidate Profile</DialogTitle>
            <DialogDescription>
              Detailed information about this candidate
            </DialogDescription>
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="space-y-4">
              <div className="mx-auto w-32 h-32 overflow-hidden rounded-full bg-gray-100">
                {selectedCandidate.photoUrl ? (
                  <img 
                    src={selectedCandidate.photoUrl} 
                    alt={selectedCandidate.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User size={32} className="text-gray-300" />
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-lg text-center">{selectedCandidate.name}</h3>
                  <div className="flex justify-center mt-1">
                    <Badge>{options[selectedCandidate.optionId]}</Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Biography</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {selectedCandidate.biography}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CandidateCardList;
