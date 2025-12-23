import { useState } from 'react';
import type { Asset } from '../App';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';

import { 
  Home, Package, Plus, Edit, Trash2, Search, TrendingUp, Settings 
} from 'lucide-react';

import { toast } from 'sonner';

interface KelolaAsetProps {
  assets: Asset[];
}

export function KelolaAset({ assets }: KelolaAsetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'ruangan' | 'barang'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'ruangan' as 'ruangan' | 'barang',
    description: '',
    stock: 0,
  });

  const ruanganCount = assets.filter(a => a.type === 'ruangan').length;
  const barangCount = assets.filter(a => a.type === 'barang').length;
  const totalStock = assets.reduce((sum, a) => sum + (a.stock || 0), 0);

  const filteredAssets = assets.filter(asset => {
    if (filterType !== 'all' && asset.type !== filterType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return asset.name.toLowerCase().includes(query) ||
             asset.description?.toLowerCase().includes(query);
    }
    return true;
  });

  const handleOpenDialog = (asset?: Asset) => {
    if (asset) {
      setEditingAsset(asset);
      setFormData({
        name: asset.name,
        type: asset.type,
        description: asset.description || '',
        stock: asset.stock || 0,
      });
    } else {
      setEditingAsset(null);
      setFormData({
        name: '',
        type: 'ruangan',
        description: '',
        stock: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAsset) {
      toast.success('Aset berhasil diperbarui');
    } else {
      toast.success('Aset berhasil ditambahkan');
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (assetId: string) => {
    toast.success('Aset berhasil dihapus');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 font-bold">KELOLA ASET</h2>
          <p className="text-gray-600 mt-1">Manajemen ruangan dan barang</p>
        </div>

        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-[#B3202A] hover:bg-[#8A1C24] text-white"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="size-4 mr-2" />
              Tambah Aset
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingAsset ? 'Edit Aset' : 'Tambah Aset Baru'}</DialogTitle>
              <DialogDescription>
                {editingAsset ? 'Perbarui informasi aset' : 'Masukkan informasi aset baru'}
              </DialogDescription>
            </DialogHeader>

            {/* Form Dialog */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">

              <div className="space-y-2">
                <Label htmlFor="name">Nama Aset</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Ruang Meeting A"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipe Aset</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'ruangan' | 'barang') =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ruangan">Ruangan</SelectItem>
                    <SelectItem value="barang">Barang</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === 'barang' && (
                <div className="space-y-2">
                  <Label htmlFor="stock">Stok</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi aset..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-[#B3202A] hover:bg-[#8A1C24] text-white">
                  {editingAsset ? 'Perbarui' : 'Tambah'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistic Cards */}
      {/* (kode di bagian ini tidak diubah sama sekali, hanya path import yang di atas berubah) */}

      {/* … seluruh JSX kamu tetap sama … */}

    </div>
  );
}
