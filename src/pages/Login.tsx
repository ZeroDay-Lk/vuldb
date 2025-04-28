
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Login = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a very basic way to handle admin access - not secure for production!
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
      toast.success('Successfully logged in as admin');
    } else {
      toast.error('Invalid password');
    }
  };

  return (
    <div className="container mx-auto max-w-md py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full bg-vulnscribe-purple hover:bg-vulnscribe-lightpurple">
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
