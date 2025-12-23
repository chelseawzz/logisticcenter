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
  const [emailError, setEmailError] = useState('');

  const verifikatorEmails = [
    'verifikator@telkomuniversity.ac.id',
    'admin.logistik@telkomuniversity.ac.id',
    'logistik.admin@telkomuniversity.ac.id',
  ];

  const validateEmailDomain = (emailValue: string): boolean => {
    if (!emailValue) {
      setEmailError('');
      return false;
    }

    if (emailValue.endsWith('@student.telkomuniversity.ac.id')) {
      setEmailError('');
      return true;
    }

    if (emailValue.endsWith('@telkomuniversity.ac.id')) {
      setEmailError('');
      return true;
    }

    if (emailValue.includes('@student') && !emailValue.endsWith('@student.telkomuniversity.ac.id')) {
      setEmailError('Email mahasiswa wajib menggunakan domain @student.telkomuniversity.ac.id.');
      return false;
    }

    if (emailValue.includes('@') && !emailValue.includes('@student')) {
      if (!emailValue.endsWith('@telkomuniversity.ac.id')) {
        setEmailError('Email dosen/staff wajib menggunakan domain @telkomuniversity.ac.id.');
        return false;
      }
    }

    if (emailValue.includes('@')) {
      setEmailError('Gunakan email kampus (@student.telkomuniversity.ac.id atau @telkomuniversity.ac.id)');
      return false;
    }

    return false;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmailDomain(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmailDomain(email)) {
      if (!emailError) {
        setEmailError('Email tidak valid. Gunakan email kampus.');
      }
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      let role: UserRole;

      if (email.endsWith('@student.telkomuniversity.ac.id')) {
        role = 'mahasiswa';
      } 
      else if (verifikatorEmails.includes(email.toLowerCase())) {
        role = 'verifikator';
      }
      else if (email.endsWith('@telkomuniversity.ac.id')) {
        role = 'dosen';
      }
      else {
        setEmailError('Gunakan email kampus yang valid.');
        setIsLoading(false);
        return;
      }

      const user: User = {
        id: '1',
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email,
        role,
      };

      toast.success('Login berhasil!', {
        description: `Selamat datang, ${user.name}`,
      });

      onLogin(user);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4F4] p-4">
      <Card className="w-full max-w-md shadow-2xl border border-gray-200">
        <CardHeader className="space-y-4 pb-6 bg-gradient-to-br from-[#B3202A] to-[#8A1C24] text-white rounded-t-lg">
          <div className="flex justify-center mb-2">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 transform transition-transform hover:scale-110 duration-300">
                
                <div className="absolute inset-0 bg-gradient-to-br from-[#B3202A] to-[#8A1C24] rounded-lg shadow-lg flex items-center justify-center">
                  <Package className="size-10 text-white" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-br from-[#F4A100] to-[#B3202A] rounded-lg transform -translate-y-2 translate-x-2 opacity-80 flex items-center justify-center">
                  <Package className="size-8 text-white opacity-70" />
                </div>

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
                  onChange={handleEmailChange}
                  className={`pl-10 h-12 ${emailError ? 'border-[#E53935] focus:border-[#E53935] focus:ring-[#E53935]' : 'border-gray-300 focus:border-[#B3202A] focus:ring-[#B3202A]'}`}
                  required
                />
              </div>

              {emailError ? (
                <p className="text-xs text-[#E53935]">{emailError}</p>
              ) : (
                <p className="text-xs text-gray-500">Contoh: nama@telkomuniversity.ac.id</p>
              )}
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
              disabled={isLoading}
              className="w-full h-12 bg-[#B3202A] hover:bg-[#8A1C24] text-white shadow-lg font-semibold transition-all duration-300w-full h-12 
             bg-gradient-to-r from-[#B3202A] to-black
             hover:from-black hover:to-[#8A1C24]
             text-white font-semibold 
             shadow-lg hover:shadow-xl
             transition-all duration-300"
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

        <div className="h-2 bg-linear-to from-[#B3202A] via-[#F4A100] to-black rounded-b-lg"></div>
      </Card>

      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-gray-500 text-xs">© 2025 LogistikCenter - Telkom University</p>
      </div>
    </div>
  );
}
