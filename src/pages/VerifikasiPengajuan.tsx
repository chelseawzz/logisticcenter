import { useState } from 'react';
import type { Booking } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { CheckCircle, XCircle, Clock, Package, Home, FileText, Eye, TrendingUp, AlertCircle, History } from 'lucide-react';
import { toast } from 'sonner';

interface VerifikasiPengajuanProps {
  bookings: Booking[];
  onViewDetail?: (booking: Booking) => void;
  onUpdateStatus: (bookingId: string, status: 'disetujui' | 'ditolak') => void;
}

export function VerifikasiPengajuan({ bookings, onViewDetail, onUpdateStatus }: VerifikasiPengajuanProps) {
  const [filter, setFilter] = useState<'all' | 'ajukan' | 'disetujui' | 'ditolak'>('ajukan');
  const [riwayatFilter, setRiwayatFilter] = useState<'all' | 'disetujui' | 'ditolak'>('all');

  const pendingBookings = bookings.filter(b => b.status === 'ajukan');
  const approvedBookings = bookings.filter(b => b.status === 'disetujui');
  const rejectedBookings = bookings.filter(b => b.status === 'ditolak');
  
  // Riwayat: semua yang sudah diverifikasi (disetujui, ditolak, selesai)
  const verifiedBookings = bookings.filter(b => 
    b.status === 'disetujui' || b.status === 'ditolak' || b.status === 'selesai'
  );

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const filteredRiwayat = riwayatFilter === 'all'
    ? verifiedBookings
    : verifiedBookings.filter(b => {
        if (riwayatFilter === 'disetujui') {
          return b.status === 'disetujui' || b.status === 'selesai';
        }
        return b.status === riwayatFilter;
      });

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

  const handleApprove = (bookingId: string) => {
    onUpdateStatus(bookingId, 'disetujui');
    toast.success('Pengajuan Disetujui', {
      description: 'Peminjaman telah disetujui'
    });
  };

  const handleReject = (bookingId: string) => {
    onUpdateStatus(bookingId, 'ditolak');
    toast.error('Pengajuan Ditolak', {
      description: 'Peminjaman telah ditolak'
    });
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'ajukan':
        return (
          <Badge variant="outline" className="bg-[#F4A100]/10 text-[#F4A100] border-[#F4A100]/30">
            <Clock className="size-3 mr-1" />
            Menunggu
          </Badge>
        );
      case 'disetujui':
        return (
          <Badge variant="outline" className="bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/30">
            <CheckCircle className="size-3 mr-1" />
            Disetujui
          </Badge>
        );
      case 'ditolak':
        return (
          <Badge variant="outline" className="bg-[#E53935]/10 text-[#E53935] border-[#E53935]/30">
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
      <div className="mb-8">
        <h2 className="text-gray-900 font-bold">VERIFIKASI PENGAJUAN</h2>
        <p className="text-gray-600 mt-1">Kelola dan verifikasi pengajuan peminjaman</p>
      </div>

      {/* Modern Statistics Cards with Gradient */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Pengajuan Card - Style 1: Double Border Gradient */}
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

        {/* Menunggu Verifikasi Card - Style 2: Pulse Animation with Top Border */}
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

        {/* Disetujui Card - Style 3: Side Accent with Icon Background */}
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

        {/* Ditolak Card - Style 4: Subtle Shadow with Corner Decoration */}
        <Card className="relative bg-gradient-to-br from-white to-red-50/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#E53935]/20 hover:border-[#E53935]/40 group">
          {/* Corner decoration */}
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
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5 text-[#B3202A]" />
            Daftar Pengajuan
          </CardTitle>
          <CardDescription>Filter pengajuan berdasarkan status</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 px-5">
          <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)} className="mb-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger value="ajukan" className="data-[state=active]:bg-[#F4A100] data-[state=active]:text-white">
                Menunggu ({pendingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="disetujui" className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white">
                Disetujui ({approvedBookings.length})
              </TabsTrigger>
              <TabsTrigger value="ditolak" className="data-[state=active]:bg-[#E53935] data-[state=active]:text-white">
                Ditolak ({rejectedBookings.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-[#B3202A] data-[state=active]:text-white">
                Semua ({bookings.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Booking List */}
          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                  <FileText className="size-12 text-gray-300" />
                </div>
                <p className="text-lg">Tidak ada pengajuan</p>
                <p className="text-sm text-gray-400 mt-1">Belum ada pengajuan pada kategori ini</p>
              </div>
            ) : (
              filteredBookings.map((booking, index) => {
                // Alternating card styles for visual variety
                const cardStyle = index % 3;
                
                if (cardStyle === 0) {
                  // Style 1: Left Border Accent
                  return (
                    <div key={booking.id} className="relative group">
                      <div className="border-l-4 border-[#B3202A] rounded-xl p-5 hover:shadow-xl transition-all duration-300 bg-white shadow-md group-hover:border-[#8A1C24]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gray-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              {booking.assetType === 'ruangan' ? (
                                <div className="p-3 bg-[#147EFB]/10 rounded-xl border-2 border-[#147EFB]/30 shadow-sm">
                                  <Home className="size-6 text-[#147EFB]" />
                                </div>
                              ) : (
                                <div className="p-3 bg-[#F4A100]/10 rounded-xl border-2 border-[#F4A100]/30 shadow-sm">
                                  <Package className="size-6 text-[#F4A100]" />
                                </div>
                              )}
                              <div>
                                <h3 className="text-gray-900 mb-1">{booking.assetName}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B3202A]"></span>
                                  oleh <span className="text-gray-700">{booking.userName}</span>
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pl-16">
                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Tanggal Mulai</span>
                                <p className="text-gray-900 mt-1">{formatDate(booking.startDate)}</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Tanggal Selesai</span>
                                <p className="text-gray-900 mt-1">{formatDate(booking.endDate)}</p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Jumlah</span>
                                <p className="text-gray-900 mt-1">
                                  {booking.quantity} {booking.assetType === 'ruangan' ? 'ruangan' : 'unit'}
                                </p>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Diajukan</span>
                                <p className="text-gray-900 mt-1 text-xs">{formatDateTime(booking.createdAt)}</p>
                              </div>
                            </div>

                            <div className="mt-4 pl-16">
                              <span className="text-gray-500 text-xs uppercase tracking-wide">Status:</span>
                              <div className="mt-2">{getStatusBadge(booking.status)}</div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewDetail && onViewDetail(booking)}
                              className="hover:bg-[#147EFB] hover:text-white hover:border-[#147EFB] transition-colors"
                            >
                              <Eye className="size-4 mr-1" />
                              Detail
                            </Button>

                            {booking.status === 'ajukan' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-[#4CAF50] to-[#388E3C] hover:from-[#388E3C] hover:to-[#2E7D32] shadow-md"
                                  onClick={() => handleApprove(booking.id)}
                                >
                                  <CheckCircle className="size-4 mr-1" />
                                  Setujui
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-[#E53935] to-[#C62828] hover:from-[#C62828] hover:to-[#B71C1C] shadow-md text-white"
                                  onClick={() => handleReject(booking.id)}
                                >
                                  <XCircle className="size-4 mr-1" />
                                  Tolak
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else if (cardStyle === 1) {
                  // Style 2: Gradient Background with Soft Border
                  return (
                    <div key={booking.id} className="relative group">
                      <div className="rounded-xl p-5 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white via-gray-50/50 to-white border-2 border-gray-100 hover:border-[#B3202A]/20 shadow-sm">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              {booking.assetType === 'ruangan' ? (
                                <div className="relative">
                                  <div className="absolute inset-0 bg-[#147EFB]/20 rounded-2xl blur-md"></div>
                                  <div className="relative p-3.5 bg-gradient-to-br from-[#147EFB] to-[#0C5FD1] rounded-2xl shadow-md">
                                    <Home className="size-6 text-white" />
                                  </div>
                                </div>
                              ) : (
                                <div className="relative">
                                  <div className="absolute inset-0 bg-[#F4A100]/20 rounded-2xl blur-md"></div>
                                  <div className="relative p-3.5 bg-gradient-to-br from-[#F4A100] to-[#D68B00] rounded-2xl shadow-md">
                                    <Package className="size-6 text-white" />
                                  </div>
                                </div>
                              )}
                              <div>
                                <h3 className="text-gray-900 mb-1">{booking.assetName}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B3202A]"></span>
                                  oleh <span className="text-gray-700">{booking.userName}</span>
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pl-16">
                              <div className="bg-white rounded-lg p-3 shadow-sm">
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Tanggal Mulai</span>
                                <p className="text-gray-900 mt-1">{formatDate(booking.startDate)}</p>
                              </div>
                              <div className="bg-white rounded-lg p-3 shadow-sm">
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Tanggal Selesai</span>
                                <p className="text-gray-900 mt-1">{formatDate(booking.endDate)}</p>
                              </div>
                              <div className="bg-white rounded-lg p-3 shadow-sm">
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Jumlah</span>
                                <p className="text-gray-900 mt-1">
                                  {booking.quantity} {booking.assetType === 'ruangan' ? 'ruangan' : 'unit'}
                                </p>
                              </div>
                              <div className="bg-white rounded-lg p-3 shadow-sm">
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Diajukan</span>
                                <p className="text-gray-900 mt-1 text-xs">{formatDateTime(booking.createdAt)}</p>
                              </div>
                            </div>

                            <div className="mt-4 pl-16">
                              <span className="text-gray-500 text-xs uppercase tracking-wide">Status:</span>
                              <div className="mt-2">{getStatusBadge(booking.status)}</div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewDetail && onViewDetail(booking)}
                              className="hover:bg-[#147EFB] hover:text-white hover:border-[#147EFB] transition-colors"
                            >
                              <Eye className="size-4 mr-1" />
                              Detail
                            </Button>

                            {booking.status === 'ajukan' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-[#4CAF50] to-[#388E3C] hover:from-[#388E3C] hover:to-[#2E7D32] shadow-md"
                                  onClick={() => handleApprove(booking.id)}
                                >
                                  <CheckCircle className="size-4 mr-1" />
                                  Setujui
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-[#E53935] to-[#C62828] hover:from-[#C62828] hover:to-[#B71C1C] shadow-md text-white"
                                  onClick={() => handleReject(booking.id)}
                                >
                                  <XCircle className="size-4 mr-1" />
                                  Tolak
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  // Style 3: Elevated Card with Corner Badge
                  return (
                    <div key={booking.id} className="relative group">
                      <div className="relative border rounded-2xl p-5 hover:shadow-xl transition-all duration-300 bg-white border-gray-200 hover:border-[#B3202A]/30 shadow-md overflow-hidden">
                        {/* Top right decorative element */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#B3202A]/5 to-transparent rounded-bl-3xl"></div>
                        
                        {/* Corner dots decoration */}
                        <div className="absolute top-3 right-3 flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B3202A]/30"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B3202A]/20"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B3202A]/10"></span>
                        </div>

                        <div className="flex items-start justify-between relative">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              {booking.assetType === 'ruangan' ? (
                                <div className="p-3 bg-white rounded-xl border-2 border-[#147EFB]/40 shadow-sm group-hover:shadow-md transition-shadow">
                                  <Home className="size-6 text-[#147EFB]" />
                                </div>
                              ) : (
                                <div className="p-3 bg-white rounded-xl border-2 border-[#F4A100]/40 shadow-sm group-hover:shadow-md transition-shadow">
                                  <Package className="size-6 text-[#F4A100]" />
                                </div>
                              )}
                              <div>
                                <h3 className="text-gray-900 mb-1">{booking.assetName}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B3202A]"></span>
                                  oleh <span className="text-gray-700">{booking.userName}</span>
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pl-16">
                              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border border-gray-100">
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Tanggal Mulai</span>
                                <p className="text-gray-900 mt-1">{formatDate(booking.startDate)}</p>
                              </div>
                              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border border-gray-100">
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Tanggal Selesai</span>
                                <p className="text-gray-900 mt-1">{formatDate(booking.endDate)}</p>
                              </div>
                              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border border-gray-100">
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Jumlah</span>
                                <p className="text-gray-900 mt-1">
                                  {booking.quantity} {booking.assetType === 'ruangan' ? 'ruangan' : 'unit'}
                                </p>
                              </div>
                              <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border border-gray-100">
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Diajukan</span>
                                <p className="text-gray-900 mt-1 text-xs">{formatDateTime(booking.createdAt)}</p>
                              </div>
                            </div>

                            <div className="mt-4 pl-16">
                              <span className="text-gray-500 text-xs uppercase tracking-wide">Status:</span>
                              <div className="mt-2">{getStatusBadge(booking.status)}</div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewDetail && onViewDetail(booking)}
                              className="hover:bg-[#147EFB] hover:text-white hover:border-[#147EFB] transition-colors"
                            >
                              <Eye className="size-4 mr-1" />
                              Detail
                            </Button>

                            {booking.status === 'ajukan' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-[#4CAF50] to-[#388E3C] hover:from-[#388E3C] hover:to-[#2E7D32] shadow-md"
                                  onClick={() => handleApprove(booking.id)}
                                >
                                  <CheckCircle className="size-4 mr-1" />
                                  Setujui
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-[#E53935] to-[#C62828] hover:from-[#C62828] hover:to-[#B71C1C] shadow-md text-white"
                                  onClick={() => handleReject(booking.id)}
                                >
                                  <XCircle className="size-4 mr-1" />
                                  Tolak
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Riwayat Verifikasi Section */}
      <Card className="shadow-lg border-0 mt-8">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="flex items-center gap-2">
            <History className="size-5 text-[#B3202A]" />
            Riwayat Verifikasi
          </CardTitle>
          <CardDescription>Daftar peminjaman yang telah diverifikasi</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 px-5">
          {/* Filter Tabs untuk Riwayat */}
          <Tabs value={riwayatFilter} onValueChange={(value) => setRiwayatFilter(value as typeof riwayatFilter)} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#B3202A] data-[state=active]:text-white">
                Semua ({verifiedBookings.length})
              </TabsTrigger>
              <TabsTrigger value="disetujui" className="data-[state=active]:bg-[#4CAF50] data-[state=active]:text-white">
                Disetujui ({verifiedBookings.filter(b => b.status === 'disetujui' || b.status === 'selesai').length})
              </TabsTrigger>
              <TabsTrigger value="ditolak" className="data-[state=active]:bg-[#E53935] data-[state=active]:text-white">
                Ditolak ({rejectedBookings.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Riwayat List */}
          <div className="space-y-4">
            {filteredRiwayat.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                  <History className="size-12 text-gray-300" />
                </div>
                <p className="text-lg">Tidak ada riwayat verifikasi</p>
                <p className="text-sm text-gray-400 mt-1">Belum ada data pada kategori ini</p>
              </div>
            ) : (
              filteredRiwayat.map((booking) => (
                <div key={booking.id} className="relative group">
                  <div className="border rounded-xl p-5 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 group-hover:border-[#B3202A]/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          {booking.assetType === 'ruangan' ? (
                            <div className="p-3 bg-gradient-to-br from-[#147EFB]/10 to-[#147EFB]/5 rounded-xl border border-[#147EFB]/20">
                              <Home className="size-6 text-[#147EFB]" />
                            </div>
                          ) : (
                            <div className="p-3 bg-gradient-to-br from-[#F4A100]/10 to-[#F4A100]/5 rounded-xl border border-[#F4A100]/20">
                              <Package className="size-6 text-[#F4A100]" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-gray-900 mb-1">{booking.assetName}</h3>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#B3202A]"></span>
                              oleh <span className="text-gray-700">{booking.userName}</span>
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pl-16">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-gray-500 text-xs uppercase tracking-wide">Tanggal Mulai</span>
                            <p className="text-gray-900 mt-1">{formatDate(booking.startDate)}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-gray-500 text-xs uppercase tracking-wide">Tanggal Selesai</span>
                            <p className="text-gray-900 mt-1">{formatDate(booking.endDate)}</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-gray-500 text-xs uppercase tracking-wide">Jumlah</span>
                            <p className="text-gray-900 mt-1">
                              {booking.quantity} {booking.assetType === 'ruangan' ? 'ruangan' : 'unit'}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <span className="text-gray-500 text-xs uppercase tracking-wide">Diverifikasi</span>
                            <p className="text-gray-900 mt-1 text-xs">{formatDateTime(booking.createdAt)}</p>
                          </div>
                        </div>

                        <div className="mt-4 pl-16">
                          <span className="text-gray-500 text-xs uppercase tracking-wide">Status:</span>
                          <div className="mt-2">{getStatusBadge(booking.status)}</div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetail && onViewDetail(booking)}
                          className="hover:bg-[#147EFB] hover:text-white hover:border-[#147EFB] transition-colors"
                        >
                          <Eye className="size-4 mr-1" />
                          Detail
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredRiwayat.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600 pt-4 border-t px-5">
              <p>
                Menampilkan {filteredRiwayat.length} dari {verifiedBookings.length} riwayat verifikasi
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="size-3 text-[#4CAF50]" />
                    {verifiedBookings.filter(b => b.status === 'disetujui' || b.status === 'selesai').length} Disetujui
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="flex items-center gap-1">
                    <XCircle className="size-3 text-[#E53935]" />
                    {rejectedBookings.length} Ditolak
                  </span>
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}