
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AccountType, getAccountTypeInfo } from '@/utils/accountTypes';

export interface Account {
  balance: number;
  salt: string;
  accountType?: AccountType;
}

export interface ProofResult {
  proof: string;
  publicSignals: string[];
  metadata: {
    protocol: string;
    accountsVerified: number;
    timestamp: string;
    processingTime: number;
    accountTypes?: Record<AccountType, number>;
    accountTypeLimits?: Record<AccountType, number>;
  };
}

export interface VerificationResult {
  isValid: boolean;
  metadata: {
    protocol: string;
    accountsVerified: number;
    timestamp: string;
    processingTime: number;
    accountTypes?: Record<AccountType, number>;
    accountTypeLimits?: Record<AccountType, number>;
  };
}

export const useZKProof = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const generateProof = async (accounts: Account[]): Promise<ProofResult | null> => {
    setIsGenerating(true);
    
    try {
      console.log(`Generating ZK proof for ${accounts.length} accounts with mixed account types`);
      
      // Validate each account against its specific type limit
      let allCompliant = true;
      const violations: string[] = [];
      
      for (const account of accounts) {
        const accountType = account.accountType || 'individual';
        const typeInfo = getAccountTypeInfo(accountType);
        
        if (account.balance > typeInfo.limit) {
          allCompliant = false;
          violations.push(`${typeInfo.label} account exceeds ${typeInfo.currency} ${typeInfo.limit.toLocaleString()} limit with balance ${typeInfo.currency} ${account.balance.toLocaleString()}`);
        }
      }
      
      // Count accounts by type and get their limits
      const accountTypes = accounts.reduce((acc, account) => {
        const type = account.accountType || 'individual';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<AccountType, number>);

      const accountTypeLimits = accounts.reduce((acc, account) => {
        const type = account.accountType || 'individual';
        const typeInfo = getAccountTypeInfo(type);
        acc[type] = typeInfo.limit;
        return acc;
      }, {} as Record<AccountType, number>);
      
      console.log('Calling zkp-operations edge function...');
      
      const { data, error } = await supabase.functions.invoke('zkp-operations', {
        body: {
          operation: 'generate',
          accounts,
          accountTypes,
          accountTypeLimits,
          allCompliant
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data received from edge function');
      }

      if (!data.success) {
        throw new Error(data.error || 'Proof generation failed');
      }

      const complianceStatus = allCompliant ? 'compliant' : 'non-compliant';
      const violationDetails = violations.length > 0 ? ` (${violations.join(', ')})` : '';

      toast({
        title: allCompliant ? "Proof Generated Successfully" : "Proof Generated - Compliance Issues Detected",
        description: `Generated proof for ${data.metadata.accountsVerified} accounts - All accounts are ${complianceStatus}${violationDetails}`,
        variant: allCompliant ? "default" : "destructive"
      });

      return {
        proof: data.proof,
        publicSignals: data.publicSignals,
        metadata: {
          ...data.metadata,
          accountTypes,
          accountTypeLimits
        }
      };

    } catch (error) {
      console.error('Proof generation error:', error);
      toast({
        title: "Proof Generation Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const verifyProof = async (proof: string, publicSignals: string[]): Promise<VerificationResult | null> => {
    setIsVerifying(true);
    
    try {
      console.log('Verifying ZK proof with account type-specific compliance checks');
      
      const { data, error } = await supabase.functions.invoke('zkp-operations', {
        body: {
          operation: 'verify',
          proof,
          publicSignals
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!data) {
        throw new Error('No data received from edge function');
      }

      if (!data.success) {
        throw new Error(data.error || 'Proof verification failed');
      }

      const isValid = data.verificationResult;
      
      toast({
        title: isValid ? "Proof Verified Successfully" : "Proof Verification Failed",
        description: isValid ? 
          "The proof is valid and shows all accounts comply with their respective Article R221-2 limits" : 
          "The proof is invalid or shows non-compliance with account type limits",
        variant: isValid ? "default" : "destructive"
      });

      return {
        isValid,
        metadata: data.metadata
      };

    } catch (error) {
      console.error('Proof verification error:', error);
      toast({
        title: "Verification Error",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    generateProof,
    verifyProof,
    isGenerating,
    isVerifying
  };
};
