
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Users, Database, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { Account } from '@/hooks/useZKProof';
import { getAccountTypeInfo, formatCurrency, ACCOUNT_TYPES } from '@/utils/accountTypes';

interface SystemOverviewProps {
  accounts: Account[];
}

const SystemOverview = ({ accounts }: SystemOverviewProps) => {
  // Calculate compliance statistics
  const totalAccounts = accounts.length;
  const accountsByType = accounts.reduce((acc, account) => {
    const type = account.accountType || 'individual';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const complianceStats = accounts.map(account => {
    const type = account.accountType || 'individual';
    const typeInfo = getAccountTypeInfo(type);
    const isCompliant = account.balance <= typeInfo.limit;
    const utilizationRate = (account.balance / typeInfo.limit) * 100;
    return { isCompliant, utilizationRate, type };
  });

  const compliantAccounts = complianceStats.filter(stat => stat.isCompliant).length;
  const complianceRate = totalAccounts > 0 ? (compliantAccounts / totalAccounts) * 100 : 100;
  const averageUtilization = totalAccounts > 0 
    ? complianceStats.reduce((sum, stat) => sum + stat.utilizationRate, 0) / totalAccounts 
    : 0;

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center text-lg">
              <Users className="w-5 h-5 mr-2 text-blue-400" />
              Total Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{totalAccounts}</div>
            <p className="text-blue-200 text-sm">Registered in system</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center text-lg">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              Compliance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{Math.round(complianceRate)}%</div>
            <Progress value={complianceRate} className="h-2 mb-2" />
            <p className="text-blue-200 text-sm">{compliantAccounts} of {totalAccounts} compliant</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-white flex items-center text-lg">
              <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
              Avg Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{Math.round(averageUtilization)}%</div>
            <Progress value={averageUtilization} className="h-2 mb-2" />
            <p className="text-blue-200 text-sm">Of account limits</p>
          </CardContent>
        </Card>
      </div>

      {/* Account Types Distribution */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Account Types Distribution
          </CardTitle>
          <CardDescription className="text-blue-200">
            Breakdown by Article R221-2 account categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.values(ACCOUNT_TYPES).map((typeInfo) => {
              const count = accountsByType[typeInfo.id] || 0;
              const percentage = totalAccounts > 0 ? (count / totalAccounts) * 100 : 0;
              
              return (
                <div key={typeInfo.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">{typeInfo.label}</h4>
                    <Badge variant="outline" className="text-xs">
                      {count} account{count !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <p className="text-blue-200 text-sm mb-3">{formatCurrency(typeInfo.limit)} limit</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-blue-300">Distribution</span>
                      <span className="text-white">{Math.round(percentage)}%</span>
                    </div>
                    <Progress value={percentage} className="h-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* System Features */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-yellow-400" />
            Zero-Knowledge Proof System Features
          </CardTitle>
          <CardDescription className="text-blue-200">
            Privacy-preserving compliance verification capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-3">Banking Institution Features</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Account Registry Management</p>
                    <p className="text-blue-200 text-xs">Add and manage customer accounts by type</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Type-Specific Proof Generation</p>
                    <p className="text-blue-200 text-xs">Generate proofs by account type with specific limits</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Spartan-PQ Protocol Integration</p>
                    <p className="text-blue-200 text-xs">Post-quantum WebAssembly-powered cryptographic proofs</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-3">Government Verification</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Administrative Access Control</p>
                    <p className="text-blue-200 text-xs">Secure government administrator authentication</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Zero-Knowledge Verification</p>
                    <p className="text-blue-200 text-xs">Verify compliance without accessing account data</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-white text-sm font-medium">Article R221-2 Compliance</p>
                    <p className="text-blue-200 text-xs">Automated validation against regulatory limits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Issues Alert */}
      {complianceRate < 100 && (
        <Card className="bg-red-500/10 backdrop-blur-md border-red-400/20">
          <CardHeader>
            <CardTitle className="text-red-300 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Compliance Issues Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-200">
              {totalAccounts - compliantAccounts} account(s) exceed their respective Article R221-2 limits. 
              These accounts require attention to ensure regulatory compliance.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemOverview;
