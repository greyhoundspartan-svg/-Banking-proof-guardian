
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock } from 'lucide-react';

interface AdminLoginProps {
  onAuthenticate: (password: string) => Promise<boolean>;
  isAuthenticating: boolean;
}

const AdminLogin = ({ onAuthenticate, isAuthenticating }: AdminLoginProps) => {
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password) {
      await onAuthenticate(password);
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-white">Administrator Access</CardTitle>
          <CardDescription className="text-blue-200">
            Administrative credentials required to manage accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter administrator password"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                disabled={isAuthenticating}
              />
              <p className="text-xs text-blue-300">Demo password: admin123</p>
            </div>
            <Button 
              type="submit" 
              disabled={!password || isAuthenticating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isAuthenticating ? (
                <>
                  <Lock className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Access Admin Panel
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
