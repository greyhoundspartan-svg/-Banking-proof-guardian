
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Play, Download, Clock, CheckCircle, Cpu, FileCode, AlertTriangle } from 'lucide-react';
import { useZKProof, type Account } from '@/hooks/useZKProof';
import { AccountType, getAccountTypeInfo, formatCurrency, ACCOUNT_TYPES } from '@/utils/accountTypes';

interface ProofGenerationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  duration?: number;
}

interface ProofGeneratorProps {
  accounts: Account[];
}

const ProofGenerator = ({ accounts }: ProofGeneratorProps) => {
  const { generateProof, isGenerating } = useZKProof();
  const [progress, setProgress] = useState(0);
  const [generatedProof, setGeneratedProof] = useState('');
  const [proofMetadata, setProofMetadata] = useState<any>(null);
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>('individual');
  const [steps, setSteps] = useState<ProofGenerationStep[]>([
    {
      id: 'hash',
      name: 'Balance Hashing',
      description: 'Hashing account balances using Poseidon',
      status: 'pending'
    },
    {
      id: 'circuit',
      name: 'Circuit Compilation',
      description: 'Compiling constraint circuit for balance verification',
      status: 'pending'
    },
    {
      id: 'witness',
      name: 'Witness Generation',
      description: 'Generating witness for constraint satisfaction',
      status: 'pending'
    },
    {
      id: 'spartan',
      name: 'ZK Proof Generation',
      description: 'Generating zero-knowledge proof using cryptographic protocol',
      status: 'pending'
    }
  ]);

  const generateAccountTypeSpecificProof = async () => {
    // Filter accounts by selected type
    const filteredAccounts = accounts.filter(account => account.accountType === selectedAccountType);
    
    if (filteredAccounts.length === 0) {
      alert(`No ${getAccountTypeInfo(selectedAccountType).label} accounts found in the registry`);
      return;
    }

    setProgress(0);
    setGeneratedProof('');
    setProofMetadata(null);

    // Reset all steps to pending
    setSteps(steps.map(step => ({ ...step, status: 'pending' as const })));

    // Simulate step progression
    for (let i = 0; i < steps.length; i++) {
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index === i ? 'running' : index < i ? 'completed' : 'pending'
      })));

      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(((i + 1) / steps.length) * 80); // 80% for steps, 20% for actual proof
    }

    // Call the real edge function with filtered accounts
    const result = await generateProof(filteredAccounts);
    
    if (result) {
      setGeneratedProof(JSON.stringify({
        proof: result.proof,
        publicSignals: result.publicSignals,
        ...result.metadata
      }, null, 2));
      setProofMetadata(result.metadata);
      
      // Mark all steps as completed
      setSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));
      setProgress(100);
    } else {
      // Mark current step as error
      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index === steps.length - 1 ? 'error' : step.status
      })));
    }
  };

  const downloadProof = () => {
    const blob = new Blob([generatedProof], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zkp-compliance-proof-${selectedAccountType}-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Clock className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <div className="w-4 h-4 rounded-full bg-red-400" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-400" />;
    }
  };

  const selectedTypeInfo = getAccountTypeInfo(selectedAccountType);
  const filteredAccounts = accounts.filter(account => account.accountType === selectedAccountType);

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-yellow-400" />
            Zero-Knowledge Proof Generation
          </CardTitle>
          <CardDescription className="text-blue-200">
            Generate cryptographic proofs with account type-specific compliance validation from Account Registry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Type Selection */}
            <div>
              <label className="block text-white text-sm mb-2">Account Type</label>
              <Select value={selectedAccountType} onValueChange={(value: AccountType) => setSelectedAccountType(value)}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ACCOUNT_TYPES).map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div>
                        <div>{type.label}</div>
                        <div className="text-xs text-gray-500">{formatCurrency(type.limit)} limit</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <Button 
                onClick={generateAccountTypeSpecificProof} 
                disabled={isGenerating || filteredAccounts.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Proof
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Account Status Preview */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-blue-200 text-sm">Selected Type:</span>
                <p className="text-white font-medium">{selectedTypeInfo.label}</p>
              </div>
              <div>
                <span className="text-blue-200 text-sm">Compliance Limit:</span>
                <p className="text-white font-medium">{formatCurrency(selectedTypeInfo.limit)}</p>
              </div>
              <div>
                <span className="text-blue-200 text-sm">Accounts Found:</span>
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium">{filteredAccounts.length}</p>
                  {filteredAccounts.length === 0 && (
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {isGenerating && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Overall Progress</span>
                  <span className="text-white">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generation Steps */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Cpu className="w-5 h-5 mr-2" />
            Cryptographic Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <div className="flex-shrink-0">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{step.name}</h4>
                  <p className="text-sm text-blue-200">{step.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <Badge 
                    variant="outline" 
                    className={
                      step.status === 'completed' ? 'bg-green-500/20 text-green-300 border-green-400' :
                      step.status === 'running' ? 'bg-blue-500/20 text-blue-300 border-blue-400' :
                      step.status === 'error' ? 'bg-red-500/20 text-red-300 border-red-400' :
                      'bg-gray-500/20 text-gray-300 border-gray-400'
                    }
                  >
                    {step.status === 'running' ? 'Processing' : 
                     step.status === 'completed' ? 'Complete' : 
                     step.status === 'error' ? 'Error' : 'Pending'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Proof Display */}
      {generatedProof && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <FileCode className="w-5 h-5 mr-2" />
                Generated {selectedTypeInfo.label} Account Proof
              </div>
              <Button 
                onClick={downloadProof}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </CardTitle>
            <CardDescription className="text-blue-200">
              Zero-knowledge proof for {filteredAccounts.length} {selectedTypeInfo.label} account(s) with {formatCurrency(selectedTypeInfo.limit)} limit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={generatedProof}
              readOnly
              className="bg-black/30 border-white/20 text-gray-300 font-mono text-sm min-h-[300px]"
            />
            {proofMetadata && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-200">Protocol:</span>
                    <p className="text-white font-medium">{proofMetadata.protocol}</p>
                  </div>
                  <div>
                    <span className="text-blue-200">Accounts:</span>
                    <p className="text-white font-medium">{proofMetadata.accountsVerified} verified</p>
                  </div>
                  <div>
                    <span className="text-blue-200">Processing Time:</span>
                    <p className="text-white font-medium">{proofMetadata.processingTime}ms</p>
                  </div>
                  <div>
                    <span className="text-blue-200">Generated:</span>
                    <p className="text-white font-medium">{new Date(proofMetadata.timestamp).toLocaleTimeString()}</p>
                  </div>
                </div>
                
                {/* Account Type Distribution */}
                {proofMetadata.accountTypes && (
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white font-semibold mb-3">Account Type Validation Results</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(proofMetadata.accountTypes).map(([type, count]) => {
                        const typeInfo = getAccountTypeInfo(type as AccountType);
                        const limit = proofMetadata.accountTypeLimits?.[type];
                        return (
                          <div key={type} className="bg-white/5 rounded p-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-blue-300 text-sm">{typeInfo.label}</span>
                              <Badge variant="outline" className="text-xs">{count as number} account(s)</Badge>
                            </div>
                            <p className="text-white text-xs">Limit: {formatCurrency(limit || typeInfo.limit)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProofGenerator;
