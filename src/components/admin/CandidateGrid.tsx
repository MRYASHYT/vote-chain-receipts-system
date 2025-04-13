
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, UserPlus } from "lucide-react";
import { Candidate, Vote } from '@/types/vote';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CandidateGridProps {
  vote: Vote;
  refreshVote: () => void;
}

const CandidateGrid = ({ vote, refreshVote }: CandidateGridProps) => {
  const { toast } = useToast();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setViewDialogOpen(true);
  };
  
  return (
    <>
      {/* Candidate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {vote.candidates && vote.candidates.map((candidate, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="aspect-square w-full overflow-hidden">
              <img 
                src={candidate.photoUrl} 
                alt={candidate.name}
                className="h-full w-full object-cover transition-all hover:scale-105"
              />
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">{candidate.name}</CardTitle>
              <Badge>{vote.options[candidate.optionId]}</Badge>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {candidate.biography}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewCandidate(candidate)}
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
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="space-y-4">
              <div className="mx-auto w-32 h-32 overflow-hidden rounded-full">
                <img 
                  src={selectedCandidate.photoUrl} 
                  alt={selectedCandidate.name}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-lg text-center">{selectedCandidate.name}</h3>
                  <div className="flex justify-center mt-1">
                    <Badge>{vote.options[selectedCandidate.optionId]}</Badge>
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

export default CandidateGrid;
