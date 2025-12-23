import { useState } from "react";
// Booking is a type → use type-only import
import type { Booking } from "../App";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import {
  Search,
  CheckCircle,
  XCircle,
  FileText,
  Filter,
  Package,
  Home,
  Calendar,
  Eye,
  TrendingUp,
  History,
} from "lucide-react";

interface RiwayatVerifikasiProps {
  bookings: Booking[];
  onViewDetail?: (booking: Booking) => void;
}

export default function RiwayatVerifikasi({ bookings, onViewDetail }: RiwayatVerifikasiProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] =
    useState<"all" | "disetujui" | "ditolak">("all");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: Booking["status"]) => {
    switch (status) {
      case "disetujui":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="size-3 mr-1" /> Disetujui
          </Badge>
        );
      case "ditolak":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="size-3 mr-1" /> Ditolak
          </Badge>
        );
      case "selesai":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <CheckCircle className="size-3 mr-1" /> Selesai
          </Badge>
        );
      default:
        return null;
    }
  };

  const verifiedBookings = bookings.filter(
    (b) => b.status === "disetujui" || b.status === "ditolak" || b.status === "selesai"
  );

  const filteredBookings = verifiedBookings.filter((booking) => {
    if (filterStatus === "disetujui" && booking.status !== "disetujui" && booking.status !== "selesai")
      return false;
    if (filterStatus === "ditolak" && booking.status !== "ditolak") return false;

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
    total: verifiedBookings.length,
    approved: verifiedBookings.filter((b) => b.status === "disetujui" || b.status === "selesai").length,
    rejected: verifiedBookings.filter((b) => b.status === "ditolak").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-gray-900">Riwayat Verifikasi</h2>
        <p className="text-gray-600 mt-1">Daftar peminjaman yang telah diverifikasi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#147EFB] to-[#0C5FD1] rounded-2xl opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
          <Card className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-[#147EFB] to-[#0C5FD1] rounded-xl shadow-lg">
                  <History className="size-6 text-white" />
                </div>
                <FileText className="size-5 text-[#147EFB]/40" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <CardDescription>Total Terverifikasi</CardDescription>
              <CardTitle className="text-4xl text-[#147EFB]">{stats.total}</CardTitle>
            </CardContent>
          </Card>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4CAF50] to-[#388E3C] rounded-2xl opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
          <Card className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-[#4CAF50] to-[#388E3C] rounded-xl shadow-lg">
                  <CheckCircle className="size-6 text-white" />
                </div>
                <TrendingUp className="size-5 text-[#4CAF50]/40" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <CardDescription>Disetujui</CardDescription>
              <CardTitle className="text-4xl text-[#4CAF50]">{stats.approved}</CardTitle>
            </CardContent>
          </Card>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#E53935] to-[#C62828] rounded-2xl opacity-75 group-hover:opacity-100 blur group-hover:blur-md transition duration-300"></div>
          <Card className="relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-0">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-gradient-to-br from-[#E53935] to-[#C62828] rounded-xl shadow-lg">
                  <XCircle className="size-6 text-white" />
                </div>
                <TrendingUp className="size-5 text-[#E53935]/40" />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <CardDescription>Ditolak</CardDescription>
              <CardTitle className="text-4xl text-[#E53935]">{stats.rejected}</CardTitle>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <CardTitle className="flex items-center gap-2">
            <History className="size-5 text-[#B3202A]" /> Daftar Riwayat Verifikasi
          </CardTitle>
          <CardDescription>Filter dan cari riwayat verifikasi peminjaman</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Cari nama aset atau peminjam..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="size-4 text-gray-500" />
              <Tabs value={filterStatus} onValueChange={(val) => setFilterStatus(val as any)} className="flex-1">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">Semua ({stats.total})</TabsTrigger>
                  <TabsTrigger value="disetujui">Disetujui ({stats.approved})</TabsTrigger>
                  <TabsTrigger value="ditolak">Ditolak ({stats.rejected})</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#B3202A] hover:bg-[#B3202A]">
                  <TableHead className="text-white">No</TableHead>
                  <TableHead className="text-white">Peminjam</TableHead>
                  <TableHead className="text-white">Jenis Aset</TableHead>
                  <TableHead className="text-white">Nama Aset</TableHead>
                  <TableHead className="text-white">Tanggal Verifikasi</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Catatan</TableHead>
                  <TableHead className="text-white">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      <FileText className="size-12 mx-auto mb-3 text-gray-300" />
                      Tidak ada riwayat verifikasi
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking, index) => (
                    <TableRow key={booking.id} className="hover:bg-gray-50">
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <p className="text-gray-900">{booking.userName}</p>
                          <p className="text-xs text-gray-500">ID: {booking.userId.slice(0, 8)}...</p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          {booking.assetType === "ruangan" ? (
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
                        <p className="text-gray-900">{booking.assetName}</p>
                        <p className="text-xs text-gray-500">{booking.quantity} {booking.assetType === "ruangan" ? "ruangan" : "unit"}</p>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 text-gray-400" />
                          <span className="text-sm">{formatDate(booking.createdAt)}</span>
                        </div>
                      </TableCell>

                      <TableCell>{getStatusBadge(booking.status)}</TableCell>

                      <TableCell>
                        <p className="text-sm text-gray-600 max-w-xs truncate">
                          {booking.status === "ditolak"
                            ? "Tidak memenuhi persyaratan"
                            : "Peminjaman disetujui sesuai jadwal"}
                        </p>
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewDetail && onViewDetail(booking)}
                          className="hover:bg-blue-50 hover:border-blue-300"
                        >
                          <Eye className="size-4 mr-1" /> Detail
                        </Button>
                      </TableCell>
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