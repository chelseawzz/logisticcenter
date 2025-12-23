import React, { useState } from "react";
import type { User, Booking, Asset } from '../App';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { toast } from "sonner"; 
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  RotateCcw,
  AlertCircle,
  Package,
  Home,
  CheckCircle2,
  Calendar,
  ArrowRight,
  FileText,
  Users,
} from "lucide-react";

import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";

const UKM_ORMAWA_LIST = [
  'UKM Ikatan Mahasiswa Sulawesi (IMS)',
  'UKM Ikatan Mahasiswa Nusa Tenggara Timur (IM NTT)',
  'UKM Keluarga Mahasiswa Sumatera (KMS)',
  'UKM Paduan Suara Vox Auream',
  'UKM Telkom Art',
  'UKM Badminton',
  'UKM E-Sport',
  'Dewan Perwakilan Mahasiswa (DPM)',
  'UKM Creativity on Digital Environment in Room of Technology (CODER)',
  'UKM Robotika',
  'UKM Punggawa Inspiratif',
  'UKM UKKI',
  'UKM UKKK',
  'UKM KMK St. Feligon',
  'UKM Mahapala Telkom University Surabaya (Mahitkom)',
  'UKM Entrepreneur Community (ECTS)',
  'UKM Nippon Bunka-Bu',
  'Himpunan Mahasiswa Teknik Elektro',
  'Himpunan Mahasiswa Teknik Telekomunikasi',
  'Himpunan Mahasiswa Teknik Komputer',
  'Himpunan Mahasiswa Teknik Industri',
  'Himpunan Mahasiswa Sistem Informasi',
  'Himpunan Mahasiswa Teknik Logistik',
  'Himpunan Mahasiswa Informatika',
  'Himpunan Mahasiswa Rekayasa Perangkat Lunak',
  'Himpunan Mahasiswa Teknologi Informasi',
  'Himpunan Mahasiswa Sains Data',
  'Himpunan Mahasiswa Bisnis Digital',
  'Badan Eksekutif Mahasiswa (BEM)',
];

interface PengembalianFormProps {
  user: User;
  bookings: Booking[];
  onSubmit: (bookingId: string, returnedQuantity: number) => void;
}

export function PengembalianForm({ user, bookings, onSubmit }: PengembalianFormProps) {
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [returnedQuantity, setReturnedQuantity] = useState(1);
  const [ukmOrmawa, setUkmOrmawa] = useState('');
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [kondisiBarang, setKondisiBarang] = useState('');
  const [catatan, setCatatan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBooking) return;

    // Validate quantity is within range
    if (returnedQuantity < 1 || returnedQuantity > selectedBooking.quantity) {
      toast.error('Pengembalian gagal', {
        description: `Jumlah pengembalian harus antara 1 dan ${selectedBooking.quantity} ${selectedBooking.assetType === 'ruangan' ? 'ruangan' : 'unit'}`
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      onSubmit(selectedBookingId, returnedQuantity);
      
      const isPartialReturn = returnedQuantity < selectedBooking.quantity;
      
      toast.success('Pengembalian berhasil!', {
        description: isPartialReturn 
          ? `${returnedQuantity} dari ${selectedBooking.quantity} ${selectedBooking.assetType === 'ruangan' ? 'ruangan' : 'unit'} ${selectedBooking.assetName} telah dikembalikan`
          : `${selectedBooking.assetName} telah dikembalikan lengkap`
      });
      
      // Reset form
      setSelectedBookingId('');
      setReturnedQuantity(1);
      setUkmOrmawa('');
      setNamaKegiatan('');
      setKondisiBarang('');
      setCatatan('');
      setIsLoading(false);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-gray-900 font-bold">AJUKAN PENGEMBALIAN</h2>
        <p className="text-gray-600 mt-1">Kembalikan aset yang telah dipinjam</p>
      </div>

      {bookings.length === 0 ? (
        <Card className="shadow-lg border-0">
          <CardContent className="py-16 px-5">
            <div className="text-center">
              <div className="inline-block p-8 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full mb-6">
                <Package className="size-20 text-gray-300" />
              </div>
              <h3 className="text-gray-900 text-2xl mb-3">Tidak Ada Peminjaman Aktif</h3>
              <p className="text-gray-600 mb-6">
                Anda tidak memiliki peminjaman yang perlu dikembalikan
              </p>
              <Badge variant="outline" className="text-gray-500 border-gray-300 px-4 py-2">
                Semua aset telah dikembalikan
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Active Bookings List */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-br from-[#4CAF50] to-[#3D8B40] text-white rounded-t-xl">
                <CardTitle className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="size-5" />
                  Peminjaman Aktif
                </CardTitle>
                <CardDescription className="text-gray-100">
                  {bookings.length} item menunggu pengembalian
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-3 px-5">
                {bookings.map((booking) => (
                  <button
                    key={booking.id}
                    type="button"
                    onClick={() => {
                      setSelectedBookingId(booking.id);
                      setReturnedQuantity(booking.quantity);
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedBookingId === booking.id
                        ? 'border-[#4CAF50] bg-[#4CAF50]/5 shadow-md'
                        : 'border-gray-200 hover:border-[#4CAF50]/50 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        booking.assetType === 'ruangan'
                          ? selectedBookingId === booking.id ? 'bg-[#147EFB]' : 'bg-[#147EFB]/10'
                          : selectedBookingId === booking.id ? 'bg-[#F4A100]' : 'bg-[#F4A100]/10'
                      }`}>
                        {booking.assetType === 'ruangan' ? (
                          <Home className={`size-5 ${selectedBookingId === booking.id ? 'text-white' : 'text-[#147EFB]'}`} />
                        ) : (
                          <Package className={`size-5 ${selectedBookingId === booking.id ? 'text-white' : 'text-[#F4A100]'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate mb-1">{booking.assetName}</p>
                        <p className="text-xs text-gray-500">
                          {booking.quantity} {booking.assetType === 'ruangan' ? 'ruangan' : 'unit'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(booking.startDate)}
                        </p>
                      </div>
                      {selectedBookingId === booking.id && (
                        <ArrowRight className="size-4 text-[#4CAF50] flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Return Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
                <CardTitle className="flex items-center gap-2">
                  <RotateCcw className="size-5 text-[#B3202A]" />
                  Form Pengembalian
                </CardTitle>
                <CardDescription>
                  {selectedBooking ? 'Konfirmasi pengembalian aset' : 'Pilih peminjaman dari daftar di sebelah kiri'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 px-5">
                {!selectedBooking ? (
                  <div className="text-center py-12">
                    <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
                      <Package className="size-12 text-gray-400" />
                    </div>
                    <p className="text-gray-600">Pilih peminjaman yang ingin dikembalikan</p>
                    <p className="text-sm text-gray-400 mt-2">Klik salah satu item di sebelah kiri</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Selected Booking Detail */}
                    <div className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-4 rounded-xl ${
                          selectedBooking.assetType === 'ruangan' ? 'bg-[#147EFB]/10' : 'bg-[#F4A100]/10'
                        }`}>
                          {selectedBooking.assetType === 'ruangan' ? (
                            <Home className="size-8 text-[#147EFB]" />
                          ) : (
                            <Package className="size-8 text-[#F4A100]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl text-gray-900">{selectedBooking.assetName}</h3>
                            <Badge variant="outline" className={
                              selectedBooking.assetType === 'ruangan' 
                                ? 'text-[#147EFB] border-[#147EFB]' 
                                : 'text-[#F4A100] border-[#F4A100]'
                            }>
                              {selectedBooking.assetType === 'ruangan' ? 'Ruangan' : 'Barang'}
                            </Badge>
                          </div>
                          <Badge className="bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20">
                            <CheckCircle2 className="size-3 mr-1" />
                            Disetujui
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <Calendar className="size-3" />
                            Tanggal Peminjaman
                          </div>
                          <p className="text-sm text-gray-900">
                            {formatDate(selectedBooking.startDate)}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <Calendar className="size-3" />
                            Tanggal Pengembalian
                          </div>
                          <p className="text-sm text-gray-900">
                            {formatDate(selectedBooking.endDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Jumlah Dipinjam</p>
                          <p className="text-sm text-gray-900">
                            {selectedBooking.quantity} {selectedBooking.assetType === 'ruangan' ? 'ruangan' : 'unit'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Durasi</p>
                          <p className="text-sm text-gray-900">
                            {Math.ceil((new Date(selectedBooking.endDate).getTime() - new Date(selectedBooking.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} hari
                          </p>
                        </div>
                        {selectedBooking.ukmOrmawa && (
                          <div className="col-span-2">
                            <p className="text-xs text-gray-500 mb-1">UKM/Ormawa</p>
                            <p className="text-sm text-gray-900">{selectedBooking.ukmOrmawa}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Return Quantity Input */}
                    <div className="space-y-3">
                      <Label htmlFor="quantity" className="text-sm">
                        Jumlah yang Dikembalikan
                      </Label>
                      <div className="relative">
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          max={selectedBooking.quantity}
                          value={returnedQuantity}
                          onChange={(e) => setReturnedQuantity(parseInt(e.target.value) || 1)}
                          className="h-12 text-lg"
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                          / {selectedBooking.quantity} {selectedBooking.assetType === 'ruangan' ? 'ruangan' : 'unit'}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        Anda dapat mengembalikan sebagian atau seluruh aset (1-{selectedBooking.quantity} {selectedBooking.assetType === 'ruangan' ? 'ruangan' : 'unit'})
                      </p>
                    </div>

                    {/* Validation Alert */}
                    {returnedQuantity > 0 && returnedQuantity <= selectedBooking.quantity ? (
                      <Alert className="border-[#4CAF50] bg-[#4CAF50]/5">
                        <CheckCircle2 className="size-4 text-[#4CAF50]" />
                        <AlertDescription className="text-[#4CAF50]">
                          {returnedQuantity === selectedBooking.quantity 
                            ? 'Pengembalian lengkap - Semua aset akan dikembalikan' 
                            : `Pengembalian sebagian - ${returnedQuantity} dari ${selectedBooking.quantity} ${selectedBooking.assetType === 'ruangan' ? 'ruangan' : 'unit'} akan dikembalikan`
                          }
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert variant="destructive">
                        <AlertCircle className="size-4" />
                        <AlertDescription>
                          Jumlah pengembalian tidak valid. Masukkan nilai antara 1 dan {selectedBooking.quantity}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Formulir Pengembalian Barang */}
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-sm mb-4 flex items-center gap-2">
                        <FileText className="size-4 text-[#B3202A]" />
                        Formulir Pengembalian Barang
                      </h4>

                      <div className="space-y-4">
                        {/* UKM/Ormawa - Only for Mahasiswa */}
                        {user.role === 'mahasiswa' && (
                          <div className="space-y-3">
                            <Label htmlFor="ukmOrmawa" className="text-sm flex items-center gap-2">
                              <Users className="size-4 text-[#B3202A]" />
                              Nama UKM/Ormawa
                            </Label>
                            <Select value={ukmOrmawa} onValueChange={setUkmOrmawa} required>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Pilih UKM/Ormawa" />
                              </SelectTrigger>
                              <SelectContent className="max-h-60">
                                {UKM_ORMAWA_LIST.map((ukm) => (
                                  <SelectItem key={ukm} value={ukm}>
                                    {ukm}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Nama Kegiatan */}
                        <div className="space-y-3">
                          <Label htmlFor="namaKegiatan" className="text-sm flex items-center gap-2">
                            <Package className="size-4 text-[#B3202A]" />
                            Nama Kegiatan
                          </Label>
                          <Input
                            id="namaKegiatan"
                            type="text"
                            value={namaKegiatan}
                            onChange={(e) => setNamaKegiatan(e.target.value)}
                            placeholder="Masukkan nama kegiatan"
                            className="h-12"
                            required
                          />
                        </div>

                        {/* Kondisi Barang */}
                        <div className="space-y-3">
                          <Label htmlFor="kondisiBarang" className="text-sm flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-[#B3202A]" />
                            Kondisi Barang
                          </Label>
                          <Select value={kondisiBarang} onValueChange={setKondisiBarang} required>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Pilih kondisi barang" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="baik">Baik - Tidak ada kerusakan</SelectItem>
                              <SelectItem value="rusak-ringan">Rusak Ringan - Ada sedikit kerusakan</SelectItem>
                              <SelectItem value="rusak-berat">Rusak Berat - Kerusakan signifikan</SelectItem>
                              <SelectItem value="hilang">Hilang - Barang tidak dapat dikembalikan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Catatan */}
                        <div className="space-y-3">
                          <Label htmlFor="catatan" className="text-sm flex items-center gap-2">
                            <FileText className="size-4 text-[#B3202A]" />
                            Catatan (Opsional)
                          </Label>
                          <Textarea
                            id="catatan"
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            placeholder="Tambahkan catatan jika ada kerusakan, kehilangan, atau informasi tambahan lainnya..."
                            className="min-h-[100px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="submit" 
                        disabled={isLoading || !selectedBookingId || returnedQuantity < 1 || returnedQuantity > selectedBooking.quantity}
                        className="flex-1 h-12 bg-gradient-to-r from-[#4CAF50] to-[#3D8B40] hover:from-[#3D8B40] hover:to-[#2D6B30] text-white shadow-lg hover:shadow-xl transition-all"
                      >
                        <RotateCcw className="size-5 mr-2" />
                        {isLoading ? 'Memproses...' : 'Submit Pengembalian'}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}