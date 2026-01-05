import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Download, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Menunggu',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock
  },
  processing: {
    label: 'Diproses',
    color: 'bg-blue-100 text-blue-800',
    icon: FileText
  },
  approved: {
    label: 'Disetujui',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  rejected: {
    label: 'Ditolak',
    color: 'bg-red-100 text-red-800',
    icon: XCircle
  }
};

export default function SubmissionStatus() {
  const { user } = useAuth();
  const { submissions } = useData();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const userSubmissions = submissions.filter(s => s.userId === user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 mb-4 hover:text-blue-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <h1 className="text-3xl">Status Pengajuan</h1>
          <p className="text-blue-100 mt-2">Lacak status pengajuan layanan Anda</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {userSubmissions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl text-gray-900 mb-2">Belum Ada Pengajuan</h2>
            <p className="text-gray-600 mb-6">Anda belum memiliki pengajuan layanan</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Buat Pengajuan Baru
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userSubmissions.map((submission) => {
              const StatusIcon = statusConfig[submission.status].icon;
              
              return (
                <div key={submission.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {submission.serviceType}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[submission.status].color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig[submission.status].label}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{submission.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>ID: #{submission.id}</span>
                          <span>Diajukan: {submission.submittedDate}</span>
                          {submission.completedDate && (
                            <span>Selesai: {submission.completedDate}</span>
                          )}
                        </div>
                      </div>

                      {submission.documentUrl && submission.status === 'approved' && (
                        <div>
                          <button
                            onClick={() => window.open(submission.documentUrl, '_blank')}
                            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
                          >
                            <Download className="w-5 h-5" />
                            Download Dokumen
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <div className="absolute top-2 left-0 right-0 h-1 bg-gray-200">
                              <div 
                                className="h-full bg-blue-600 transition-all duration-500"
                                style={{
                                  width: submission.status === 'pending' ? '0%' : 
                                         submission.status === 'processing' ? '50%' : '100%'
                                }}
                              />
                            </div>
                            <div className="relative flex justify-between">
                              <div className="flex flex-col items-center">
                                <div className="w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-md" />
                                <span className="text-xs text-gray-600 mt-2">Diajukan</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full border-4 border-white shadow-md ${
                                  submission.status === 'processing' || submission.status === 'approved' || submission.status === 'rejected'
                                    ? 'bg-blue-600' : 'bg-gray-300'
                                }`} />
                                <span className="text-xs text-gray-600 mt-2">Diproses</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <div className={`w-5 h-5 rounded-full border-4 border-white shadow-md ${
                                  submission.status === 'approved' ? 'bg-green-600' : 
                                  submission.status === 'rejected' ? 'bg-red-600' : 'bg-gray-300'
                                }`} />
                                <span className="text-xs text-gray-600 mt-2">Selesai</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Informasi Status</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <span className="font-medium">Menunggu:</span> Pengajuan sedang menunggu verifikasi admin
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <span className="font-medium">Diproses:</span> Pengajuan sedang diproses oleh admin
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <div>
                <span className="font-medium">Disetujui:</span> Pengajuan disetujui, dokumen dapat diunduh
              </div>
            </div>
            <div className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
              <div>
                <span className="font-medium">Ditolak:</span> Pengajuan ditolak, hubungi admin untuk info lebih lanjut
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
