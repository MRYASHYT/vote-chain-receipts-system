
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Check, Copy } from 'lucide-react';
import { VoteReceipt as VoteReceiptType } from '@/types/vote';
import { jsPDF } from 'jspdf';
import { useToast } from '@/components/ui/use-toast';

interface VoteReceiptProps {
  receipt: VoteReceiptType;
}

export function VoteReceipt({ receipt }: VoteReceiptProps) {
  const { toast } = useToast();
  const [copying, setCopying] = useState<string | null>(null);
  
  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopying(field);
    toast({
      title: "Copied to clipboard",
      description: `${field} has been copied to your clipboard.`,
    });
    
    setTimeout(() => setCopying(null), 2000);
  };
  
  const downloadReceipt = () => {
    const doc = new jsPDF();
    
    // Add logo
    doc.setFillColor(52, 152, 219);
    doc.rect(15, 15, 15, 15, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("VC", 19, 25);
    
    // Add title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.text("Vote Receipt", 40, 25);
    
    // Add horizontal line
    doc.setDrawColor(220, 220, 220);
    doc.line(15, 35, 195, 35);
    
    // Add content
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    
    const addField = (label: string, value: string, y: number) => {
      doc.setFont(undefined, 'bold');
      doc.text(`${label}:`, 15, y);
      doc.setFont(undefined, 'normal');
      
      // Handle long values like transaction hashes
      if (value.length > 50) {
        doc.text(value.substring(0, 50), 60, y);
        doc.text(value.substring(50), 60, y + 6);
        return y + 12;
      } else {
        doc.text(value, 60, y);
        return y + 10;
      }
    };
    
    let y = 50;
    y = addField("Vote ID", receipt.voteId, y);
    y = addField("Voter Address", receipt.voter, y);
    y = addField("Vote Cast For", receipt.votedFor, y);
    y = addField("Timestamp", receipt.timestamp.toLocaleString(), y);
    y = addField("Transaction Hash", receipt.transactionHash, y);
    y = addField("Block Number", receipt.blockNumber.toString(), y);
    y = addField("Network", receipt.blockchainNetwork, y);
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text("This receipt verifies your vote on the blockchain.", 15, 250);
    doc.text("VoteChain - Secure, Transparent, Decentralized", 15, 257);
    
    // Save the PDF
    doc.save(`vote-receipt-${receipt.voteId}.pdf`);
    
    toast({
      title: "Receipt Downloaded",
      description: "Your vote receipt has been downloaded as a PDF.",
    });
  };

  return (
    <Card className="blockchain-card max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Vote Receipt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium text-right">Vote ID:</div>
            <div className="col-span-2 break-all flex items-center">
              {receipt.voteId}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-1"
                onClick={() => handleCopy(receipt.voteId, "Vote ID")}
              >
                {copying === "Vote ID" ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>
            
            <div className="font-medium text-right">Voter Address:</div>
            <div className="col-span-2 break-all flex items-center">
              {receipt.voter}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-1"
                onClick={() => handleCopy(receipt.voter, "Voter Address")}
              >
                {copying === "Voter Address" ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>
            
            <div className="font-medium text-right">Vote Cast For:</div>
            <div className="col-span-2">{receipt.votedFor}</div>
            
            <div className="font-medium text-right">Timestamp:</div>
            <div className="col-span-2">{receipt.timestamp.toLocaleString()}</div>
            
            <div className="font-medium text-right">Transaction Hash:</div>
            <div className="col-span-2 break-all flex items-center">
              {receipt.transactionHash}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 ml-1"
                onClick={() => handleCopy(receipt.transactionHash, "Transaction Hash")}
              >
                {copying === "Transaction Hash" ? <Check size={14} /> : <Copy size={14} />}
              </Button>
            </div>
            
            <div className="font-medium text-right">Block Number:</div>
            <div className="col-span-2">{receipt.blockNumber}</div>
            
            <div className="font-medium text-right">Network:</div>
            <div className="col-span-2">{receipt.blockchainNetwork}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={downloadReceipt} className="gradient-bg border-0 hover:opacity-90">
          <Download size={16} className="mr-2" />
          Download Receipt
        </Button>
      </CardFooter>
    </Card>
  );
}

export default VoteReceipt;
