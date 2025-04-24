
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VoterVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
}

export function VoterVerification({ isOpen, onClose, walletAddress }: VoterVerificationProps) {
  const [voterId, setVoterId] = useState('');
  const [fullName, setFullName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      setError(null);

      // Check if voter exists and details match
      const { data: voters, error: searchError } = await supabase
        .from('voters')
        .select('*')
        .eq('voter_id', voterId.toUpperCase())
        .eq('full_name', fullName)
        .maybeSingle();

      if (searchError) throw searchError;

      if (!voters) {
        setError('Invalid voter ID or name. Please check your details and try again.');
        return;
      }

      // Update voter with wallet address
      const { error: updateError } = await supabase
        .from('voters')
        .update({ wallet_address: walletAddress, is_verified: true })
        .eq('id', voters.id);

      if (updateError) throw updateError;

      toast({
        title: "Verification Successful",
        description: "Your voter identity has been verified successfully.",
      });
      
      onClose();
    } catch (err) {
      console.error('Verification error:', err);
      setError('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Your Voter Identity</DialogTitle>
          <DialogDescription>
            Please enter your voter ID and full name exactly as registered.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-2">
            <Label htmlFor="voterId">Voter ID</Label>
            <Input
              id="voterId"
              placeholder="e.g., ABC1234567"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              placeholder="e.g., Rajesh Kumar"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleVerify} 
            disabled={!voterId || !fullName || isVerifying}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
