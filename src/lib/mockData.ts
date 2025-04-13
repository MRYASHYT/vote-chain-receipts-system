
import { MockVoteData, Vote, VoteReceipt, Candidate } from "@/types/vote";

// Mock candidates data
const candidates: Record<string, Candidate[]> = {
  "vote-1": [
    {
      id: "candidate-1",
      name: "Alice Johnson",
      photoUrl: "/images/candidate-1.jpg",
      biography: "Alice has 10 years of experience in protocol development and blockchain architecture.",
      optionId: 0
    },
    {
      id: "candidate-2",
      name: "Robert Chen",
      photoUrl: "/images/candidate-2.jpg",
      biography: "Marketing expert with focus on blockchain projects and community building.",
      optionId: 1
    },
    {
      id: "candidate-3",
      name: "Elena Rodriguez",
      photoUrl: "/images/candidate-3.jpg",
      biography: "DeFi specialist focusing on liquidity mechanisms and yield optimization.",
      optionId: 2
    },
    {
      id: "candidate-4",
      name: "Marcus Williams",
      photoUrl: "/images/candidate-4.jpg",
      biography: "Event coordinator with experience in both virtual and physical blockchain conferences.",
      optionId: 3
    }
  ],
  "vote-2": [
    {
      id: "candidate-5",
      name: "Sophia Lee",
      photoUrl: "/images/candidate-5.jpg",
      biography: "Governance expert advocating for higher quorum requirements for security.",
      optionId: 0
    },
    {
      id: "candidate-6",
      name: "David Park",
      photoUrl: "/images/candidate-6.jpg",
      biography: "Governance specialist arguing for maintaining current quorum levels for accessibility.",
      optionId: 1
    }
  ],
  "vote-3": [
    {
      id: "candidate-7",
      name: "James Wilson",
      photoUrl: "/images/candidate-7.jpg",
      biography: "Lead developer for the V2 smart contract upgrade implementation.",
      optionId: 0
    },
    {
      id: "candidate-8",
      name: "Ana Martins",
      photoUrl: "/images/candidate-8.jpg",
      biography: "Security auditor who recommended delaying the upgrade for further testing.",
      optionId: 1
    },
    {
      id: "candidate-9",
      name: "Terrence Goldman",
      photoUrl: "/images/candidate-9.jpg",
      biography: "Community moderator taking a neutral stance pending more information.",
      optionId: 2
    }
  ]
};

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
      blockchainTxId: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      candidates: candidates["vote-1"]
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
      blockchainTxId: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      candidates: candidates["vote-2"]
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
      blockchainTxId: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
      candidates: candidates["vote-3"]
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

// Function to add a new candidate
export const addCandidate = (voteId: string, candidate: Omit<Candidate, 'id'>): Candidate => {
  const vote = mockData.votes.find(v => v.id === voteId);
  
  if (!vote) {
    throw new Error(`Vote with ID ${voteId} not found`);
  }
  
  if (!vote.candidates) {
    vote.candidates = [];
  }
  
  const newCandidate = {
    ...candidate,
    id: `candidate-${Date.now()}`
  };
  
  vote.candidates.push(newCandidate);
  return newCandidate;
};

// Function to remove a candidate
export const removeCandidate = (voteId: string, candidateId: string): boolean => {
  const vote = mockData.votes.find(v => v.id === voteId);
  
  if (!vote || !vote.candidates) {
    return false;
  }
  
  const initialLength = vote.candidates.length;
  vote.candidates = vote.candidates.filter(c => c.id !== candidateId);
  
  return vote.candidates.length < initialLength;
};

