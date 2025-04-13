
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockData } from "@/lib/mockData";
import { Vote } from "@/types/vote";
import { BarChart3, CalendarCheck, Users, VoteIcon } from "lucide-react";
import { ChartContainer, ChartTooltipContent, ChartTooltip } from "@/components/ui/chart";
import { ResponsiveBar } from "recharts";

interface DashboardStats {
  totalVotes: number;
  activeVotes: number;
  totalVoters: number;
  totalCandidates: number;
}

const DashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalVotes: 0,
    activeVotes: 0,
    totalVoters: 0,
    totalCandidates: 0,
  });
  const [recentVotes, setRecentVotes] = useState<Vote[]>([]);
  
  useEffect(() => {
    // Calculate stats from mock data
    const activeVotes = mockData.votes.filter(vote => vote.isActive).length;
    const totalVotes = mockData.votes.length;
    const uniqueVoters = new Set(mockData.receipts.map(receipt => receipt.voter));
    const totalVoters = uniqueVoters.size;
    
    const allCandidates = mockData.votes.reduce((acc, vote) => {
      return acc + (vote.candidates?.length || 0);
    }, 0);
    
    setStats({
      totalVotes,
      activeVotes,
      totalVoters,
      totalCandidates: allCandidates
    });
    
    // Get recent votes
    setRecentVotes(mockData.votes.slice(0, 3));
  }, []);
  
  // Get vote activity data for chart
  const getVoteActivityData = () => {
    // Group votes by date for chart data
    const votesByDate = mockData.receipts.reduce((acc: Record<string, number>, receipt) => {
      const date = new Date(receipt.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});
    
    // Convert to array format for Recharts
    return Object.entries(votesByDate).map(([date, count]) => ({
      date,
      votes: count
    })).slice(-7); // Last 7 days
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Elections</CardTitle>
            <VoteIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVotes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeVotes} active elections
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Elections</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeVotes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalVotes - stats.activeVotes} completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVoters}</div>
            <p className="text-xs text-muted-foreground">
              Unique wallet addresses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCandidates}</div>
            <p className="text-xs text-muted-foreground">
              Across all elections
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Vote Activity</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ChartContainer config={{ votes: { color: '#2563eb' } }}>
            <ResponsiveBar
              data={getVoteActivityData()}
              keys={['votes']}
              indexBy="date"
              margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
              padding={0.4}
              valueScale={{ type: 'linear' }}
              colors={['var(--color-votes)']}
              axisBottom={{
                tickSize: 0,
                tickPadding: 16,
              }}
              axisLeft={{
                tickSize: 0,
                tickValues: 5,
                tickPadding: 16,
              }}
              gridYValues={5}
              tooltip={(props) => (
                <ChartTooltip>
                  <ChartTooltipContent
                    active={props.active}
                    payload={props.payload}
                  />
                </ChartTooltip>
              )}
            />
          </ChartContainer>
        </CardContent>
      </Card>
      
      {/* Recent Elections */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Elections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentVotes.map((vote) => (
              <div key={vote.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{vote.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(vote.startDate).toLocaleDateString()} - {new Date(vote.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div className={`text-sm px-2 py-1 rounded-full ${vote.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {vote.isActive ? 'Active' : 'Ended'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
