// Below is the same structure rewritten as plain React JavaScript (no TypeScript)
import { useState } from 'react';
import type { Booking, Asset } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Home, Package, Search, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';

interface TabelPeminjamanProps {
  bookings: Booking[];
  assets: Asset[];
}

export function TabelPeminjaman({ bookings, assets }: TabelPeminjamanProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ruangan' | 'barang'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | Booking['status']>('all');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'ajukan':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="size-3 mr-1" />
            Menunggu
          </Badge>
        );
      case 'disetujui':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="size-3 mr-1" />
            Disetujui
          </Badge>
        );
      case 'ditolak':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="size-3 mr-1" />
            Ditolak
          </Badge>
        );
      case 'selesai':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <CheckCircle className="size-3 mr-1" />
            Selesai
          </Badge>
        );
    }
  };

  const filteredBookings = bookings.filter(booking => {
    // Filter by type
    if (filterType !== 'all' && booking.assetType !== filterType) return false;
    
    // Filter by status
    if (filterStatus !== 'all' && booking.status !== filterStatus) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.assetName.toLowerCase().includes(query) ||
        booking.userName.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const stats = {
    total: bookings.length,
    ruangan: bookings.filter(b => b.assetType === 'ruangan').length,
    barang: bookings.filter(b => b.assetType === 'barang').length,
    aktif: bookings.filter(b => b.status === 'disetujui' && !b.returnedQuantity).length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-gray-900">Tabel Peminjaman</h2>
        <p className="text-gray-600 mt-1">Daftar lengkap peminjaman barang dan ruangan</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Peminjaman</CardDescription>
            <CardTitle className="text-blue-600">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <FileText className="size-8 text-blue-200" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ruangan</CardDescription>
            <CardTitle className="text-indigo-600">{stats.ruangan}</CardTitle>
          </CardHeader>
          <CardContent>
            <Home className="size-8 text-indigo-200" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Barang</CardDescription>
            <CardTitle className="text-purple-600">{stats.barang}</CardTitle>
          </CardHeader>
          <CardContent>
            <Package className="size-8 text-purple-200" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Aktif</CardDescription>
            <CardTitle className="text-green-600">{stats.aktif}</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckCircle className="size-8 text-green-200" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Peminjaman</CardTitle>
          <CardDescription>Filter dan cari data peminjaman</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Cari nama aset atau peminjam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <Tabs value={filterType} onValueChange={(value) => setFilterType(value as typeof filterType)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Semua</TabsTrigger>
                    <TabsTrigger value="ruangan">Ruangan</TabsTrigger>
                    <TabsTrigger value="barang">Barang</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex-1 min-w-[200px]">
                <Tabs value={filterStatus} onValueChange={(value) => setFilterStatus(value as typeof filterStatus)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">Semua Status</TabsTrigger>
                    <TabsTrigger value="ajukan">Menunggu</TabsTrigger>
                    <TabsTrigger value="disetujui">Disetujui</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="text-blue-900">No</TableHead>
                  <TableHead className="text-blue-900">Jenis</TableHead>
                  <TableHead className="text-blue-900">Nama Aset</TableHead>
                  <TableHead className="text-blue-900">Peminjam</TableHead>
                  <TableHead className="text-blue-900">Jumlah</TableHead>
                  <TableHead className="text-blue-900">Tanggal Mulai</TableHead>
                  <TableHead className="text-blue-900">Tanggal Selesai</TableHead>
                  <TableHead className="text-blue-900">Status</TableHead>
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
                      <TableCell>
                        <div>
                          <p>{booking.assetName}</p>
                        </div>
                      </TableCell>
                      <TableCell>{booking.userName}</TableCell>
                      <TableCell>
                        {booking.quantity} {booking.assetType === 'ruangan' ? 'ruangan' : 'unit'}
                        {booking.returnedQuantity && (
                          <p className="text-xs text-green-600">
                            (Dikembalikan: {booking.returnedQuantity})
                          </p>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(booking.startDate)}</TableCell>
                      <TableCell>{formatDate(booking.endDate)}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredBookings.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Menampilkan {filteredBookings.length} dari {bookings.length} peminjaman
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
