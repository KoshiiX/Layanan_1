import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  LogOut,
  Inbox,
  History,
  TrendingUp,
  Newspaper
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { submissions } = useData();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  // Calculate statistics
  const totalSubmissions = submissions.length;
  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;
  const processingSubmissions = submissions.filter(s => s.status === 'processing').length;
  const approvedSubmissions = submissions.filter(s => s.status === 'approved').length;
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected').length;

  const stats = [
    {
      title: 'Total Pengajuan',
      value: totalSubmissions,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Menunggu',
      value: pendingSubmissions,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Diproses',
      value: processingSubmissions,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Disetujui',
      value: approvedSubmissions,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  const quickActions = [
    {
      title: 'Kelola Pengguna',
      description: 'Lihat dan kelola data pengguna',
      icon: Users,
      color: 'bg-blue-500',
      path: '/admin/users'
    },
    {
      title: 'Kotak Masuk',
      description: 'Proses pengajuan baru',
      icon: Inbox,
      color: 'bg-green-500',
      path: '/admin/inbox',
      badge: pendingSubmissions
    },
    {
      title: 'Kelola Berita',
      description: 'Update berita kelurahan',
      icon: Newspaper,
      color: 'bg-orange-500',
      path: '/admin/news'
    },
    {
      title: 'Riwayat',
      description: 'Lihat riwayat pengajuan',
      icon: History,
      color: 'bg-purple-500',
      path: '/admin/history'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl mb-2">Dashboard Admin</h1>
              <p className="text-indigo-100">Selamat datang, {user.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="relative flex flex-col items-start p-6 rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-md transition text-left"
              >
                {action.badge && action.badge > 0 && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {action.badge}
                  </span>
                )}
                <div className={`${action.color} p-3 rounded-lg mb-3`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pengajuan Terbaru</h2>
          <div className="space-y-3">
            {submissions.slice(0, 5).map((submission) => (
              <div 
                key={submission.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{submission.serviceType}</p>
                    <p className="text-sm text-gray-600">{submission.userName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{submission.submittedDate}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    submission.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {submission.status === 'pending' ? 'Menunggu' :
                     submission.status === 'processing' ? 'Diproses' :
                     submission.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                  </span>
                </div>
              </div>
            ))}
            {submissions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Belum ada pengajuan
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}