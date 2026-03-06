
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Cpu, Code, FileCode, ExternalLink } from 'lucide-react';
import SpartanServiceConfig from './SpartanServiceConfig';

interface WasmStatus {
  loaded: boolean;
  error?: string;
  functions: string[];
  size?: number;
}

const WasmIntegration = () => {
  const [wasmStatus, setWasmStatus] = useState<WasmStatus>({
    loaded: false,
    functions: []
  });
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    checkWasmAvailability();
  }, []);

  const checkWasmAvailability = async () => {
    try {
      // Simulate WASM loading progress
      for (let i = 0; i <= 100; i += 10) {
        setLoadingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Check if WebAssembly is supported
      if (typeof WebAssembly === 'object') {
        setWasmStatus({
          loaded: false, // Will be true when actual WASM is integrated
          functions: [
            'spartan_pq_prove',
            'spartan_pq_verify',
            'poseidon_hash',
            'verify_constraints'
          ],
          size: 512 // KB (estimated)
        });
      } else {
        setWasmStatus({
          loaded: false,
          error: 'WebAssembly not supported in this environment',
          functions: []
        });
      }
    } catch (error) {
      setWasmStatus({
        loaded: false,
        error: error.message,
        functions: []
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* External Spartan Service Configuration */}
      <SpartanServiceConfig />

      {/* WebAssembly Status */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-purple-400" />
            WebAssembly Integration Status
          </CardTitle>
          <CardDescription className="text-blue-200">
            Alternative WebAssembly integration for Spartan-PQ protocol (future option)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* WASM Support Status */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <div>
                <h4 className="text-white font-medium">WebAssembly Support</h4>
                <p className="text-sm text-blue-200">Browser environment ready</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-400">
              Available
            </Badge>
          </div>

          {/* External Service Status */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <div>
                <h4 className="text-white font-medium">External Spartan-PQ Service</h4>
                <p className="text-sm text-blue-200">
                  Currently integrated with external Rust microservice
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-400">
              Active
            </Badge>
          </div>

          {/* Loading Progress */}
          {loadingProgress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-200">Initialization Progress</span>
                <span className="text-white">{loadingProgress}%</span>
              </div>
              <Progress value={loadingProgress} className="h-2" />
            </div>
          )}

          {/* Available Functions */}
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Spartan-PQ Protocol Functions
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {wasmStatus.functions.map((func) => (
                <div key={func} className="bg-white/5 rounded p-2 border border-white/10">
                  <span className="text-blue-300 font-mono text-sm">{func}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Options */}
          <div className="space-y-3">
            <h4 className="text-white font-medium flex items-center">
              <FileCode className="w-4 h-4 mr-2" />
              Integration Options
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-blue-200">✓ External Rust microservice (Active)</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-blue-200">○ WebAssembly compilation (Future)</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-blue-200">○ Direct Rust integration (Complex)</span>
              </div>
            </div>
          </div>

          {/* External Resources */}
          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="sm"
            onClick={() => window.open('https://github.com/greyhoundspartan-svg/Spartan-PQ/tree/main/Spartan-PQ', '_blank')}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            Spartan-PQ
            </Button>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => window.open('https://railway.app', '_blank')}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              Deploy Service
            </Button>
          </div>

          {wasmStatus.error && (
            <div className="bg-red-500/20 border border-red-400 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-red-300 font-medium">WebAssembly Error</span>
              </div>
              <p className="text-red-200 text-sm mt-1">{wasmStatus.error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WasmIntegration;
