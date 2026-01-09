import { useState } from 'react';
import type { Booking } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { CheckCircle, XCircle, Clock, Package, Home, FileText, Eye, TrendingUp, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea'; // 👈 Jangan lupa impor Textarea
import { toast } from 'sonner';

interface VerifikasiPengajuanProps {
  bookings: Booking[];
  onUpdateStatus: (bookingId: string, status: 'disetujui' | 'ditolak', note?: string) => void; // 👈 tambahkan note
}

export function VerifikasiPengajuan({ bookings, onUpdateStatus }: VerifikasiPengajuanProps) {
  const [filter, setFilter] = useState<'all' | 'ajukan' | 'disetujui' | 'ditolak'>('ajukan');
  const [rejectNote, setRejectNote] = useState(''); // 👈 state untuk alasan penolakan
  const pendingBookings = bookings.filter(b => b.status === 'ajukan');
  const approvedBookings = bookings.filter(b => b.status === 'disetujui');
  const rejectedBookings = bookings.filter(b => b.status === 'ditolak');
  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
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

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'ajukan':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
            <Clock className="size-3 mr-1" />
            Menunggu
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
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-gray-900 font-bold">VERIFIKASI PENGAJUAN</h2>
        <p className="text-gray-600 mt-1">Kelola dan verifikasi pengajuan peminjaman</p>
      </div>

      {/* Modern Statistics Cards with Gradient */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Pengajuan Card */}
        <Card className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent bg-gradient-to-br from-[#B3202A]/10 via-white to-white p-[2px] group">
          <div className="bg-white rounded-2xl h-full">
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#B3202A]/20 to-transparent rounded-br-full"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#B3202A]/20 rounded-xl blur-md"></div>
                  <div className="relative p-3 bg-gradient-to-br from-[#B3202A] to-[#8A1C24] rounded-xl shadow-md">
                    <FileText className="size-6 text-white" />
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <TrendingUp className="size-5 text-[#B3202A]/40" />
                  <span className="text-[10px] text-[#B3202A]/60 mt-1 uppercase tracking-wide">Total</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 px-5">
              <CardDescription className="text-xs uppercase tracking-wide mb-1">Total Pengajuan</CardDescription>
              <CardTitle className="text-4xl text-[#B3202A] mb-1">{bookings.length}</CardTitle>
              <p className="text-xs text-gray-500">Semua pengajuan</p>
            </CardContent>
          </div>
        </Card>

        {/* Menunggu Verifikasi Card */}
        <Card className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-[#F4A100] group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F4A100]/5 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#F4A100]/10 to-transparent rounded-tl-full"></div>
          <CardHeader className="pb-2 relative">
            <div className="flex items-center gap-3">
              <div className="relative p-3.5 bg-gradient-to-br from-[#F4A100] to-[#D68B00] rounded-2xl shadow-lg">
                <Clock className="size-6 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4A100] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F4A100]"></span>
                </span>
              </div>
              <div className="flex-1">
                <CardDescription className="text-xs uppercase tracking-wide mb-1">Menunggu</CardDescription>
                <CardTitle className="text-3xl text-[#F4A100]">{pendingBookings.length}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 relative px-3">
            <div className="flex items-center gap-2 bg-[#F4A100]/10 rounded-lg px-3 py-2">
              <AlertCircle className="size-4 text-[#F4A100]" />
              <p className="text-xs text-[#F4A100]">Perlu tindakan segera</p>
            </div>
          </CardContent>
        </Card>

        {/* Disetujui Card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4CAF50] to-[#388E3C] rounded-2xl opacity-60 group-hover:opacity-100 blur-sm group-hover:blur transition duration-300"></div>
          <Card className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-0">
            <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity">
              <CheckCircle className="size-32 text-[#4CAF50]" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-[#4CAF50] to-[#388E3C] rounded-xl shadow-md group-hover:scale-110 transition-transform">
                  <CheckCircle className="size-6 text-white" />
                </div>
                <Badge className="bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/30">Approved</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 relative px-5">
              <CardDescription className="text-xs uppercase tracking-wide mb-1">Disetujui</CardDescription>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-4xl text-[#4CAF50]">{approvedBookings.length}</CardTitle>
                <TrendingUp className="size-5 text-[#4CAF50]" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Pengajuan diterima</p>
            </CardContent>
          </Card>
        </div>

        {/* Ditolak Card */}
        <Card className="relative bg-gradient-to-br from-white to-red-50/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#E53935]/20 hover:border-[#E53935]/40 group">
          <div className="absolute top-0 right-0">
            <div className="w-16 h-16 bg-gradient-to-bl from-[#E53935]/20 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#E53935]/10 to-transparent"></div>
          </div>
          <CardHeader className="pb-2">
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#E53935]/30 rounded-full blur-lg"></div>
                <div className="relative p-3 bg-white rounded-full shadow-md border-2 border-[#E53935]/30 group-hover:border-[#E53935]/50 transition-colors">
                  <XCircle className="size-6 text-[#E53935]" />
                </div>
              </div>
              <div className="flex-1 pt-1">
                <CardDescription className="text-xs uppercase tracking-wide mb-1 text-[#E53935]/70">Ditolak</CardDescription>
                <CardTitle className="text-3xl text-[#E53935]">{rejectedBookings.length}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 px-5">
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#E53935]/20 to-transparent rounded-full mb-2"></div>
            <p className="text-xs text-gray-500">Pengajuan ditolak</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Filter */}
      <Card className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>Daftar Pengajuan</CardTitle>
          <CardDescription>Filter pengajuan berdasarkan status</CardDescription>
        </CardHeader>
        <CardContent className="px-5">
          <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)} className="mb-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ajukan">Menunggu ({pendingBookings.length})</TabsTrigger>
              <TabsTrigger value="disetujui">Disetujui ({approvedBookings.length})</TabsTrigger>
              <TabsTrigger value="ditolak">Ditolak ({rejectedBookings.length})</TabsTrigger>
              <TabsTrigger value="all">Semua ({bookings.length})</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Booking List */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="size-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">Tidak ada pengajuan</p>
                <p className="text-sm text-gray-400 mt-1">Belum ada pengajuan pada kategori ini</p>
              </div>
            ) : (
              filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border rounded-xl p-5 hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        {booking.assetType === 'ruangan' ? (
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
                            <Home className="size-6 text-blue-600" />
                          </div>
                        ) : (
                          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 shadow-sm">
                            <Package className="size-6 text-purple-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-gray-900 font-medium">{booking.assetName}</h3>
                          <p className="text-sm text-gray-500">oleh {booking.userName}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <span className="text-xs uppercase tracking-wide text-gray-500">Tanggal Mulai</span>
                          <p className="text-gray-900 mt-1">{formatDate(booking.startDate)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <span className="text-xs uppercase tracking-wide text-gray-500">Tanggal Selesai</span>
                          <p className="text-gray-900 mt-1">{formatDate(booking.endDate)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <span className="text-xs uppercase tracking-wide text-gray-500">Jumlah</span>
                          <p className="text-gray-900 mt-1">
                            {booking.quantity} {booking.assetType === 'ruangan' ? 'ruangan' : 'unit'}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <span className="text-xs uppercase tracking-wide text-gray-500">Diajukan</span>
                          <p className="text-gray-900 mt-1">{formatDateTime(booking.createdAt)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <span className="text-xs uppercase tracking-wide text-gray-500">Status</span>
                          <div className="mt-1">{getStatusBadge(booking.status)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {/* Detail Dialog */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="hover:bg-blue-600 hover:text-white transition-colors">
                            <Eye className="size-4 mr-1" />
                            Detail
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detail Pengajuan</DialogTitle>
                            <DialogDescription>Informasi lengkap peminjaman</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            {booking.verificationNote && (
                              <div>
                                <p className="text-sm text-gray-500">Catatan Verifikator</p>
                                <p className="text-sm text-gray-900 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                  {booking.verificationNote}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-gray-500">Nama Aset</p>
                              <p>{booking.assetName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Peminjam</p>
                              <p>{booking.userName}</p>
                            </div>
                            {booking.ukmOrmawa && (
                              <div>
                                <p className="text-sm text-gray-500">UKM/Ormawa</p>
                                <p>{booking.ukmOrmawa}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-gray-500">Tipe</p>
                              <p className="capitalize">{booking.assetType}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Periode</p>
                              <p>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Jumlah</p>
                              <p>{booking.quantity} {booking.assetType === 'ruangan' ? 'ruangan' : 'unit'}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Approve / Reject Buttons */}
                      {booking.status === 'ajukan' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white transition-colors"
                            onClick={() => onUpdateStatus(booking.id, 'disetujui', '')}
                          >
                            <CheckCircle className="size-4 mr-1" />
                            Setujui
                          </Button>

                          {/* Modal Tolak dengan Input Note */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white transition-colors"
                              >
                                <XCircle className="size-4 mr-1" />
                                Tolak
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Tolak Pengajuan</DialogTitle>
                                <DialogDescription>
                                  Masukkan alasan penolakan agar peminjam mengetahui kesalahan.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <Textarea
                                  placeholder="Contoh: Stok tidak mencukupi, dokumen tidak lengkap, dll."
                                  value={rejectNote}
                                  onChange={(e) => setRejectNote(e.target.value)}
                                  className="min-h-[100px]"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setRejectNote('')}>
                                  Batal
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    if (!rejectNote.trim()) {
                                      toast.error('Alasan penolakan wajib diisi');
                                      return;
                                    }
                                    onUpdateStatus(booking.id, 'ditolak', rejectNote);
                                    setRejectNote('');
                                  }}
                                >
                                  Kirim Penolakan
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}