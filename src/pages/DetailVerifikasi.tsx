import { useState } from 'react';
import type { Booking, User } from '../App';

// shadcn/ui imports (sudah diperbaiki path-nya)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

// icons
import { 
  User as UserIcon, 
  Package, 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Download,
  ArrowLeft,
  Home,
  Mail,
  Clock
} from 'lucide-react';

// toast
import { toast } from 'sonner';

interface DetailVerifikasiProps {
  booking: Booking;
  onBack: () => void;
  onApprove?: (id: string, note: string) => void;
  onReject?: (id: string, note: string) => void;
}

export function DetailVerifikasi({ booking, onBack, onApprove, onReject }: DetailVerifikasiProps) {
  const [verificationNote, setVerificationNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      weekday: 'long'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.success('Pengajuan Disetujui!', {
        description: `Peminjaman ${booking.assetName} telah disetujui`
      });
      if (onApprove) onApprove(booking.id, verificationNote);
      setIsProcessing(false);
      onBack();
    }, 1000);
  };

  const handleReject = () => {
    if (!verificationNote.trim()) {
      toast.error('Catatan diperlukan', {
        description: 'Mohon berikan alasan penolakan'
      });
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      toast.error('Pengajuan Ditolak', {
        description: `Peminjaman ${booking.assetName} telah ditolak`
      });
      if (onReject) onReject(booking.id, verificationNote);
      setIsProcessing(false);
      onBack();
    }, 1000);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'ajukan':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            <Clock className="size-3 mr-1" />
            Menunggu Verifikasi
          </Badge>
        );
      case 'disetujui':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
            <CheckCircle className="size-3 mr-1" />
            Disetujui
          </Badge>
        );
      case 'ditolak':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
            <XCircle className="size-3 mr-1" />
            Ditolak
          </Badge>
        );
      case 'selesai':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
            <CheckCircle className="size-3 mr-1" />
            Selesai
          </Badge>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Back Button */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="size-4 mr-2" />
          Kembali
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 font-bold">DETAIL VERIFIKASI PINJAMAN</h2>
            <p className="text-gray-600 mt-1">Informasi lengkap pengajuan peminjaman</p>
          </div>
          <div>
            {getStatusBadge(booking.status)}
          </div>
        </div>
      </div>

      {/* 4 Main Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* Card 1 */}
        <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UserIcon className="size-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-blue-900 font-bold">Informasi Peminjam</CardTitle>
                <CardDescription>Data pengguna yang mengajukan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-5">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 bg-[#B3202A]">
                <AvatarFallback className="bg-[#B3202A] text-white">
                  {getInitials(booking.userName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-gray-900">{booking.userName}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <Mail className="size-4" />
                  <span>Email tersedia di sistem</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Role Pengguna:</span>
                <Badge variant="outline" className="bg-[#147EFB] text-white border-[#147EFB]">
                  PEMINJAM
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-500">ID Peminjam:</span>
                <span className="text-sm text-gray-900 font-mono">{booking.userId}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                {booking.assetType === 'ruangan' ? (
                  <Home className="size-6 text-purple-600" />
                ) : (
                  <Package className="size-6 text-purple-600" />
                )}
              </div>
              <div>
                <CardTitle className="text-purple-900 font-bold">Informasi Aset</CardTitle>
                <CardDescription>Detail aset yang dipinjam</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-5">
            <div>
              <p className="text-sm text-gray-500 mb-1">Nama Aset</p>
              <p className="text-gray-900">{booking.assetName}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Jenis Aset</p>
                <Badge variant="outline" className={
                  booking.assetType === 'ruangan' 
                    ? "bg-blue-50 text-blue-700 border-blue-200" 
                    : "bg-purple-50 text-purple-700 border-purple-200"
                }>
                  {booking.assetType === 'ruangan' ? 'Ruangan' : 'Barang'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Jumlah</p>
                <p className="text-gray-900">
                  {booking.quantity} {booking.assetType === 'ruangan' ? 'ruangan' : 'unit'}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500 mb-1">ID Aset</p>
              <p className="text-sm text-gray-900 font-mono">{booking.assetId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Kondisi Aset</p>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="size-3 mr-1" />
                Baik
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Calendar className="size-6 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-green-900">Jadwal Peminjaman</CardTitle>
                <CardDescription>Periode penggunaan aset</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded">
                  <Calendar className="size-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Tanggal Mulai</p>
                  <p className="text-gray-900">{formatDate(booking.startDate)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 rounded">
                  <Calendar className="size-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Tanggal Selesai</p>
                  <p className="text-gray-900">{formatDate(booking.endDate)}</p>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t px-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Diajukan pada:</span>
                <span className="text-sm text-gray-900">{formatDateTime(booking.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-500">Durasi peminjaman:</span>
                <span className="text-sm text-gray-900">
                  {Math.ceil((new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24))} hari
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="size-6 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-orange-900">Keperluan & Dokumen</CardTitle>
                <CardDescription>Informasi tambahan peminjaman</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 px-5">
            <div>
              <Label className="text-gray-700 mb-2">Deskripsi Keperluan</Label>
              <div className="bg-white rounded-lg border p-4 min-h-[100px] text-gray-900">
                <p className="text-sm">
                  Peminjaman {booking.assetName} untuk kegiatan akademik dan keperluan kampus. 
                  Aset akan digunakan sesuai dengan jadwal yang telah ditentukan dan akan dikembalikan dalam kondisi baik.
                </p>
              </div>
            </div>
            <div>
              <Label className="text-gray-700 mb-2">Dokumen Lampiran</Label>
              <Button 
                variant="outline" 
                className="w-full justify-start border-2 border-dashed hover:bg-orange-50 hover:border-orange-300"
              >
                <Download className="size-4 mr-2" />
                Download Surat Peminjaman.pdf
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                File lampiran tersedia untuk diunduh
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      {booking.status === 'ajukan' && (
        <Card className="border-2 border-[#B3202A]/20 bg-gradient-to-br from-gray-50 to-white">
          <CardHeader>
            <CardTitle className="text-gray-900 font-semibold">Aksi Verifikasi</CardTitle>
            <CardDescription>Setujui atau tolak pengajuan peminjaman ini</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-5">
            <div>
              <Label htmlFor="note" className="text-gray-700 mb-2">
                Catatan Verifikator (Opsional untuk Persetujuan, Wajib untuk Penolakan)
              </Label>
              <Textarea
                id="note"
                placeholder="Tuliskan catatan atau alasan verifikasi..."
                value={verificationNote}
                onChange={(e) => setVerificationNote(e.target.value)}
                className="min-h-[100px] mt-2"
              />
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1 h-12 bg-[#4CAF50] hover:bg-[#45a049] text-white shadow-lg hover:shadow-xl transition-all"
              >
                {isProcessing ? (
                  <>
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-5 mr-2" />
                    Setujui Peminjaman
                  </>
                )}
              </Button>
              <Button
                onClick={handleReject}
                disabled={isProcessing}
                variant="destructive"
                className="flex-1 h-12 bg-[#E53935] hover:bg-[#d32f2f] text-white shadow-lg hover:shadow-xl transition-all"
              >
                {isProcessing ? (
                  <>
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <XCircle className="size-5 mr-2" />
                    Tolak Peminjaman
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show Verifikator Note */}
      {booking.status !== 'ajukan' && verificationNote && (
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Catatan Verifikator</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{verificationNote}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
