import { useState, useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { ProfilePage } from './pages/ProfilPages';
import { PeminjamanForm } from './pages/PeminjamanForm';
import { PengembalianForm } from './pages/PengembalianForm';
import { KalenderPeminjaman } from './pages/KalenderPeminjaman';
import { TabelPeminjaman } from './pages/TabelPeminjaman';
import { VerifikasiPengajuan } from './pages/VerifikasiPengajuan';
import { KelolaAset } from './pages/KelolaAset';
import { Sidebar } from './pages/sidebar';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
// import { Laporan } from './pages/Laporan';



export type UserRole = 'mahasiswa' | 'dosen' | 'staff' | 'verifikator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Asset {
  id: string;
  name: string;
  type: 'ruangan' | 'barang';
  stock : number;
  description : string;
  paket_id : string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  assetId: string;
  assetName: string;
  assetType: 'ruangan' | 'barang';
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'ajukan' | 'disetujui' | 'ditolak' | 'selesai';
  createdAt: string;
  returnedQuantity?: number;
  ukmOrmawa: string;
  namaKegiatan : string;
  verificationNote?: string;
}

export interface Paket {
  id: string;
  nama_paket: string;
  deskripsi?: string;
  kuota: number; 
}

export type Page = 'login' | 'dashboard' | 'profile' | 'peminjaman' | 'pengembalian' | 'kalender' | 'tabel' | 'verifikasi' | 'kelola-aset'; // <-- 'laporan' removed

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]); 
  const [pakets, setPakets] = useState<Paket[]>([]); 

    // PAKET AULA
    // { 
    //   id: '1', 
    //   name: 'Paket Aula', 
    //   type: 'ruangan', 
    //   stock: 1, 
    //   description: 'Aula Telkom Univ Surabaya (kapasitas ±500 orang) - Audio, Visual, Furniture lengkap' 
    // },
    // { 
    //   id: '2', 
    //   name: 'Paket Duduk Aula', 
    //   type: 'barang', 
    //   stock: 1, 
    //   description: 'Kursi Besar Tiger - 50 unit (1 set = 50 unit, khusus penggunaan di aula)' 
    // },
    
    // // PAKET KELAS
    // { 
    //   id: '3', 
    //   name: 'Paket Kelas', 
    //   type: 'ruangan', 
    //   stock: 8, 
    //   description: 'Ruang Kelas Sekat/Gabung - Include TV, HDMI, Remote, AC, Kursi 45 unit, Meja Staff' 
    // },
    
    // // PAKET LISTRIK
    // { 
    //   id: '4', 
    //   name: 'Paket Listrik', 
    //   type: 'barang', 
    //   stock: 10, 
    //   description: 'Kabel roll 5 meter - 3 unit per set' 
    // },
    
    // // PAKET VISUAL
    // { 
    //   id: '5', 
    //   name: 'Paket Visual', 
    //   type: 'barang', 
    //   stock: 3, 
    //   description: 'TV Panasonic 55", HDMI 10/15m, Remote TV, Kabel roll 5m' 
    // },
    
    // // PAKET AUDIO
    // { 
    //   id: '6', 
    //   name: 'Paket Audio Lapangan', 
    //   type: 'barang', 
    //   stock: 2, 
    //   description: 'Speaker Baritone 15H, Mixer portable, Stand, Kabel XLR & Olor 25m, Wireless mic (2 unit)' 
    // },
    // { 
    //   id: '7', 
    //   name: 'Paket Audio Medium', 
    //   type: 'barang', 
    //   stock: 3, 
    //   description: 'Speaker portable, Wireless mic (2 unit), Kabel roll, RCA to 3.5mm' 
    // },
    
    // // PAKET LIGHTING
    // { 
    //   id: '8', 
    //   name: 'Paket Lighting', 
    //   type: 'barang', 
    //   stock: 1, 
    //   description: 'Lampu GVM RGB (2 unit), COB Godox 60W, Tripod GVM (2 unit), Tripod COB, Kabel Olor 5m (3 unit)' 
    // },
    
    // // PAKET KOMUNIKASI
    // { 
    //   id: '9', 
    //   name: 'Paket Komunikasi', 
    //   type: 'barang', 
    //   stock: 3, 
    //   description: 'Handy Talky (HT) - 4 unit + Charger HT 4 unit per set' 
    // },
    
    // // PAKET STREAMING
    // { 
    //   id: '10', 
    //   name: 'Paket Streaming', 
    //   type: 'barang', 
    //   stock: 1, 
    //   description: 'Camcorder Sony, Tripod, Atem Mini Pro, Capture Card, HDMI 15m (7 unit), HDMI 3m (4 unit), Extender, Splitter' 
    // },
    
    // // PAKET MUSYAWARAH
    // { 
    //   id: '11', 
    //   name: 'Paket Musyawarah', 
    //   type: 'barang', 
    //   stock: 1, 
    //   description: 'Bendera Merah Putih, Bendera Telkom Univ Surabaya, Tiang Bendera Set (3 unit), Palu Sidang' 
    // },
    
    // // TAMBAHAN / ADD ONS
    // { 
    //   id: '12', 
    //   name: 'Megaphone / TOA', 
    //   type: 'barang', 
    //   stock: 2, 
    //   description: 'Megaphone untuk pengumuman atau kegiatan outdoor' 
    // },

  // useEffect(() => {
  //   // Load mock data with various scenarios
  //   const mockBookings: Booking[] = [
  //     // Booking yang SUDAH DISETUJUI dan bisa dikembalikan (untuk user ID '1')
  //     {
  //       id: '1',
  //       userId: '1',
  //       userName: 'John Doe',
  //       assetId: '1',
  //       assetName: 'Paket Aula',
  //       assetType: 'ruangan',
  //       quantity: 1,
  //       startDate: '2025-12-24',
  //       endDate: '2025-12-26',
  //       status: 'disetujui',
  //       createdAt: '2025-12-01T10:00:00Z',
  //       ukmOrmawa: 'UKM Telkom Art',
  //     },
  //     {
  //       id: '2',
  //       userId: '1',
  //       userName: 'John Doe',
  //       assetId: '6',
  //       assetName: 'Paket Audio Lapangan',
  //       assetType: 'barang',
  //       quantity: 2,
  //       startDate: '2025-12-25',
  //       endDate: '2025-12-28',
  //       status: 'disetujui',
  //       createdAt: '2025-12-02T14:00:00Z',
  //       ukmOrmawa: 'Badan Eksekutif Mahasiswa (BEM)',
  //     },
  //     {
  //       id: '3',
  //       userId: '1',
  //       userName: 'John Doe',
  //       assetId: '5',
  //       assetName: 'Paket Visual',
  //       assetType: 'barang',
  //       quantity: 3,
  //       startDate: '2025-12-23',
  //       endDate: '2025-12-27',
  //       status: 'disetujui',
  //       createdAt: '2025-12-03T09:00:00Z',
  //       ukmOrmawa: 'Himpunan Mahasiswa Informatika',
  //     },
  //     {
  //       id: '4',
  //       userId: '1',
  //       userName: 'John Doe',
  //       assetId: '3',
  //       assetName: 'Paket Kelas',
  //       assetType: 'ruangan',
  //       quantity: 2,
  //       startDate: '2025-12-26',
  //       endDate: '2025-12-26',
  //       status: 'disetujui',
  //       createdAt: '2025-12-04T11:00:00Z',
  //       ukmOrmawa: 'Dewan Perwakilan Mahasiswa (DPM)',
  //     },
  //     {
  //       id: '5',
  //       userId: '1',
  //       userName: 'John Doe',
  //       assetId: '9',
  //       assetName: 'Paket Komunikasi',
  //       assetType: 'barang',
  //       quantity: 1,
  //       startDate: '2025-12-29',
  //       endDate: '2025-12-31',
  //       status: 'disetujui',
  //       createdAt: '2025-12-05T15:00:00Z',
  //       ukmOrmawa: 'UKM E-Sport',
  //     },
  //     // Booking yang MENUNGGU VERIFIKASI (status: ajukan)
  //     {
  //       id: '6',
  //       userId: '1',
  //       userName: 'John Doe',
  //       assetId: '12',
  //       assetName: 'Megaphone / TOA',
  //       assetType: 'barang',
  //       quantity: 1,
  //       startDate: '2025-12-30',
  //       endDate: '2025-12-30',
  //       status: 'ajukan',
  //       createdAt: '2025-12-06T08:00:00Z',
  //       ukmOrmawa: 'UKM Robotika',
  //     },
  //     {
  //       id: '7',
  //       userId: '2',
  //       userName: 'Jane Smith',
  //       assetId: '7',
  //       assetName: 'Paket Audio Medium',
  //       assetType: 'barang',
  //       quantity: 1,
  //       startDate: '2025-12-27',
  //       endDate: '2025-12-29',
  //       status: 'ajukan',
  //       createdAt: '2025-12-07T16:00:00Z',
  //       ukmOrmawa: 'UKM Paduan Suara Vox Auream',
  //     },
  //     // Booking dari user lain yang sudah disetujui
  //     {
  //       id: '8',
  //       userId: '2',
  //       userName: 'Jane Smith',
  //       assetId: '10',
  //       assetName: 'Paket Streaming',
  //       assetType: 'barang',
  //       quantity: 1,
  //       startDate: '2025-12-28',
  //       endDate: '2025-12-30',
  //       status: 'disetujui',
  //       createdAt: '2025-12-08T10:00:00Z',
  //       ukmOrmawa: 'UKM Media',
  //     },
  //   ];
  //   setBookings(mockBookings);
  // }, []);

  const handleLogin = async (user: User) => {
  try {
    const dashboardRes = await fetch('http://localhost:8080/logistikcenterbackendd/api/dashboard/data', {
      credentials: 'include',
    });

    if (!dashboardRes.ok) {
      throw new Error('Gagal ambil data dashboard');
    }

    const dashboardData = await dashboardRes.json();

    // 🔹 Ambil PAKETS secara terpisah
    const paketRes = await fetch('http://localhost:8080/logistikcenterbackendd/api/paket/list', {
      credentials: 'include',
    });
    const paketData = await paketRes.json();
    const paketsFromApi = paketData.pakets || [];

    // Simpan ke state
    setCurrentUser(user);
    setBookings(dashboardData.bookings || []);
    setAssets(dashboardData.assets || []);
    setPakets(paketsFromApi); // ✅ Ini yang ditambahkan!
    setCurrentPage('dashboard');

  } catch (err) {
    console.error(err);
    alert('Gagal memuat data dashboard. Coba login ulang.');
  }
};

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  // Tambahkan ini di dalam function App()
// DI APP.TSX - GANTI SELURUH FUNGSI loadDashboardData DENGAN INI:
const loadDashboardData = async () => {
  try {
    // Ambil data dashboard
    const dashboardRes = await fetch('http://localhost:8080/logistikcenterbackendd/api/dashboard/data', {
      credentials: 'include',
    });
    if (!dashboardRes.ok) throw new Error('Gagal ambil data dashboard');
    const dashboardData = await dashboardRes.json();
    setBookings(dashboardData.bookings || []);
    setAssets(dashboardData.assets || []);

    // 🔹 Ambil data paket
    const paketRes = await fetch('http://localhost:8080/logistikcenterbackendd/api/paket/list', {
      credentials: 'include',
    });
    if (!paketRes.ok) throw new Error('Gagal ambil data paket');
    const paketData = await paketRes.json();
    setPakets(paketData.pakets || []);
    
  } catch (err) {
    console.error(err);
    toast.error('Gagal memuat data terbaru', {
      description: 'Coba refresh halaman'
    });
  }
};



  const handleSubmitBooking = async (booking: any) => {
  if (!currentUser) return;

  try {
    const res = await fetch('http://localhost:8080/logistikcenterbackendd/api/booking/submit', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });

    const result = await res.json();

    if (result.success) {
      
      await loadDashboardData();
      
      await loadCalendarBookings(); 
      
      toast.success('Peminjaman berhasil!', {
        description: 'Pengajuan peminjaman sedang diproses oleh verifikator'
      });
    } else {
      toast.error('Gagal submit', { 
        description: result.message || 'Terjadi kesalahan saat mengajukan peminjaman' 
      });
    }
  } catch (err) {
    console.error(err);
    toast.error('Error koneksi', { 
      description: 'Tidak bisa terhubung ke server backend' 
    });
  }
};

  const handleSubmitReturn = async (bookingId: string, returnedQuantity: number) => {
  try {
    // 🔌 Kirim ke backend
    const res = await fetch('http://localhost:8080/logistikcenterbackendd/api/booking/return', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, returnedQuantity }),
    });

    const result = await res.json();

    if (result.success) {
      const dashboardRes = await fetch('http://localhost:8080/logistikcenterbackendd/api/dashboard/data', {
        credentials: 'include',
      });
      const dashboardData = await dashboardRes.json();
      
      setBookings(dashboardData.bookings || []);
      setAssets(dashboardData.assets || []);
      
      toast.success('Pengembalian berhasil!');
    } else {
      toast.error('Gagal', { description: result.message });
    }
  } catch (err) {
    toast.error('Error koneksi', { description: 'Tidak bisa terhubung ke server' });
  }
};

const handleUpdateBookingStatus = async (bookingId: string, status: 'disetujui' | 'ditolak', note?: string ) => {
  try {
    // 🔌 Kirim ke backend Java
    const res = await fetch('http://localhost:8080/logistikcenterbackendd/api/booking/verify', {
      method: 'POST',
      credentials: 'include', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, status, note }),
    });

    const result = await res.json();

    if (result.success) {

      const dashboardRes = await fetch('http://localhost:8080/logistikcenterbackendd/api/dashboard/data', {
        credentials: 'include',
      });
      const dashboardData = await dashboardRes.json();
      
      setBookings(dashboardData.bookings || []);
      toast.success('Verifikasi berhasil!', {
        description: `Pengajuan ${status === 'disetujui' ? 'disetujui' : 'ditolak'}`
      });
    } else {
      toast.error('Gagal verifikasi', { description: result.message });
    }
  } catch (err) {
    toast.error('Error koneksi', { description: 'Tidak bisa terhubung ke server' });
  }
};

const loadAssets = async () => {
  try {
    const res = await fetch('http://localhost:8080/logistikcenterbackendd/api/asset/list', {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Gagal ambil data aset');
    const data = await res.json();
    setAssets(data.assets || []);
  } catch (err) {
    console.error(err);
    toast.error('Gagal memuat data aset');
  }
};

// DI APP.TSX - TAMBAHKAN FUNGSI INI
const loadCalendarData = async () => {
  try {
    const res = await fetch('http://localhost:8080/logistikcenterbackendd/api/calendar/bookings', {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Gagal ambil data kalender');
    const bookings = await res.json();
    return bookings;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const [calendarBookings, setCalendarBookings] = useState<Booking[]>([]);

// DI APP.TSX
const loadCalendarBookings = async () => {
  try {
    const res = await fetch('http://localhost:8080/logistikcenterbackendd/api/calendar/bookings', {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Gagal ambil data kalender');
    const data = await res.json();
    setCalendarBookings(data);
  } catch (err) {
    console.error(err);
    toast.error('Gagal memuat data kalender', {
      description: 'Coba refresh halaman'
    });
  }
};

  const renderPage = () => {
    if (!currentUser && currentPage !== 'login') {
      return <LoginPage onLogin={handleLogin} />;
    }

    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'dashboard':
        return <Dashboard user={currentUser!} bookings={bookings} assets={assets} onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage user={currentUser!} onUpdate={handleUpdateProfile} />;
      case 'peminjaman':
        return <PeminjamanForm user={currentUser!} assets={assets} bookings={bookings} pakets={pakets} onSubmit={handleSubmitBooking} />;
      case 'pengembalian':
        return <PengembalianForm user={currentUser!} bookings={bookings.filter(b => b.userId === currentUser?.id && b.status === 'disetujui' && !b.returnedQuantity)} onSubmit={handleSubmitReturn} />;
      case 'kalender':
        return <KalenderPeminjaman bookings={bookings} assets={assets} />;
      case 'tabel':
        return <TabelPeminjaman bookings={bookings} assets={assets} />;
      case 'verifikasi':
        return <VerifikasiPengajuan bookings={bookings} onUpdateStatus={handleUpdateBookingStatus} />;
      case 'kelola-aset':
        return <KelolaAset assets={assets} />;
      default:
        return <Dashboard user={currentUser!} bookings={bookings} assets={assets} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {currentUser && (
        <Sidebar 
          user={currentUser} 
          currentPage={currentPage}
          onNavigate={setCurrentPage} 
          onLogout={handleLogout} 
        />
      )}
      <main className={currentUser ? 'ml-64' : ''}>
        {renderPage()}
      </main>
      <Toaster />
    </div>
  );
}

export default App;