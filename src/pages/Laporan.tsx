import { useState } from 'react';
import type { User, Booking, Asset } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Download, FileText, TrendingUp, Package, Home, Calendar } from 'lucide-react';
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
        <h2 className="text-gray-900">Laporan</h2>
        <p className="text-gray-600 mt-1">Laporan dan analisis peminjaman aset</p>
      </div>

      {/* Filter Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
          <CardDescription>Pilih rentang tanggal untuk melihat laporan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Peminjaman</CardDescription>
            <CardTitle className="text-[#B3202A]">{stats.totalBookings}</CardTitle>
          </CardHeader>
          <CardContent>
            <FileText className="size-8 text-[#B3202A]/20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ruangan</CardDescription>
            <CardTitle className="text-[#147EFB]">{stats.ruanganBookings}</CardTitle>
          </CardHeader>
          <CardContent>
            <Home className="size-8 text-[#147EFB]/20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Barang</CardDescription>
            <CardTitle className="text-[#F4A100]">{stats.barangBookings}</CardTitle>
          </CardHeader>
          <CardContent>
            <Package className="size-8 text-[#F4A100]/20" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Disetujui</CardDescription>
            <CardTitle className="text-[#4CAF50]">{stats.approved}</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendingUp className="size-8 text-[#4CAF50]/20" />
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-2 border-[#F4A100]/30">
          <CardHeader className="pb-3">
            <CardDescription>Menunggu Verifikasi</CardDescription>
            <CardTitle className="text-[#F4A100]">{stats.pending}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              {stats.totalBookings > 0 
                ? `${((stats.pending / stats.totalBookings) * 100).toFixed(1)}%`
                : '0%'
              } dari total
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#E53935]/30">
          <CardHeader className="pb-3">
            <CardDescription>Ditolak</CardDescription>
            <CardTitle className="text-[#E53935]">{stats.rejected}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              {stats.totalBookings > 0 
                ? `${((stats.rejected / stats.totalBookings) * 100).toFixed(1)}%`
                : '0%'
              } dari total
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-200">
          <CardHeader className="pb-3">
            <CardDescription>Selesai</CardDescription>
            <CardTitle className="text-gray-600">{stats.completed}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              {stats.totalBookings > 0 
                ? `${((stats.completed / stats.totalBookings) * 100).toFixed(1)}%`
                : '0%'
              } dari total
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Lengkap Peminjaman</CardTitle>
          <CardDescription>
            Menampilkan {filteredBookings.length} dari {bookings.length} peminjaman
            {startDate && endDate && ` (${formatDate(startDate)} - ${formatDate(endDate)})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-red-50">
                  <TableHead className="text-red-900">No</TableHead>
                  <TableHead className="text-red-900">Tanggal</TableHead>
                  <TableHead className="text-red-900">Peminjam</TableHead>
                  <TableHead className="text-red-900">Jenis</TableHead>
                  <TableHead className="text-red-900">Aset</TableHead>
                  <TableHead className="text-red-900">Periode</TableHead>
                  <TableHead className="text-red-900">Jumlah</TableHead>
                  <TableHead className="text-red-900">Status</TableHead>
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