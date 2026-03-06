
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAdminAuth = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { toast } = useToast();

  const authenticateAdmin = async (password: string): Promise<boolean> => {
    setIsAuthenticating(true);
    
    // Simulate admin authentication - in production, this would be a secure backend call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple password check for demo - in production, use proper authentication
    const isValidAdmin = password === 'admin123';
    
    if (isValidAdmin) {
      setIsAdmin(true);
      toast({
        title: "Admin Access Granted",
        description: "You can now manage accounts and compliance settings.",
      });
    } else {
      toast({
        title: "Authentication Failed",
        description: "Invalid administrator credentials.",
        variant: "destructive"
      });
    }
    
    setIsAuthenticating(false);
    return isValidAdmin;
  };

  const logout = () => {
    setIsAdmin(false);
    toast({
      title: "Logged Out",
      description: "Admin session ended.",
    });
  };

  return {
    isAdmin,
    isAuthenticating,
    authenticateAdmin,
    logout
  };
};
