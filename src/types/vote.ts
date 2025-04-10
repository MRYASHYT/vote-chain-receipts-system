
export interface Vote {
  id: string;
  title: string;
  description: string;
  options: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdBy: string;
  blockchainTxId?: string;
}

export interface VoteResult {
  optionId: number;
  optionText: string;
  votes: number;
}

export interface VoteReceipt {
  voteId: string;
  voter: string;
  votedFor: string;
  timestamp: Date;
  transactionHash: string;
  blockNumber: number;
  blockchainNetwork: string;
}

export interface MockVoteData {
  votes: Vote[];
  results: Record<string, VoteResult[]>;
  receipts: VoteReceipt[];
}
