
import { MockVoteData } from "@/types/vote";

// Mock data for development
export const mockData: MockVoteData = {
  votes: [
    {
      id: "vote-1",
      title: "Community Treasury Allocation",
      description: "How should we allocate the community treasury funds for Q2 2023?",
      options: [
        "Protocol Development", 
        "Marketing", 
        "Liquidity Incentives", 
        "Community Events"
      ],
      startDate: new Date("2023-04-01"),
      endDate: new Date("2023-04-15"),
      isActive: true,
      createdBy: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      blockchainTxId: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    },
    {
      id: "vote-2",
      title: "Governance Parameter Update",
      description: "Should we update the minimum quorum requirement from 10% to 15%?",
      options: ["Yes", "No"],
      startDate: new Date("2023-03-15"),
      endDate: new Date("2023-03-30"),
      isActive: false,
      createdBy: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      blockchainTxId: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
    },
    {
      id: "vote-3",
      title: "Protocol Upgrade Proposal",
      description: "Should we implement the proposed V2 smart contract upgrade?",
      options: ["Approve", "Reject", "Abstain"],
      startDate: new Date("2023-04-10"),
      endDate: new Date("2023-04-25"),
      isActive: true,
      createdBy: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
      blockchainTxId: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456"
    }
  ],
  results: {
    "vote-1": [
      { optionId: 0, optionText: "Protocol Development", votes: 120 },
      { optionId: 1, optionText: "Marketing", votes: 85 },
      { optionId: 2, optionText: "Liquidity Incentives", votes: 196 },
      { optionId: 3, optionText: "Community Events", votes: 42 }
    ],
    "vote-2": [
      { optionId: 0, optionText: "Yes", votes: 312 },
      { optionId: 1, optionText: "No", votes: 158 }
    ]
  },
  receipts: [
    {
      voteId: "vote-1",
      voter: "0xUserWalletAddress123",
      votedFor: "Liquidity Incentives",
      timestamp: new Date("2023-04-05T13:45:30"),
      transactionHash: "0x9876543210abcdef9876543210abcdef9876543210abcdef9876543210abcdef",
      blockNumber: 16842753,
      blockchainNetwork: "Ethereum Mainnet"
    }
  ]
};

// Function to simulate voting on the blockchain
export const simulateBlockchainVote = async (
  voteId: string, 
  option: string, 
  voterAddress: string
): Promise<VoteReceipt> => {
  // Simulate blockchain delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const receipt = {
    voteId: voteId,
    voter: voterAddress,
    votedFor: option,
    timestamp: new Date(),
    transactionHash: "0x" + Array(64).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)).join(''),
    blockNumber: 16000000 + Math.floor(Math.random() * 1000000),
    blockchainNetwork: "Ethereum Goerli Testnet"
  };
  
  // Add to mock data
  mockData.receipts.push(receipt);
  
  // Update results
  const voteResults = mockData.results[voteId];
  if (voteResults) {
    const optionIndex = mockData.votes.find(v => v.id === voteId)
      ?.options.findIndex(o => o === option) || 0;
      
    voteResults[optionIndex].votes += 1;
  } else {
    // Initialize results if first vote
    const vote = mockData.votes.find(v => v.id === voteId);
    if (vote) {
      mockData.results[voteId] = vote.options.map((optText, idx) => ({
        optionId: idx,
        optionText: optText,
        votes: idx === vote.options.findIndex(o => o === option) ? 1 : 0
      }));
    }
  }
  
  return receipt;
};

// Function to create a new vote
export const createMockVote = (vote: Omit<Vote, 'id' | 'blockchainTxId'>): Vote => {
  const newVote = {
    ...vote,
    id: `vote-${mockData.votes.length + 1}`,
    blockchainTxId: "0x" + Array(64).fill(0).map(() => 
      Math.floor(Math.random() * 16).toString(16)).join('')
  };
  
  mockData.votes.push(newVote);
  return newVote;
};
