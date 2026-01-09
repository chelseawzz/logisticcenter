import { useState } from 'react';
import type { User, UserRole } from '../App';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

import { toast } from 'sonner';
import { LogIn, Package, Mail, Lock } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate email domain
    const validDomains = ['@student.telkomuniversity.ac.id', '@telkomuniversity.ac.id'];
    const isValidDomain = validDomains.some(domain => email.endsWith(domain));

    if (!isValidDomain) {
      toast.error('Email tidak valid', {
        description: 'Gunakan email kampus (@student.telkomuniversity.ac.id atau @telkomuniversity.ac.id)'
      });
      setIsLoading(false);
      return;
    }

    try {
      // 🔌 Kirim ke backend Java
      const res = await fetch('http://localhost:8080/logistikcenterbackendd/api/auth/login', {
        method: 'POST',
        credentials: 'include', // ⚠️ WAJIB untuk session
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Ambil role & name dari backend
        const user: User = {
          id: String(data.id),
          name: data.name,
          email: email,
          role: data.role as UserRole,
        };

        toast.success('Login berhasil!', {
          description: `Selamat datang, ${user.name}`
        });

        onLogin(user);
      } else {
        toast.error('Login gagal', {
          description: data.message || 'Email atau password salah'
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error koneksi', {
        description: 'Tidak bisa terhubung ke server backend'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4] p-4">
      <Card className="w-full max-w-md shadow-2xl border border-gray-200">
        <CardHeader className="space-y-4 pb-6 bg-gradient-to-br from-[#B3202A] to-[#8A1C24] text-white rounded-t-lg">
          {/* 3D Cube Logo */}
          <div className="flex justify-center mb-2">
            <div className="relative w-20 h-20">
              {/* Cube 3D Effect */}
              <div className="absolute inset-0 transform transition-transform hover:scale-110 duration-300">
                {/* Front face */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#B3202A] to-[#8A1C24] rounded-lg transform rotate-0 translate-z-0 shadow-lg flex items-center justify-center">
                  <Package className="size-10 text-white" />
                </div>
                {/* Top face */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#F4A100] to-[#B3202A] rounded-lg transform -translate-y-2 translate-x-2 opacity-80 flex items-center justify-center">
                  <Package className="size-8 text-white opacity-70" />
                </div>
                {/* Right face */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8A1C24] to-black rounded-lg transform translate-x-2 translate-y-2 opacity-70 flex items-center justify-center">
                  <Package className="size-8 text-white opacity-70" />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <CardTitle className="text-white">
              LogistikCenter
            </CardTitle>
            <CardDescription className="text-gray-100">
              Sistem Otomatisasi Peminjaman Aset Kampus
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-8 px-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email Kampus</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@telkomuniversity.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-[#B3202A] focus:ring-[#B3202A]"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                Contoh: nama@telkomuniversity.ac.id
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-[#B3202A] focus:ring-[#B3202A]"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-[#B3202A] to-[#8A1C24] hover:from-[#8A1C24] hover:to-black text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="size-5 mr-2" />
                  Login
                </>
              )}
            </Button>
          </form>
        </CardContent>

        {/* Card Footer Decoration */}
        <div className="h-2 bg-gradient-to-r from-[#B3202A] via-[#F4A100] to-black rounded-b-lg"></div>
      </Card>

      {/* Footer Text */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-gray-500 text-xs">
          © 2025 LogistikCenter - Telkom University
        </p>
      </div>
    </div>
  );
}