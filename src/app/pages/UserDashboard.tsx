import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  FileText, 
  Home, 
  UserCircle, 
  Car, 
  Briefcase, 
  Building, 
  Mail, 
  HelpCircle,
  LogOut,
  User,
  ClipboardList,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const services = [
  { id: 'Legalisasi Umum', name: 'Legalisasi Umum', icon: FileText, color: 'bg-blue-500' },
  { id: 'Pengantar Nikah, Talak, Cerai, Rujuk', name: 'Pengantar Nikah, Talak, Cerai, Rujuk', icon: Home, color: 'bg-green-500' },
  { id: 'Fasilitas Besok Kiamat', name: 'Fasilitas Besok Kiamat', icon: UserCircle, color: 'bg-purple-500' },
  { id: 'Pernyataan Ahli Waris', name: 'Pernyataan Ahli Waris', icon: Mail, color: 'bg-yellow-500' },
  { id: 'Prakerin Mahasiswa', name: 'Prakerin Mahasiswa', icon: Building, color: 'bg-red-500' },
  { id: 'Layanan Kelahiran', name: 'Layanan Kelahiran', icon: Briefcase, color: 'bg-indigo-500' },
  { id: 'Pendaftaran Administrasi Kependudukan', name: 'Pendaftaran Administrasi Kependudukan', icon: Car, color: 'bg-orange-500' },
  { id: 'lainnya', name: 'Lainnya', icon: HelpCircle, color: 'bg-pink-500' }
];

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { news } = useData();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
    }
  }, [user, navigate]);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % news.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [news.length]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % news.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + news.length) % news.length);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl mb-2">Selamat Datang, {user.name}!</h1>
              <p className="text-blue-100">Layanan Administrasi Kelurahan Online</p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-4">
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 md:px-4 py-2 rounded-lg transition text-sm"
              >
                <User className="w-4 h-4 md:w-5 md:h-5" />
                Profil
              </button>
              <button
                onClick={() => navigate('/status')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 md:px-4 py-2 rounded-lg transition text-sm"
              >
                <ClipboardList className="w-4 h-4 md:w-5 md:h-5" />
                Status
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 md:px-4 py-2 rounded-lg transition text-sm"
              >
                <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Layanan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl mb-6">Layanan Tersedia</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => navigate(`/service/${service.id}`)}
                    className="flex flex-col items-center p-6 rounded-xl hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                  >
                    <div className={`${service.color} p-4 rounded-full mb-3`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-center text-sm">{service.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Slider Berita */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h2 className="text-2xl mb-4">Berita Terkini</h2>
              <div className="relative">
                {news.length > 0 && (
                  <div className="space-y-4">
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <img
                        src={news[currentSlide].image}
                        alt={news[currentSlide].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <p className="text-xs mb-1">{news[currentSlide].date}</p>
                        <h3 className="font-semibold">{news[currentSlide].title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">{news[currentSlide].description}</p>
                    
                    <div className="flex justify-between items-center">
                      <button
                        onClick={prevSlide}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <div className="flex gap-2">
                        {news.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition ${
                              index === currentSlide ? 'bg-blue-600 w-6' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={nextSlide}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg mb-2">Informasi Penting</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Pastikan dokumen yang diupload sesuai dengan persyaratan</li>
            <li>• Proses verifikasi memakan waktu 1-3 hari kerja</li>
            <li>• Untuk bantuan, hubungi admin melalui halaman Kontak</li>
          </ul>
        </div>
      </div>
    </div>
  );
}