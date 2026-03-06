
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Users, Settings, Eye, BarChart3 } from 'lucide-react';
import ComplianceVerifier from '@/components/ComplianceVerifier';
import ProofGenerator from '@/components/ProofGenerator';
import AccountManager from '@/components/AccountManager';
import SystemOverview from '@/components/SystemOverview';
import WasmIntegration from '@/components/WasmIntegration';
import SpartanServiceConfig from '@/components/SpartanServiceConfig';
import { Toaster } from '@/components/ui/toaster';
import { Account } from '@/hooks/useZKProof';
import './App.css';

function App() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center">
            <Shield className="w-8 h-8 mr-2 text-yellow-400" />
            Bank - Livret A Compliance System
          </h1>
          <p className="text-blue-200">Zero-Knowledge Proof Implementation for Article R221-2 Verification</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/10 backdrop-blur-md border border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="accounts" className="data-[state=active]:bg-white/20 text-white">
              <Users className="w-4 h-4 mr-2" />
              Accounts
            </TabsTrigger>
            <TabsTrigger value="generate" className="data-[state=active]:bg-white/20 text-white">
              <Shield className="w-4 h-4 mr-2" />
              Generate
            </TabsTrigger>
            <TabsTrigger value="verify" className="data-[state=active]:bg-white/20 text-white">
              <Eye className="w-4 h-4 mr-2" />
              Verify
            </TabsTrigger>
            <TabsTrigger value="wasm" className="data-[state=active]:bg-white/20 text-white">
              <Settings className="w-4 h-4 mr-2" />
              WASM
            </TabsTrigger>
            <TabsTrigger value="spartan" className="data-[state=active]:bg-white/20 text-white">
              <Settings className="w-4 h-4 mr-2" />
              Spartan-PQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <SystemOverview accounts={accounts} />
          </TabsContent>

          <TabsContent value="accounts">
            <AccountManager 
              accounts={accounts}
              onAddAccount={addAccount}
              onUpdateAccount={updateAccount}
              onDeleteAccount={deleteAccount}
            />
          </TabsContent>

          <TabsContent value="generate">
            <ProofGenerator accounts={accounts} />
          </TabsContent>

          <TabsContent value="verify">
            <ComplianceVerifier />
          </TabsContent>

          <TabsContent value="wasm">
            <WasmIntegration />
          </TabsContent>

          <TabsContent value="spartan">
            <SpartanServiceConfig />
          </TabsContent>
        </Tabs>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
