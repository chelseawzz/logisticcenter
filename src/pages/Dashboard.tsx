import type { User, Booking, Asset, Page } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Package, Home, CheckCircle, Clock, XCircle, FileText, Search, TrendingUp, ArrowRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { useState } from 'react';


interface DashboardProps {
  user: User;
  bookings: Booking[];
  assets: Asset[];
  onNavigate: (page: Page) => void;
}

export function Dashboard({ user, bookings, assets, onNavigate }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ruangan' | 'barang'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | Booking['status']>('all');

  const userBookings = bookings.filter(b => b.userId === user.id);
  const activeBookings = userBookings.filter(b => b.status === 'disetujui' && !b.returnedQuantity);
  const pendingBookings = userBookings.filter(b => b.status === 'ajukan');

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'ajukan':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="size-3 mr-1" />Menunggu</Badge>;
      case 'disetujui':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="size-3 mr-1" />Disetujui</Badge>;
      case 'ditolak':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="size-3 mr-1" />Ditolak</Badge>;
      case 'selesai':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200"><CheckCircle className="size-3 mr-1" />Selesai</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
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
        <h2 className="text-gray-900 font-bold">DASHBOARD</h2>
        <p className="text-gray-600 mt-1">
          Selamat datang, {user.name} ({user.role})
        </p>
      </div>

      {/* Modern Statistics Cards with Gradient */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ">
        {/* Total Peminjaman Card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#B3202A] to-[#B3202A] rounded-2xl opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
          <Card className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#B3202A]/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="pb-2 ">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-[#B3202A] to-[#8A1C24] rounded-xl shadow-lg">
                  <FileText className="size-6 text-white" />
                </div>
                <TrendingUp className="size-5 text-[#B3202A]/40" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 px-5">
              <CardDescription className="text-xs uppercase tracking-wide mb-1">Total Peminjaman</CardDescription>
              <CardTitle className="text-4xl text-[#B3202A] mb-1">{stats.total}</CardTitle>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="text-[#4CAF50]">↑ 12%</span> dari bulan lalu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Ruangan Card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#147EFB] to-[#0C5FD1] rounded-2xl opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
          <Card className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#147EFB]/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-[#147EFB] to-[#0C5FD1] rounded-xl shadow-lg">
                  <Home className="size-6 text-white" />
                </div>
                <TrendingUp className="size-5 text-[#147EFB]/40" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 px-5">
              <CardDescription className="text-xs uppercase tracking-wide mb-1">Peminjaman Ruangan</CardDescription>
              <CardTitle className="text-4xl text-[#147EFB] mb-1">{stats.ruangan}</CardTitle>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="text-[#4CAF50]">↑ 8%</span> dari bulan lalu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Barang Card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F4A100] to-[#D68A00] rounded-2xl opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
          <Card className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F4A100]/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-[#F4A100] to-[#D68A00] rounded-xl shadow-lg">
                  <Package className="size-6 text-white" />
                </div>
                <TrendingUp className="size-5 text-[#F4A100]/40" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 px-5">
              <CardDescription className="text-xs uppercase tracking-wide mb-1">Peminjaman Barang</CardDescription>
              <CardTitle className="text-4xl text-[#F4A100] mb-1">{stats.barang}</CardTitle>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="text-[#4CAF50]">↑ 15%</span> dari bulan lalu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Aktif Card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4CAF50] to-[#3D8B40] rounded-2xl opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
          <Card className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4CAF50]/10 to-transparent rounded-bl-full"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-[#4CAF50] to-[#3D8B40] rounded-xl shadow-lg">
                  <CheckCircle className="size-6 text-white" />
                </div>
                <TrendingUp className="size-5 text-[#4CAF50]/40" />
              </div>
            </CardHeader>
            <CardContent className="pt-4 px-5">
              <CardDescription className="text-xs uppercase tracking-wide mb-1">Sedang Aktif</CardDescription>
              <CardTitle className="text-4xl text-[#4CAF50] mb-1">{stats.aktif}</CardTitle>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="text-gray-600">Peminjaman aktif</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mb-8 shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5 text-[#B3202A]" />
            Tabel Peminjaman
          </CardTitle>
          <CardDescription>Filter dan cari data peminjaman</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 px-5">
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Cari nama aset atau peminjam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-gray-300 focus:border-[#B3202A] focus:ring-[#B3202A]"
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
              <TableHeader className="pointer-events-none">
                <TableRow className="bg-[#1A1A1A]">
                  <TableHead className="text-white">No</TableHead>
                  <TableHead className="text-white">Jenis</TableHead>
                  <TableHead className="text-white">Nama Aset</TableHead>
                  <TableHead className="text-white">Peminjam</TableHead>
                  <TableHead className="text-white">Jumlah</TableHead>
                  <TableHead className="text-white">Tanggal Mulai</TableHead>
                  <TableHead className="text-white">Tanggal Selesai</TableHead>
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
                    <TableRow key={booking.id} className="hover:bg-gray-100">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {booking.assetType === 'ruangan' ? (
                            <>
                              <Home className="size-4 text-[#147EFB]" />
                              <span className="text-sm">Ruangan</span>
                            </>
                          ) : (
                            <>
                              <Package className="size-4 text-[#F4A100]" />
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

      {/* Only show "Riwayat Peminjaman Saya" for mahasiswa, dosen, and staff */}
      {user.role !== 'verifikator' && (
        <Card className="shadow-lg border-0 mb-8">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <CardTitle className="flex items-center gap-2">
              <Package className="size-5 text-[#B3202A]" />
              Riwayat Peminjaman Saya
            </CardTitle>
            <CardDescription>Daftar peminjaman pribadi Anda</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 px-5">
            {userBookings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                  <Package className="size-12 text-gray-300" />
                </div>
                <p className="text-lg">Belum ada peminjaman</p>
                <p className="text-sm text-gray-400 mt-1">Mulai ajukan peminjaman aset kampus</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userBookings.map((booking) => (
                  <div key={booking.id} className="relative group">
                    <div className="border rounded-xl p-5 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 group-hover:border-[#B3202A]/30">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`p-2 rounded-lg ${booking.assetType === 'ruangan' ? 'bg-[#147EFB]/10' : 'bg-[#F4A100]/10'}`}>
                              {booking.assetType === 'ruangan' ? (
                                <Home className="size-5 text-[#147EFB]" />
                              ) : (
                                <Package className="size-5 text-[#F4A100]" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-gray-900">{booking.assetName}</h3>
                              <p className="text-xs text-gray-500">{booking.assetType === 'ruangan' ? 'Ruangan' : 'Barang'}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm pl-14">
                            <div>
                              <span className="text-gray-500 text-xs">Tanggal Peminjaman</span>
                              <p className="text-gray-900">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Jumlah</span>
                              <p className="text-gray-900">{booking.quantity} {booking.assetType === 'ruangan' ? 'ruangan' : 'unit'}</p>
                            </div>
                          </div>
                          {booking.returnedQuantity && (
                            <div className="mt-3 pl-14">
                              <Badge className="bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20">
                                <CheckCircle className="size-3 mr-1" />
                                Dikembalikan: {booking.returnedQuantity} unit
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(booking.status)}
                          <ArrowRight className="size-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Only show "Aset Tersedia" for mahasiswa, dosen, and staff */}
      {user.role !== 'verifikator' && (
        <div className="mt-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
              <CardTitle className="flex items-center gap-2">
                <Home className="size-5 text-[#B3202A]" />
                Aset Tersedia
              </CardTitle>
              <CardDescription>Daftar ruangan dan barang yang dapat dipinjam</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 px-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assets.map((asset) => (
                  <div 
                    key={asset.id} 
                    onClick={() => onNavigate('peminjaman')}
                    className="group border rounded-xl border-gray-300 p-5 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 hover:border-[#B3202A]/30 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-3 rounded-xl ${asset.type === 'ruangan' ? 'bg-[#147EFB]/10 group-hover:bg-[#147EFB]/20' : 'bg-[#F4A100]/10 group-hover:bg-[#F4A100]/20'} transition-colors`}>
                        {asset.type === 'ruangan' ? (
                          <Home className="size-6 text-[#147EFB]" />
                        ) : (
                          <Package className="size-6 text-[#F4A100]" />
                        )}
                      </div>
                      {asset.type === 'barang' && (
                        <Badge variant="secondary" className="bg-gray-100">
                          Stok: {asset.stock}
                        </Badge>
                      )}
                    </div>
                    <h4 className="text-gray-900 mb-2 group-hover:text-[#B3202A] transition-colors">{asset.name}</h4>
                    <p className="text-sm text-gray-600">{asset.description}</p>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-[#B3202A] text-sm">
                      Pilih aset
                      <ArrowRight className="size-4 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}