import { useState } from 'react';
import type { Booking, Asset } from '../App';

// UI Components (shadcn, path disesuaikan)
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar } from '../components/ui/calendar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Icons
import {
  Home,
  Package,
  CalendarDays,
  Clock,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

interface KalenderPeminjamanProps {
  bookings: Booking[];
  assets: Asset[];
}

export function KalenderPeminjaman({ bookings, assets }: KalenderPeminjamanProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterType, setFilterType] = useState<'all' | 'ruangan' | 'barang'>('all');

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getBookingsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    const dateStr = formatDate(date);
    
    return bookings.filter(booking => {
      if (booking.status === 'ditolak') return false;
      if (filterType !== 'all' && booking.assetType !== filterType) return false;
      
      const startDate = booking.startDate;
      const endDate = booking.endDate;
      
      return dateStr >= startDate && dateStr <= endDate;
    });
  };

  const selectedDateBookings = getBookingsForDate(selectedDate);

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'ajukan':
        return (
          <Badge className="bg-[#F4A100]/10 text-[#F4A100] border-[#F4A100]/30 border">
            <Clock className="size-3 mr-1" />Menunggu
          </Badge>
        );
      case 'disetujui':
        return (
          <Badge className="bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/30 border">
            <CheckCircle2 className="size-3 mr-1" />Disetujui
          </Badge>
        );
      case 'selesai':
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-300 border">
            <CheckCircle2 className="size-3 mr-1" />Selesai
          </Badge>
        );
      default:
        return null;
    }
  };

  const getDatesWithBookings = () => {
    const dates = new Set<string>();
    bookings.forEach(booking => {
      if (booking.status === 'ditolak') return;
      if (filterType !== 'all' && booking.assetType !== filterType) return;

      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.add(formatDate(new Date(d)));
      }
    });
    return dates;
  };

  const datesWithBookings = getDatesWithBookings();

  const modifiers = {
    booked: (date: Date) => datesWithBookings.has(formatDate(date))
  };

  const modifiersStyles = {
    booked: {
      fontWeight: 'bold',
      backgroundColor: '#B3202A',
      color: 'white',
      borderRadius: '8px'
    }
  };

  const ruanganCount = bookings.filter(b => b.assetType === 'ruangan' && b.status !== 'ditolak').length;
  const barangCount = bookings.filter(b => b.assetType === 'barang' && b.status !== 'ditolak').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-gray-900 font-bold">KALENDER PEMINJAMAN</h2>
        <p className="text-gray-600 mt-1">Lihat jadwal peminjaman aset kampus secara visual</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-[#B3202A] to-[#8A1C24] text-white">
          <CardContent className="pt-6 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-100 mb-1">Total Peminjaman</p>
                <p className="text-4xl">{bookings.filter(b => b.status !== 'ditolak').length}</p>
                <p className="text-xs text-gray-100 mt-2 flex items-center gap-1">
                  <TrendingUp className="size-3" />
                  Aktif & Selesai
                </p>
              </div>
              <div className="p-4 bg-white/20 rounded-2xl">
                <CalendarDays className="size-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-[#147EFB] to-[#0C5FD1] text-white">
          <CardContent className="pt-6 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-100 mb-1">Peminjaman Ruangan</p>
                <p className="text-4xl">{ruanganCount}</p>
                <p className="text-xs text-gray-100 mt-2 flex items-center gap-1">
                  <Home className="size-3" />
                  Total ruangan
                </p>
              </div>
              <div className="p-4 bg-white/20 rounded-2xl">
                <Home className="size-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-[#F4A100] to-[#D68A00] text-white">
          <CardContent className="pt-6 px-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-100 mb-1">Peminjaman Barang</p>
                <p className="text-4xl">{barangCount}</p>
                <p className="text-xs text-gray-100 mt-2 flex items-center gap-1">
                  <Package className="size-3" />
                  Total barang
                </p>
              </div>
              <div className="p-4 bg-white/20 rounded-2xl">
                <Package className="size-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calendar + Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Card */}
        <Card className="lg:col-span-2 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="size-5 text-[#B3202A]" />
              Kalender Peminjaman
            </CardTitle>
            <CardDescription>Klik tanggal untuk melihat detail peminjaman</CardDescription>
          </CardHeader>

          <CardContent className="pt-6 px-5">
            <div className="flex justify-center mb-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-xl border-2 shadow-md bg-white p-4"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-[#B3202A]/5 to-[#B3202A]/10 border-2 border-[#B3202A]/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-lg bg-[#B3202A]"></div>
                  <div>
                    <p className="text-xs text-gray-600">Tanggal dengan Peminjaman</p>
                    <p className="text-sm text-gray-900">{datesWithBookings.size} hari</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-gray-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-lg bg-white border-2 border-gray-300"></div>
                  <div>
                    <p className="text-xs text-gray-600">Tanggal Kosong</p>
                    <p className="text-sm text-gray-900">Tersedia</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
            <CardTitle className="flex items-center gap-2">
              <Package className="size-5 text-[#B3202A]" />
              Filter Aset
            </CardTitle>
            <CardDescription>Tampilkan berdasarkan jenis</CardDescription>
          </CardHeader>

          <CardContent className="pt-6 px-5">
            <Tabs value={filterType} onValueChange={(value) => setFilterType(value as any)}>
              <TabsList className="grid w-full grid-cols-3 h-12">
                <TabsTrigger value="all" className="text-xs">Semua</TabsTrigger>
                <TabsTrigger value="ruangan" className="text-xs">Ruangan</TabsTrigger>
                <TabsTrigger value="barang" className="text-xs">Barang</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mt-6 space-y-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#147EFB] to-[#0C5FD1] rounded-xl opacity-50 group-hover:opacity-75 blur transition"></div>
                <div className="relative flex items-center justify-between p-4 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#147EFB]/10 rounded-lg">
                      <Home className="size-5 text-[#147EFB]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">Ruangan</p>
                      <p className="text-xs text-gray-500">Peminjaman aktif</p>
                    </div>
                  </div>
                  <Badge className="bg-[#147EFB] text-white px-3 py-1">
                    {ruanganCount}
                  </Badge>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F4A100] to-[#D68A00] rounded-xl opacity-50 group-hover:opacity-75 blur transition"></div>
                <div className="relative flex items-center justify-between p-4 bg-white rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#F4A100]/10 rounded-lg">
                      <Package className="size-5 text-[#F4A100]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-900">Barang</p>
                      <p className="text-xs text-gray-500">Peminjaman aktif</p>
                    </div>
                  </div>
                  <Badge className="bg-[#F4A100] text-white px-3 py-1">
                    {barangCount}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl">
                <p className="text-xs text-gray-500 mb-2">Hari Dipilih</p>
                <p className="text-lg text-gray-900 mb-1">
                  {selectedDate
                    ? selectedDate.toLocaleDateString('id-ID', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'Tidak ada'}
                </p>
                <Badge variant="outline" className="text-[#B3202A] border-[#B3202A]/30">
                  {selectedDateBookings.length} peminjaman
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      <Card className="mt-6 shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="size-5 text-[#B3202A]" />
            Peminjaman pada{' '}
            {selectedDate
              ? selectedDate.toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })
              : '-'}
          </CardTitle>

          <CardDescription>
            Daftar aset yang dipinjam pada tanggal yang dipilih
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 px-5">
          {selectedDateBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block p-8 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full mb-4">
                <CalendarDays className="size-16 text-gray-300" />
              </div>
              <p className="text-lg text-gray-900 mb-2">Tidak ada peminjaman</p>
              <p className="text-sm text-gray-500">Pada tanggal ini tidak ada aset yang dipinjam</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedDateBookings.map((booking) => (
                <div key={booking.id} className="group relative">
                  <div
                    className={`absolute -inset-0.5 rounded-xl opacity-50 group-hover:opacity-75 blur transition ${
                      booking.assetType === 'ruangan'
                        ? 'bg-gradient-to-r from-[#147EFB] to-[#0C5FD1]'
                        : 'bg-gradient-to-r from-[#F4A100] to-[#D68A00]'
                    }`}
                  ></div>

                  <div className="relative border-2 rounded-xl p-5 bg-white hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`p-3 rounded-xl ${
                          booking.assetType === 'ruangan'
                            ? 'bg-[#147EFB]/10'
                            : 'bg-[#F4A100]/10'
                        }`}
                      >
                        {booking.assetType === 'ruangan' ? (
                          <Home className="size-6 text-[#147EFB]" />
                        ) : (
                          <Package className="size-6 text-[#F4A100]" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h4 className="text-gray-900 mb-1">{booking.assetName}</h4>

                        <Badge
                          variant="outline"
                          className={
                            booking.assetType === 'ruangan'
                              ? 'text-[#147EFB] border-[#147EFB]/30 text-xs'
                              : 'text-[#F4A100] border-[#F4A100]/30 text-xs'
                          }
                        >
                          {booking.assetType === 'ruangan' ? 'Ruangan' : 'Barang'}
                        </Badge>
                      </div>

                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Peminjam:</span>
                        <span className="text-gray-900">{booking.userName}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-500">Jumlah:</span>
                        <span className="text-gray-900">
                          {booking.quantity}{' '}
                          {booking.assetType === 'ruangan' ? 'ruangan' : 'unit'}
                        </span>
                      </div>

                      <div className="flex justify-between pt-2 border-t border-gray-100">
                        <span className="text-gray-500">Periode:</span>
                        <span className="text-gray-900 text-xs">
                          {formatDateDisplay(booking.startDate)} -{' '}
                          {formatDateDisplay(booking.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
