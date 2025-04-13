
import { useState, useEffect } from 'react';
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
import { AlertCircle, CalendarIcon, Loader2, PlusCircle, Trash2, Timer } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CandidateManager from '@/components/admin/CandidateManager';
import DashboardOverview from '@/components/admin/DashboardOverview';
import { Vote } from '@/types/vote';

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, account } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedVote, setSelectedVote] = useState<Vote | null>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [activeTab, setActiveTab] = useState('dashboard'); // Updated default tab to dashboard
  const [adminVotes, setAdminVotes] = useState<Vote[]>([]);
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
    }
    
    // Load votes created by this admin
    if (account) {
      const userVotes = mockData.votes.filter(vote => 
        vote.createdBy.toLowerCase() === account.toLowerCase()
      );
      setAdminVotes(userVotes);
      
      if (userVotes.length > 0 && !selectedVote) {
        setSelectedVote(userVotes[0]);
      }
    }
  }, [isAdmin, navigate, account]);

  const refreshVotes = () => {
    if (account) {
      const userVotes = mockData.votes.filter(vote => 
        vote.createdBy.toLowerCase() === account.toLowerCase()
      );
      setAdminVotes(userVotes);
      
      // Update selected vote if it exists in the refreshed list
      if (selectedVote) {
        const refreshedVote = userVotes.find(v => v.id === selectedVote.id);
        if (refreshedVote) {
          setSelectedVote(refreshedVote);
        }
      }
    }
  };

  if (!isAdmin) {
    return null; // Will redirect in useEffect
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
      
      // Refresh votes and select the new one
      refreshVotes();
      setSelectedVote(newVote);
      setActiveTab('manage');
      
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

  const handleToggleVoteStatus = (vote: Vote) => {
    const voteToUpdate = mockData.votes.find(v => v.id === vote.id);
    if (voteToUpdate) {
      voteToUpdate.isActive = !voteToUpdate.isActive;
      
      toast({
        title: voteToUpdate.isActive ? "Vote activated" : "Vote deactivated",
        description: `The vote "${voteToUpdate.title}" has been ${voteToUpdate.isActive ? 'activated' : 'deactivated'}`
      });
      
      refreshVotes();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="create">Create Vote</TabsTrigger>
          <TabsTrigger value="manage">Manage Votes</TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <DashboardOverview />
        </TabsContent>
        
        <TabsContent value="create">
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
        </TabsContent>
        
        <TabsContent value="manage">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar with vote list */}
            <div className="md:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Your Votes</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {adminVotes.length > 0 ? (
                    <div className="divide-y">
                      {adminVotes.map(vote => (
                        <Button
                          key={vote.id}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-left rounded-none px-4 py-6 h-auto",
                            selectedVote?.id === vote.id ? "bg-muted" : ""
                          )}
                          onClick={() => setSelectedVote(vote)}
                        >
                          <div>
                            <p className="font-medium truncate">{vote.title}</p>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                              <Timer size={12} className="mr-1" />
                              {vote.isActive ? "Active" : "Inactive"}
                            </p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-muted-foreground">
                      No votes created yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {/* Main content area */}
            <div className="md:col-span-3">
              {selectedVote ? (
                <div className="space-y-6">
                  <Card className="blockchain-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{selectedVote.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {selectedVote.description}
                          </CardDescription>
                        </div>
                        <Button
                          variant={selectedVote.isActive ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => handleToggleVoteStatus(selectedVote)}
                        >
                          {selectedVote.isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Vote Options</h3>
                          <ul className="space-y-1 list-disc list-inside">
                            {selectedVote.options.map((option, idx) => (
                              <li key={idx} className="text-sm">{option}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2">Vote Period</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(selectedVote.startDate), "PPP")} - {format(new Date(selectedVote.endDate), "PPP")}
                          </p>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          onClick={() => navigate(`/votes/${selectedVote.id}`)}
                          className="w-full mt-2"
                        >
                          View Vote Page
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <CandidateManager vote={selectedVote} refreshVote={refreshVotes} />
                </div>
              ) : (
                <Card className="min-h-[300px] flex items-center justify-center">
                  <CardContent>
                    <p className="text-muted-foreground">Select a vote to manage</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
