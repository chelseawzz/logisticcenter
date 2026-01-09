import { useState } from 'react';
import type { User, Booking, Asset, Paket } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { Send, AlertCircle, Home, Package, Calendar, CheckCircle2, Info, X, Users } from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';

interface PeminjamanFormProps {
  user: User;
  assets: Asset[];
  bookings: Booking[];
  pakets: Paket[];
  onSubmit: (booking: Omit<Booking, 'id' | 'userId' | 'userName' | 'status' | 'createdAt'>) => void;
}

interface SelectedAssetItem {
  asset: Asset;
  quantity: number;
}

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

export function PeminjamanForm({ user, assets, bookings, pakets, onSubmit }: PeminjamanFormProps) {
  const [selectedAssets, setSelectedAssets] = useState<SelectedAssetItem[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [ukmOrmawa, setUkmOrmawa] = useState('');
  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleAssetSelection = (asset: Asset) => {
    const existingIndex = selectedAssets.findIndex(item => item.asset.id === asset.id);
    
    if (existingIndex >= 0) {
      // Remove if already selected
      setSelectedAssets(selectedAssets.filter((_, index) => index !== existingIndex));
    } else {
      // Add new asset with default quantity
      setSelectedAssets([...selectedAssets, { asset, quantity: 1 }]);
    }
  };

  const updateAssetQuantity = (assetId: string, quantity: number) => {
    setSelectedAssets(selectedAssets.map(item => 
      item.asset.id === assetId ? { ...item, quantity } : item
    ));
  };

  const removeSelectedAsset = (assetId: string) => {
    setSelectedAssets(selectedAssets.filter(item => item.asset.id !== assetId));
  };

  const isAssetSelected = (assetId: string) => {
    return selectedAssets.some(item => item.asset.id === assetId);
  };

  const checkAvailability = (): { available: boolean; message: string } => {
    if (selectedAssets.length === 0) {
      return { available: false, message: 'Pilih minimal satu aset' };
    }

    if (!startDate || !endDate) {
      return { available: false, message: 'Lengkapi tanggal peminjaman' };
    }

    // Only check UKM/Ormawa for mahasiswa
    if (user.role === 'mahasiswa' && !ukmOrmawa) {
      return { available: false, message: 'Pilih UKM/Ormawa' };
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return { available: false, message: 'Tanggal selesai harus setelah tanggal mulai' };
    }

    // Check each selected asset
    for (const selectedItem of selectedAssets) {
      const { asset, quantity } = selectedItem;
      
      const overlappingBookings = bookings.filter(booking => {
        if (booking.assetId !== asset.id) return false;
        if (booking.status === 'ditolak' || booking.status === 'selesai') return false;

        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);

        return (start <= bookingEnd && end >= bookingStart);
      });

      if (asset.type === 'ruangan' && overlappingBookings.length > 0) {
        return { 
          available: false, 
          message: `${asset.name} sudah dipinjam pada tanggal tersebut` 
        };
      }

      if (asset.type === 'barang') {
        const totalBooked = overlappingBookings.reduce((sum, booking) => sum + booking.quantity, 0);
        const availableStock = (asset.stock || 0) - totalBooked;

        if (availableStock < quantity) {
          return { 
            available: false, 
            message: `${asset.name} stok tidak mencukupi. Tersedia: ${availableStock} unit` 
          };
        }
      }
    }

    return { available: true, message: 'Semua aset tersedia untuk periode ini' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const availability = checkAvailability();
    if (!availability.available) {
      toast.error('Peminjaman ditolak', {
        description: availability.message
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Submit one booking per selected asset
      selectedAssets.forEach(({ asset, quantity }) => {
        const booking: Omit<Booking, 'id' | 'userId' | 'userName' | 'status' | 'createdAt'> = {
          assetId: asset.id,
          assetName: asset.name,
          assetType: asset.type,
          quantity: asset.type === 'ruangan' ? 1 : quantity,
          startDate,
          endDate,
          ukmOrmawa,
          namaKegiatan,
        };
        onSubmit(booking);
      });

      toast.success('Peminjaman berhasil diajukan!', {
        description: `${selectedAssets.length} aset diajukan untuk peminjaman`
      });
      
      // Reset form
      setSelectedAssets([]);
      setStartDate('');
      setEndDate('');
      setUkmOrmawa('');
      setNamaKegiatan('');
      setIsLoading(false);
    }, 500);
  };

  const availability = selectedAssets.length > 0 && startDate && endDate && (user.role === 'mahasiswa' ? ukmOrmawa : true) ? checkAvailability() : null;
  const safeAssets = assets ?? [];
  const ruanganAssets = assets.filter(a => a.type === 'ruangan');
  const barangAssets = assets.filter(a => a.type === 'barang');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-gray-900 font-bold">AJUKAN PEMINJAMAN</h2>
        <p className="text-gray-600 mt-1">Pilih aset yang ingin dipinjam dan tentukan periode peminjaman</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Asset Selection */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-br from-[#B3202A] to-[#8A1C24] text-white rounded-t-xl">
              <CardTitle className="flex items-center gap-2 text-white">
                <Package className="size-5" />
                Pilih Aset
              </CardTitle>
              <CardDescription className="text-gray-100">Ruangan atau Barang</CardDescription>
            </CardHeader>
           <CardContent className="pt-6 space-y-4 px-5">
  <div>
    <Label className="text-xs uppercase tracking-wide text-gray-500 mb-3 block">Ruangan Tersedia</Label>
    <div className="space-y-2">
      {ruanganAssets.map((asset) => (
        <button
          key={asset.id}
          type="button"
          onClick={() => toggleAssetSelection(asset)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
            isAssetSelected(asset.id)
              ? 'border-[#147EFB] bg-[#147EFB]/5 shadow-md'
              : 'border-gray-200 hover:border-[#147EFB]/50 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${isAssetSelected(asset.id) ? 'bg-[#147EFB]' : 'bg-[#147EFB]/10'}`}>
              <Home className={`size-5 ${isAssetSelected(asset.id) ? 'text-white' : 'text-[#147EFB]'}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 mb-1">{asset.name}</p>
              <p className="text-xs text-gray-500">{asset.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>

  <div className="pt-4 border-t">
    <Label className="text-xs uppercase tracking-wide text-gray-500 mb-3 block">Barang Tersedia</Label>
    <div className="space-y-2">
      {barangAssets.map((asset) => (
        <button
          key={asset.id}
          type="button"
          onClick={() => toggleAssetSelection(asset)}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
            isAssetSelected(asset.id)
              ? 'border-[#F4A100] bg-[#F4A100]/5 shadow-md'
              : 'border-gray-200 hover:border-[#F4A100]/50 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${isAssetSelected(asset.id) ? 'bg-[#F4A100]' : 'bg-[#F4A100]/10'}`}>
              <Package className={`size-5 ${isAssetSelected(asset.id) ? 'text-white' : 'text-[#F4A100]'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-gray-900">{asset.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {asset.stock} unit
                </Badge>
              </div>
              <p className="text-xs text-gray-500">{asset.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  </div>

  {/* ✅ Section Baru: Daftar Paket */}
{/* ✅ Section Baru: Daftar Paket */}
<div className="pt-4 border-t">
  <Label className="text-xs uppercase tracking-wide text-gray-500 mb-3 block">Daftar Paket</Label>
  <div className="space-y-2">
    {pakets.map(paket => {
      // Cek apakah SEMUA aset dalam paket sudah dipilih
      const paketAssets = assets.filter(a => a.paket_id === paket.id);
      const isFullySelected = paketAssets.length > 0 && 
        paketAssets.every(asset => selectedAssets.some(sa => sa.asset.id === asset.id));

      return (
        <button
          key={paket.id}
          type="button"
          onClick={() => {
            if (paketAssets.length === 0) {
              toast.warning('Paket ini belum memiliki aset terkait', {
                description: `Hubungi admin untuk melengkapi paket "${paket.nama_paket}"`
              });
              return;
            }

            // Toggle setiap aset dalam paket
            paketAssets.forEach(asset => {
              toggleAssetSelection(asset);
            });
          }}
          className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
            isFullySelected
              ? 'border-[#147EFB] bg-[#147EFB]/5 shadow-md'
              : 'border-gray-200 hover:border-[#147EFB]/50 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              isFullySelected ? 'bg-[#147EFB]' : 'bg-[#147EFB]/10'
            }`}>
              <Package className={`size-5 ${
                isFullySelected ? 'text-white' : 'text-[#147EFB]'
              }`} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{paket.nama_paket}</div>
              <div className="text-xs text-gray-500">{paket.deskripsi}</div>
              <div className="text-xs text-gray-500">
                Kuota: {paket.kuota} • Aset: {paketAssets.length}
              </div>
            </div>
          </div>
        </button>
      );
    })}
  </div>
</div>
</CardContent>
          </Card>
        </div>


        {/* Right Column - Form */}
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="size-5 text-[#B3202A]" />
                Detail Peminjaman
              </CardTitle>
              <CardDescription>Tentukan periode dan jumlah peminjaman</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 px-5">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Selected Assets List */}
                {selectedAssets.length > 0 ? (
                  <div className="space-y-3">
                    <Label className="text-sm">Aset Terpilih ({selectedAssets.length})</Label>
                    <div className="space-y-2">
                      {selectedAssets.map(({ asset, quantity }) => (
                        <div key={asset.id} className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl ${asset.type === 'ruangan' ? 'bg-[#147EFB]/10' : 'bg-[#F4A100]/10'}`}>
                              {asset.type === 'ruangan' ? (
                                <Home className="size-6 text-[#147EFB]" />
                              ) : (
                                <Package className="size-6 text-[#F4A100]" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm text-gray-900">{asset.name}</h3>
                                <Badge variant="outline" className={asset.type === 'ruangan' ? 'text-[#147EFB] border-[#147EFB]' : 'text-[#F4A100] border-[#F4A100]'}>
                                  {asset.type === 'ruangan' ? 'Ruangan' : 'Barang'}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-3">{asset.description}</p>
                              
                              {/* Quantity Input for Barang */}
                              {asset.type === 'barang' && (
                                <div className="flex items-center gap-3">
                                  <Label htmlFor={`qty-${asset.id}`} className="text-xs text-gray-600 whitespace-nowrap">Jumlah:</Label>
                                  <div className="relative flex-1 max-w-[200px]">
                                    <Input
                                      id={`qty-${asset.id}`}
                                      type="number"
                                      min="1"
                                      max={asset.stock}
                                      value={quantity}
                                      onChange={(e) => updateAssetQuantity(asset.id, parseInt(e.target.value) || 1)}
                                      className="h-9 text-sm pr-16"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                                      / {asset.stock}
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {asset.type === 'ruangan' && (
                                <p className="text-xs text-gray-500">Jumlah: 1 ruangan</p>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSelectedAsset(asset.id)}
                              className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <X className="size-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Alert>
                    <Info className="size-4" />
                    <AlertDescription>
                      Pilih aset dari daftar di sebelah kiri untuk memulai peminjaman
                    </AlertDescription>
                  </Alert>
                )}

                {/* Date Inputs */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="startDate" className="text-sm flex items-center gap-2">
                        <Calendar className="size-4 text-[#B3202A]" />
                        Tanggal Mulai
                      </Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="h-12"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="endDate" className="text-sm flex items-center gap-2">
                        <Calendar className="size-4 text-[#B3202A]" />
                        Tanggal Selesai
                      </Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        className="h-12"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* UKM/Ormawa Selection - Only for Mahasiswa */}
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
                    className="h-12"
                    required
                  />
                </div>

                {/* Availability Alert */}
                {availability && (
                  <Alert 
                    variant={availability.available ? 'default' : 'destructive'}
                    className={availability.available ? 'border-[#4CAF50] bg-[#4CAF50]/5' : ''}
                  >
                    {availability.available ? (
                      <CheckCircle2 className="size-4 text-[#4CAF50]" />
                    ) : (
                      <AlertCircle className="size-4" />
                    )}
                    <AlertDescription className={availability.available ? 'text-[#4CAF50]' : ''}>
                      {availability.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Summary Box */}
                {selectedAssets.length > 0 && startDate && endDate && (user.role === 'mahasiswa' ? ukmOrmawa : true) && (
                  <div className="bg-gradient-to-br from-[#B3202A]/5 to-[#F4A100]/5 border-2 border-[#B3202A]/20 rounded-xl p-5">
                    <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="size-4 text-[#B3202A]" />
                      Ringkasan Peminjaman
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Aset:</span>
                        <span className="text-gray-900">{selectedAssets.length} item</span>
                      </div>
                      {user.role === 'mahasiswa' && ukmOrmawa && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">UKM/Ormawa:</span>
                          <span className="text-gray-900">{ukmOrmawa}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Periode:</span>
                        <span className="text-gray-900">{startDate} s/d {endDate}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-600">Durasi:</span>
                        <span className="text-gray-900">
                          {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} hari
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={isLoading || selectedAssets.length === 0 || !availability?.available}
                    className="flex-1 h-12 bg-gradient-to-r from-[#B3202A] to-[#8A1C24] hover:from-[#8A1C24] hover:to-black text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Send className="size-5 mr-2" />
                    {isLoading ? 'Mengajukan...' : 'Ajukan Peminjaman'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}