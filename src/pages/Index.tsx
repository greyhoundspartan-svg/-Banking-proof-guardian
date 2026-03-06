
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, FileCheck, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import AccountManager from '@/components/AccountManager';
import ProofGenerator from '@/components/ProofGenerator';
import ComplianceVerifier from '@/components/ComplianceVerifier';
import SystemOverview from '@/components/SystemOverview';
import WasmIntegration from '@/components/WasmIntegration';
import { Account } from '@/hooks/useZKProof';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [accounts, setAccounts] = useState<Account[]>([]);

  const addAccount = (account: Account) => {
    setAccounts(prev => [...prev, account]);
  };

  const updateAccount = (index: number, updatedAccount: Account) => {
    setAccounts(prev => prev.map((acc, i) => i === index ? updatedAccount : acc));
  };

  const deleteAccount = (index: number) => {
    setAccounts(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">BankGuard ZKP</h1>
                <p className="text-sm text-blue-200">Zero-Knowledge Banking Compliance</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                WASM Ready
              </Badge>
              <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400">
                <Lock className="w-3 h-3 mr-1" />
                Edge Functions
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Banking Compliance with Zero-Knowledge Proofs
          </h2>
          <p className="text-blue-200 text-lg max-w-3xl">
            Prove regulatory compliance without revealing sensitive financial data. 
            Our system uses WebAssembly-powered Spartan-PQ post-quantum zkSNARK protocol to verify that no account exceeds 
            their respective limits while maintaining complete privacy.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-md">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              <FileCheck className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="wasm" className="text-white data-[state=active]:bg-white/20">
              <Lock className="w-4 h-4 mr-2" />
              WASM
            </TabsTrigger>
            <TabsTrigger value="accounts" className="text-white data-[state=active]:bg-white/20">
              <Users className="w-4 h-4 mr-2" />
              Accounts
            </TabsTrigger>
            <TabsTrigger value="proof" className="text-white data-[state=active]:bg-white/20">
              <Shield className="w-4 h-4 mr-2" />
              Generate Proof
            </TabsTrigger>
            <TabsTrigger value="verify" className="text-white data-[state=active]:bg-white/20">
              <CheckCircle className="w-4 h-4 mr-2" />
              Verify
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <SystemOverview accounts={accounts} />
          </TabsContent>

          <TabsContent value="wasm">
            <WasmIntegration />
          </TabsContent>

          <TabsContent value="accounts">
            <AccountManager 
              accounts={accounts}
              onAddAccount={addAccount}
              onUpdateAccount={updateAccount}
              onDeleteAccount={deleteAccount}
            />
          </TabsContent>

          <TabsContent value="proof">
            <ProofGenerator accounts={accounts} />
          </TabsContent>

          <TabsContent value="verify">
            <ComplianceVerifier />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
