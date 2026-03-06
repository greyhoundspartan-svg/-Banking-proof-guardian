import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Hash, Shield, AlertTriangle, LogOut, Edit, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AccountType, ACCOUNT_TYPES, getAccountTypeInfo, formatCurrency } from '@/utils/accountTypes';
import { Account } from '@/hooks/useZKProof';
import AdminLogin from './AdminLogin';

interface AccountManagerProps {
  accounts: Account[];
  onAddAccount: (account: Account) => void;
  onUpdateAccount: (index: number, updatedAccount: Account) => void;
  onDeleteAccount: (index: number) => void;
}

const AccountManager = ({ accounts, onAddAccount, onUpdateAccount, onDeleteAccount }: AccountManagerProps) => {
  const { toast } = useToast();
  const { isAdmin, isAuthenticating, authenticateAdmin, logout } = useAdminAuth();
  const [newBalance, setNewBalance] = useState('');
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType>('individual');
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editBalance, setEditBalance] = useState('');
  const [editAccountType, setEditAccountType] = useState<AccountType>('individual');

  const addAccount = () => {
    if (!newBalance || isNaN(Number(newBalance))) {
      toast({
        title: "Invalid Balance",
        description: "Please enter a valid numeric balance.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const balance = Number(newBalance);
      const salt = Math.random().toString(36).substring(2, 15);
      
      const newAccount: Account = {
        balance,
        salt,
        accountType: selectedAccountType
      };

      onAddAccount(newAccount);
      setNewBalance('');
      setLoading(false);

      toast({
        title: "Account Added",
        description: `${getAccountTypeInfo(selectedAccountType).label} account has been added with balance ${formatCurrency(balance)}.`,
      });
    }, 1000);
  };

  const hashAccount = (account: Account) => {
    // Simple hash function for demo - in production, use proper cryptographic hashing
    const data = `${account.balance}-${account.salt}`;
    const hash = btoa(data).substring(0, 16);
    
    toast({
      title: "Account Hashed",
      description: `Hash: ${hash}`,
    });
  };

  const startEditing = (index: number) => {
    const account = accounts[index];
    setEditingIndex(index);
    setEditBalance(account.balance.toString());
    setEditAccountType(account.accountType || 'individual');
  };

  const saveEdit = () => {
    if (editingIndex === null) return;

    if (!editBalance || isNaN(Number(editBalance))) {
      toast({
        title: "Invalid Balance",
        description: "Please enter a valid numeric balance.",
        variant: "destructive"
      });
      return;
    }

    const updatedAccount: Account = {
      ...accounts[editingIndex],
      balance: Number(editBalance),
      accountType: editAccountType
    };

    onUpdateAccount(editingIndex, updatedAccount);
    setEditingIndex(null);
    setEditBalance('');

    toast({
      title: "Account Updated",
      description: "Account has been successfully updated.",
    });
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditBalance('');
  };

  if (!isAdmin) {
    return <AdminLogin onAuthenticate={authenticateAdmin} isAuthenticating={isAuthenticating} />;
  }

  const complianceStats = {
    total: accounts.length,
    compliant: accounts.filter(acc => {
      const typeInfo = getAccountTypeInfo(acc.accountType || 'individual');
      return acc.balance <= typeInfo.limit;
    }).length,
    nonCompliant: accounts.filter(acc => {
      const typeInfo = getAccountTypeInfo(acc.accountType || 'individual');
      return acc.balance > typeInfo.limit;
    }).length
  };

  const statsByType = Object.values(ACCOUNT_TYPES).map(typeInfo => {
    const typeAccounts = accounts.filter(acc => (acc.accountType || 'individual') === typeInfo.id);
    return {
      ...typeInfo,
      count: typeAccounts.length,
      compliant: typeAccounts.filter(acc => acc.balance <= typeInfo.limit).length
    };
  });

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="text-white font-semibold">Administrator Panel</h3>
                <p className="text-blue-200 text-sm">Managing Livret A account compliance</p>
              </div>
            </div>
            <Button 
              onClick={logout}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Total Accounts</p>
                <p className="text-3xl font-bold text-white">{complianceStats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-200">Compliant</p>
                <p className="text-3xl font-bold text-white">{complianceStats.compliant}</p>
              </div>
              <Shield className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-200">Non-Compliant</p>
                <p className="text-3xl font-bold text-white">{complianceStats.nonCompliant}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Types Statistics */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Account Types Overview</CardTitle>
          <CardDescription className="text-blue-200">
            Compliance status by account type according to Article R221-2
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statsByType.map((type) => (
              <div key={type.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h4 className="text-white font-semibold mb-2">{type.label}</h4>
                <p className="text-blue-200 text-sm mb-3">{type.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Limit:</span>
                    <span className="text-white font-mono">{formatCurrency(type.limit)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Total:</span>
                    <span className="text-white">{type.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Compliant:</span>
                    <span className="text-green-400">{type.compliant}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Account */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Account
          </CardTitle>
          <CardDescription className="text-blue-200">
            Add a new Livret A account with automatic balance hashing using Poseidon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            <div>
              <label className="block text-white text-sm mb-2">Initial Balance (EUR)</label>
              <Input
                placeholder="Enter account balance"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                type="number"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={addAccount} 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Adding...' : 'Add Account'}
              </Button>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-blue-200 text-sm">
              <strong>Selected Type:</strong> {getAccountTypeInfo(selectedAccountType).label} - 
              Limit: {formatCurrency(getAccountTypeInfo(selectedAccountType).limit)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Account Registry */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Hash className="w-5 h-5 mr-2" />
            Account Registry
          </CardTitle>
          <CardDescription className="text-blue-200">
            All account balances are stored with type-specific compliance validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-blue-200">No accounts created yet. Add your first account above.</p>
            </div>
          ) : (
            <div className="rounded-md border border-white/20">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-blue-200">Account ID</TableHead>
                    <TableHead className="text-blue-200">Type</TableHead>
                    <TableHead className="text-blue-200">Balance</TableHead>
                    <TableHead className="text-blue-200">Salt</TableHead>
                    <TableHead className="text-blue-200">Status</TableHead>
                    <TableHead className="text-blue-200">Hash Account</TableHead>
                    <TableHead className="text-blue-200">Edit Account</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account, index) => {
                    const typeInfo = getAccountTypeInfo(account.accountType || 'individual');
                    const isCompliant = account.balance <= typeInfo.limit;
                    const isEditing = editingIndex === index;
                    
                    return (
                      <TableRow key={index} className="border-white/20">
                        <TableCell className="text-white font-medium">ACC-{(index + 1).toString().padStart(3, '0')}</TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Select value={editAccountType} onValueChange={(value: AccountType) => setEditAccountType(value)}>
                              <SelectTrigger className="bg-white/10 border-white/20 text-white w-48">
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
                          ) : (
                            <div className="text-blue-300 text-sm">
                              <div>{typeInfo.label}</div>
                              <div className="text-xs text-gray-400">{formatCurrency(typeInfo.limit)} limit</div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-white">
                          {isEditing ? (
                            <Input
                              value={editBalance}
                              onChange={(e) => setEditBalance(e.target.value)}
                              className="bg-white/10 border-white/20 text-white w-32"
                              type="number"
                            />
                          ) : (
                            formatCurrency(account.balance)
                          )}
                        </TableCell>
                        <TableCell className="text-gray-400 font-mono text-sm">
                          {account.salt.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={isCompliant ? "default" : "destructive"}
                            className={isCompliant ? "bg-green-500" : "bg-red-500"}
                          >
                            {isCompliant ? 'Compliant' : 'Non-Compliant'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => hashAccount(account)}
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Hash
                          </Button>
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <div className="flex space-x-2">
                              <Button
                                onClick={saveEdit}
                                variant="outline"
                                size="sm"
                                className="bg-green-600 border-green-600 text-white hover:bg-green-700"
                              >
                                Save
                              </Button>
                              <Button
                                onClick={cancelEdit}
                                variant="outline"
                                size="sm"
                                className="bg-gray-600 border-gray-600 text-white hover:bg-gray-700"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              onClick={() => startEditing(index)}
                              variant="outline"
                              size="sm"
                              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountManager;
