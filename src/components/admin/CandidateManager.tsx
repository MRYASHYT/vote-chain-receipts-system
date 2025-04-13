
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addCandidate, removeCandidate } from "@/lib/mockData";
import { Vote, Candidate } from "@/types/vote";
import { PlusCircle, Trash2, User, Image } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CandidateManagerProps {
  vote: Vote;
  refreshVote: () => void;
}

const CandidateManager: React.FC<CandidateManagerProps> = ({ vote, refreshVote }) => {
  const [name, setName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [biography, setBiography] = useState("");
  const [optionId, setOptionId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCandidate = () => {
    if (!name || !photoUrl || !biography || optionId === null) {
      toast({
        title: "Missing information",
        description: "Please fill all the candidate fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      addCandidate(vote.id, {
        name,
        photoUrl,
        biography,
        optionId
      });

      // Reset form
      setName("");
      setPhotoUrl("");
      setBiography("");
      setOptionId(null);

      toast({
        title: "Candidate added",
        description: "The candidate has been added successfully",
      });

      refreshVote();
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast({
        title: "Error",
        description: "Failed to add candidate",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCandidate = (candidateId: string) => {
    try {
      const result = removeCandidate(vote.id, candidateId);
      if (result) {
        toast({
          title: "Candidate removed",
          description: "The candidate has been removed successfully",
        });
        refreshVote();
      } else {
        toast({
          title: "Error",
          description: "Failed to remove candidate",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing candidate:", error);
      toast({
        title: "Error",
        description: "Failed to remove candidate",
        variant: "destructive",
      });
    }
  };

  // Example photo URLs
  const samplePhotoUrls = [
    "/images/candidate-1.jpg",
    "/images/candidate-2.jpg",
    "/images/candidate-3.jpg",
    "/images/candidate-4.jpg",
    "/images/candidate-5.jpg",
    "/images/candidate-6.jpg",
    "/images/candidate-7.jpg",
    "/images/candidate-8.jpg",
    "/images/candidate-9.jpg"
  ];

  return (
    <Card className="blockchain-card">
      <CardHeader>
        <CardTitle>Candidate Management</CardTitle>
        <CardDescription>Add or remove candidates for this vote</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="candidate-name">Name</Label>
              <Input
                id="candidate-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Candidate name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="candidate-photo">Photo URL</Label>
              <div className="flex gap-2">
                <Input
                  id="candidate-photo"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="URL to candidate photo"
                  className="flex-grow"
                />
                <Select onValueChange={(val) => setPhotoUrl(val)}>
                  <SelectTrigger className="w-14">
                    <Image size={16} />
                  </SelectTrigger>
                  <SelectContent>
                    {samplePhotoUrls.map((url, idx) => (
                      <SelectItem key={idx} value={url}>
                        Sample {idx + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs text-muted-foreground">
                Use a sample or enter your own URL
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="candidate-bio">Biography</Label>
            <Textarea
              id="candidate-bio"
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              placeholder="Short biography of the candidate"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="candidate-option">Supporting Option</Label>
            <Select onValueChange={(val) => setOptionId(parseInt(val))}>
              <SelectTrigger id="candidate-option">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {vote.options.map((option, idx) => (
                  <SelectItem key={idx} value={idx.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleAddCandidate}
            disabled={isSubmitting}
            className="w-full"
          >
            <PlusCircle size={16} className="mr-2" />
            Add Candidate
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Current Candidates</h3>
          {vote.candidates && vote.candidates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Supporting</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vote.candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-muted-foreground" />
                        {candidate.name}
                      </div>
                    </TableCell>
                    <TableCell>{vote.options[candidate.optionId]}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveCandidate(candidate.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground border rounded-md">
              No candidates added yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateManager;
