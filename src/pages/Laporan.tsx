import { useState } from 'react';
import type { User, Booking, Asset } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Download, FileText, TrendingUp, Package, Home, Calendar, Clock, XCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LaporanProps {
  bookings: Booking[];
  assets: Asset[];
}

export function Laporan({ bookings, assets }: LaporanProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredBookings = bookings.filter(booking => {
    if (!startDate || !endDate) return true;
    const bookingDate = new Date(booking.createdAt);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return bookingDate >= start && bookingDate <= end;
  });

  const stats = {
    totalBookings: filteredBookings.length,
    ruanganBookings: filteredBookings.filter(b => b.assetType === 'ruangan').length,
    barangBookings: filteredBookings.filter(b => b.assetType === 'barang').length,
    approved: filteredBookings.filter(b => b.status === 'disetujui').length,
    pending: filteredBookings.filter(b => b.status === 'ajukan').length,
    rejected: filteredBookings.filter(b => b.status === 'ditolak').length,
    completed: filteredBookings.filter(b => b.status === 'selesai').length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExportPDF = () => {
    toast.success('Export PDF', {
      description: 'Laporan berhasil diexport ke PDF'
    });
  };

  const handleExportExcel = () => {
    toast.success('Export Excel', {
      description: 'Laporan berhasil diexport ke Excel'
    });
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'ajukan':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Menunggu</Badge>;
      case 'disetujui':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Disetujui</Badge>;
      case 'ditolak':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Ditolak</Badge>;
      case 'selesai':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">Selesai</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-gray-900 font-bold">LAPORAN</h2>
        <p className="text-gray-600 mt-1">Laporan dan analisis peminjaman aset</p>
      </div>

      {/* Filter Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
          <CardDescription>Pilih rentang tanggal untuk melihat laporan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-5">
            <div className="space-y-2">
              <Label htmlFor="startDate">Tanggal Mulai</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Tanggal Selesai</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button
                className="flex-1 bg-[#B3202A] hover:bg-[#8A1C24] text-white"
                onClick={handleExportPDF}
              >
                <Download className="size-4 mr-2" />
                Export PDF
              </Button>
            </div>
            <div className="flex items-end gap-2">
              <Button
                className="flex-1 bg-[#4CAF50] hover:bg-green-700 text-white"
                onClick={handleExportExcel}
              >
                <Download className="size-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODERN Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Peminjaman */}
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
              <CardDescription className="text-xs uppercase tracking-wide mb-1">Total Peminjaman</CardDescription>
              <CardTitle className="text-3xl text-[#B3202A] mb-1">{stats.totalBookings}</CardTitle>
              <p className="text-xs text-gray-500">Semua peminjaman</p>
            </CardContent>
          </div>
        </Card>

        {/* Ruangan */}
        <Card className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-[#147EFB] group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#147EFB]/5 via-transparent to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#147EFB]/10 to-transparent rounded-bl-full"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="relative p-3.5 bg-gradient-to-br from-[#147EFB] to-[#0C5FD1] rounded-2xl shadow-lg">
                <Home className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <CardDescription className="text-xs uppercase tracking-wide mb-1">Ruangan</CardDescription>
                <CardTitle className="text-3xl text-[#147EFB]">{stats.ruanganBookings}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 px-5">
            <p className="text-xs text-gray-500">Peminjaman ruangan</p>
          </CardContent>
        </Card>

        {/* Barang */}
        <Card className="relative bg-gradient-to-br from-white to-[#F4A100]/5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#F4A100]/20 hover:border-[#F4A100]/40 group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#F4A100]/20 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#F4A100]/10 to-transparent rounded-tr-full"></div>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#F4A100]/30 rounded-full blur-lg"></div>
                <div className="relative p-3 bg-white rounded-full shadow-md border-2 border-[#F4A100]/30">
                  <Package className="size-6 text-[#F4A100]" />
                </div>
              </div>
              <div className="flex-1 pt-1">
                <CardDescription className="text-xs uppercase tracking-wide mb-1 text-[#F4A100]/80">Barang</CardDescription>
                <CardTitle className="text-3xl text-[#F4A100]">{stats.barangBookings}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 px-5">
            <p className="text-xs text-gray-500">Peminjaman barang</p>
          </CardContent>
        </Card>

        {/* Disetujui */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4CAF50] to-[#388E3C] rounded-2xl opacity-60 group-hover:opacity-100 blur-sm transition duration-300"></div>
          <Card className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-0">
            <div className="absolute right-0 bottom-0 opacity-5">
              <TrendingUp className="size-24 text-[#4CAF50]" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-[#4CAF50] to-[#388E3C] rounded-xl shadow-md">
                  <TrendingUp className="size-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 px-5">
              <CardDescription className="text-xs uppercase tracking-wide mb-1">Disetujui</CardDescription>
              <CardTitle className="text-3xl text-[#4CAF50]">{stats.approved}</CardTitle>
              <p className="text-xs text-gray-500 mt-1">Pengajuan diterima</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MODERN Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Menunggu Verifikasi */}
        <Card className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 border-[#F4A100] group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F4A100]/5 via-transparent to-transparent"></div>
          <CardHeader className="pb-2">
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
                <CardTitle className="text-3xl text-[#F4A100]">{stats.pending}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 px-5">
            <div className="text-xs text-[#F4A100]">
              {stats.totalBookings > 0 
                ? `${((stats.pending / stats.totalBookings) * 100).toFixed(1)}%`
                : '0%'} dari total
            </div>
          </CardContent>
        </Card>

        {/* Ditolak */}
        <Card className="relative bg-gradient-to-br from-white to-red-50/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#E53935]/20 hover:border-[#E53935]/40 group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#E53935]/20 to-transparent rounded-bl-full"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#E53935]/10 to-transparent rounded-tr-full"></div>
          <CardHeader className="pb-2">
            <div className="flex items-start gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#E53935]/30 rounded-full blur-lg"></div>
                <div className="relative p-3 bg-white rounded-full shadow-md border-2 border-[#E53935]/30">
                  <XCircle className="size-6 text-[#E53935]" />
                </div>
              </div>
              <div className="flex-1 pt-1">
                <CardDescription className="text-xs uppercase tracking-wide mb-1 text-[#E53935]/80">Ditolak</CardDescription>
                <CardTitle className="text-3xl text-[#E53935]">{stats.rejected}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 px-5">
            <div className="text-xs text-[#E53935]">
              {stats.totalBookings > 0 
                ? `${((stats.rejected / stats.totalBookings) * 100).toFixed(1)}%`
                : '0%'} dari total
            </div>
          </CardContent>
        </Card>

        {/* Selesai */}
        <Card className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gray-100/30 rounded-bl-full"></div>
          <CardHeader className="pb-2">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-gray-100 rounded-full border border-gray-200">
                <CheckCircle className="size-6 text-gray-600" />
              </div>
              <div className="flex-1 pt-1">
                <CardDescription className="text-xs uppercase tracking-wide mb-1 text-gray-500">Selesai</CardDescription>
                <CardTitle className="text-3xl text-gray-600">{stats.completed}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 px-5">
            <div className="text-xs text-gray-600">
              {stats.totalBookings > 0 
                ? `${((stats.completed / stats.totalBookings) * 100).toFixed(1)}%`
                : '0%'} dari total
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table (UNCHANGED) */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Lengkap Peminjaman</CardTitle>
          <CardDescription>
            Menampilkan {filteredBookings.length} dari {bookings.length} peminjaman
            {startDate && endDate && ` (${formatDate(startDate)} - ${formatDate(endDate)})`}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-5">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="pointer-events-none">
                <TableRow className="bg-black">
                  <TableHead className="text-white">No</TableHead>
                  <TableHead className="text-white">Tanggal</TableHead>
                  <TableHead className="text-white">Peminjam</TableHead>
                  <TableHead className="text-white">Jenis</TableHead>
                  <TableHead className="text-white">Aset</TableHead>
                  <TableHead className="text-white">Periode</TableHead>
                  <TableHead className="text-white">Jumlah</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      <FileText className="size-12 mx-auto mb-3 text-gray-300" />
                      <p>Tidak ada data peminjaman</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking, index) => (
                    <TableRow key={booking.id} className="hover:bg-gray-50">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="text-sm">
                        {formatDateTime(booking.createdAt)}
                      </TableCell>
                      <TableCell>{booking.userName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {booking.assetType === 'ruangan' ? (
                            <>
                              <Home className="size-4 text-blue-500" />
                              <span className="text-sm">Ruangan</span>
                            </>
                          ) : (
                            <>
                              <Package className="size-4 text-purple-500" />
                              <span className="text-sm">Barang</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{booking.assetName}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </TableCell>
                      <TableCell>
                        {booking.quantity} {booking.assetType === 'ruangan' ? 'ruangan' : 'unit'}
                      </TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}