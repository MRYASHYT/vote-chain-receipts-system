
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '@/context/Web3Context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { Shield, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// The secret admin code
const ADMIN_CODE = '10622455';

const formSchema = z.object({
  code: z.string().min(1, "Secret code is required")
});

type FormValues = z.infer<typeof formSchema>;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { isConnected } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if admin access is already granted on component mount
  useEffect(() => {
    const adminAccess = sessionStorage.getItem('adminAccess');
    if (adminAccess === 'true') {
      console.log("Admin access found in session storage, redirecting to /admin");
      navigate('/admin');
    }
  }, [navigate]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: ''
    }
  });
  
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simple validation of the admin code
    if (data.code === ADMIN_CODE) {
      // Store admin access in session storage
      sessionStorage.setItem('adminAccess', 'true');
      
      console.log("Admin code verified, access granted, redirecting to /admin");
      
      toast({
        title: "Access granted",
        description: "Welcome to the admin panel",
      });
      
      // Navigate to admin page immediately
      navigate('/admin');
    } else {
      toast({
        title: "Access denied",
        description: "Invalid secret code",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Alert variant="destructive">
          <AlertTitle>Wallet Connection Required</AlertTitle>
          <AlertDescription>
            You need to connect your wallet before accessing the admin area.
          </AlertDescription>
        </Alert>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="blockchain-card">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Enter the secret code to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Code</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter secret code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full gradient-bg border-0 hover:opacity-90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Access Admin Panel'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
