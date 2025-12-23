import { useState } from 'react';
import type { User } from '../App'; // ← FIX: type-only import

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

// Icons
import { Save, User as UserIcon, Mail, Shield } from 'lucide-react';

// Toast
import { toast } from 'sonner';

interface ProfilePageProps {
  user: User;
  onUpdate: (user: User) => void;
}

export function ProfilePage({ user, onUpdate }: ProfilePageProps) {
  const [name, setName] = useState(user.name);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      onUpdate({ ...user, name });
      toast.success('Profil berhasil diperbarui!');
      setIsLoading(false);
    }, 500);
  };

  const roleColors: Record<User['role'], string> = {
    mahasiswa: 'bg-[#147EFB] text-white',
    dosen: 'bg-[#4CAF50] text-white',
    staff: 'bg-[#F4A100] text-white',
    verifikator: 'bg-[#B3202A] text-white',
  };

  const avatarColors: Record<User['role'], string> = {
    mahasiswa: 'bg-[#147EFB]',
    dosen: 'bg-[#4CAF50]',
    staff: 'bg-[#F4A100]',
    verifikator: 'bg-[#B3202A]',
  };

  const roleLabels: Record<User['role'], string> = {
    mahasiswa: 'MAHASISWA',
    dosen: 'DOSEN',
    staff: 'STAFF',
    verifikator: 'VERIFIKATOR',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-gray-900 font-bold">PROFIL PENGGUNA</h2>
        <p className="text-gray-600 mt-1">Kelola informasi profil Anda</p>
      </div>

      <div className="grid gap-6">
        {/* Informasi Akun */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
            <CardDescription>Informasi dasar tentang akun Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`size-16 rounded-full ${avatarColors[user.role]} flex items-center justify-center`}>
                <UserIcon className="size-8 text-white" />
              </div>

              <div>
                <h3 className="text-gray-900">{user.name}</h3>

                <div className="flex items-center gap-2 mt-1">
                  <Mail className="size-4 text-gray-500" />
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <Shield className="size-4 text-gray-500" />
                  <Badge className={roleColors[user.role]}>
                    {roleLabels[user.role]}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Edit Profil */}
        <Card>
          <CardHeader>
            <CardTitle>Edit Profil</CardTitle>
            <CardDescription>Perbarui informasi profil Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 px-5">
              
              {/* Nama */}
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">Email tidak dapat diubah</p>
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="role"
                    type="text"
                    value={roleLabels[user.role]}
                    disabled
                    className="bg-gray-50"
                  />
                  <Badge className={roleColors[user.role]}>
                    {roleLabels[user.role]}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">Role ditentukan oleh sistem</p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#B3202A] hover:bg-[#8A1C24] text-white"
              >
                <Save className="size-4 mr-2" />
                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>

            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
