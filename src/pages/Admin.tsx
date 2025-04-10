
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useWeb3 } from '@/context/Web3Context';
import { createMockVote, mockData } from '@/lib/mockData';
import { AlertCircle, CalendarIcon, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Vote } from '@/types/vote';

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, account } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to access the admin panel.
          </AlertDescription>
        </Alert>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }
  
  const addOption = () => {
    setOptions([...options, '']);
  };
  
  const removeOption = (index: number) => {
    if (options.length <= 2) {
      toast({
        title: "At least two options required",
        description: "A vote must have at least two options.",
        variant: "destructive",
      });
      return;
    }
    
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title || !description || !startDate || !endDate) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Check for empty options
    if (options.some(opt => !opt.trim())) {
      toast({
        title: "Invalid options",
        description: "Please provide text for all options",
        variant: "destructive",
      });
      return;
    }
    
    // Check date range
    if (endDate && startDate && endDate < startDate) {
      toast({
        title: "Invalid date range",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create new vote in mock data
      const newVote = createMockVote({
        title,
        description,
        options: options.filter(opt => opt.trim()),
        startDate: startDate,
        endDate: endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default 1 week
        isActive: true,
        createdBy: account || ''
      });
      
      toast({
        title: "Vote created",
        description: "Your vote has been created successfully",
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setOptions(['', '']);
      setStartDate(new Date());
      setEndDate(undefined);
      
      // Redirect to the new vote
      navigate(`/votes/${newVote.id}`);
    } catch (error) {
      console.error("Error creating vote:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your vote",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Card className="blockchain-card mb-6">
        <CardHeader>
          <CardTitle>Create New Vote</CardTitle>
          <CardDescription>
            Create a new voting proposal for the community to participate in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="createVoteForm" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter vote title" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this vote is about" 
                  rows={3}
                  required
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Options</Label>
                  <Button 
                    type="button" 
                    onClick={addOption} 
                    variant="outline" 
                    size="sm"
                  >
                    <PlusCircle size={16} className="mr-1" />
                    Add Option
                  </Button>
                </div>
                
                {options.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input 
                      value={option}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      required
                    />
                    <Button 
                      type="button" 
                      onClick={() => removeOption(idx)} 
                      variant="ghost" 
                      size="icon" 
                      className="shrink-0"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        disabled={(date) => 
                          (startDate ? date < startDate : false) || 
                          date < new Date()
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            form="createVoteForm"
            disabled={isSubmitting}
            className="gradient-bg border-0 hover:opacity-90"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Creating Vote...
              </>
            ) : (
              <>Create Vote</>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="blockchain-card">
        <CardHeader>
          <CardTitle>Vote Management</CardTitle>
          <CardDescription>
            View and manage all votes created by you
          </CardDescription>
        </CardHeader>
        <CardContent>
          {account && mockData.votes.filter(vote => vote.createdBy === account).length > 0 ? (
            <div className="divide-y">
              {mockData.votes
                .filter(vote => vote.createdBy === account)
                .map((vote) => (
                  <div key={vote.id} className="py-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{vote.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(vote.startDate).toLocaleDateString()} - {new Date(vote.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/votes/${vote.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No votes created yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
