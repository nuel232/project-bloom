import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GraduationCap } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-[#242424] border-[#333333] p-8">
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-[#A259FF]" />
              <h1 className="text-2xl font-bold text-white">FYP Manager</h1>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-white mb-6">Login</h2>

          {error && (
            <Alert className="mb-4 bg-red-500/10 border-red-500/30">
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-[#1a1a1a] border-[#333333]"
                disabled={loading}
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-2 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-[#1a1a1a] border-[#333333]"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#A259FF] hover:bg-[#9145dd] text-white font-semibold"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#333333]">
            <p className="text-sm text-gray-400 mb-4">Demo Accounts:</p>
            <div className="space-y-2">
              <Button
                onClick={() => handleDemoLogin('admin@test.com', 'password123')}
                variant="outline"
                className="w-full text-gray-300 border-[#333333] hover:bg-[#2a2a2a]"
                disabled={loading}
              >
                Admin Demo
              </Button>
              <Button
                onClick={() => handleDemoLogin('supervisor@test.com', 'password123')}
                variant="outline"
                className="w-full text-gray-300 border-[#333333] hover:bg-[#2a2a2a]"
                disabled={loading}
              >
                Supervisor Demo
              </Button>
              <Button
                onClick={() => handleDemoLogin('student@test.com', 'password123')}
                variant="outline"
                className="w-full text-gray-300 border-[#333333] hover:bg-[#2a2a2a]"
                disabled={loading}
              >
                Student Demo
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            Note: Firebase credentials need to be configured in .env.local
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
