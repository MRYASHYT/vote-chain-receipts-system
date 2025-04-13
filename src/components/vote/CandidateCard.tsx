
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Candidate } from "@/types/vote";
import { User } from "lucide-react";

interface CandidateCardProps {
  candidate: Candidate;
  option: string;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, option }) => {
  const initials = candidate.name
    .split(' ')
    .map(name => name[0])
    .join('');

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={candidate.photoUrl} alt={candidate.name} />
            <AvatarFallback className="text-lg bg-primary/10">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{candidate.name}</CardTitle>
            <CardDescription className="mt-1">{option}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{candidate.biography}</p>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
