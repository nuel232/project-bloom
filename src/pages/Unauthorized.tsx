import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
      <Card className="bg-[#242424] border-[#333333] p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="w-12 h-12 text-[#A259FF] mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-400 mb-6">
            You don't have permission to access this page. Please contact your administrator.
          </p>
          <div className="flex gap-3 w-full">
            <Button
              onClick={() => navigate('/')}
              className="flex-1 bg-[#A259FF] hover:bg-[#9145dd] text-white"
            >
              Go Home
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1 border-[#333333] text-gray-300"
            >
              Go Back
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Unauthorized;
