import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  ArrowLeft, 
  FileText, 
  Clock, 
  User,
  Calendar,
  Upload,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminInbox() {
  const { user } = useAuth();
  const { submissions, updateSubmission } = useData();
  const navigate = useNavigate();
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);

  React.useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const pendingSubmissions = submissions.filter(s => s.status === 'pending' || s.status === 'processing');

  const handleProcessSubmission = (id: string) => {
    updateSubmission(id, { status: 'processing' });
    toast.success('Pengajuan sedang diproses');
  };

  const handleApprove = (id: string) => {
    if (!documentFile) {
      toast.error('Upload dokumen terlebih dahulu');
      return;
    }

    // Simulate file upload
    const documentUrl = `https://example.com/documents/${documentFile.name}`;
    
    updateSubmission(id, { 
      status: 'approved',
      completedDate: new Date().toISOString().split('T')[0],
      documentUrl
    });
    
    toast.success('Pengajuan disetujui!');
    setSelectedSubmission(null);
    setActionType(null);
    setDocumentFile(null);
  };

  const handleReject = (id: string) => {
    updateSubmission(id, { 
      status: 'rejected',
      completedDate: new Date().toISOString().split('T')[0]
    });
    
    toast.success('Pengajuan ditolak');
    setSelectedSubmission(null);
    setActionType(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 mb-4 hover:text-indigo-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali ke Dashboard
          </button>
          <h1 className="text-3xl">Kotak Masuk</h1>
          <p className="text-indigo-100 mt-2">Kelola pengajuan yang masuk</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Menunggu</p>
                <p className="text-3xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sedang Diproses</p>
                <p className="text-3xl font-bold text-gray-900">
                  {submissions.filter(s => s.status === 'processing').length}
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Daftar Pengajuan</h2>
          </div>

          {pendingSubmissions.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p>Tidak ada pengajuan baru</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingSubmissions.map((submission) => (
                <div key={submission.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Submission Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{submission.serviceType}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {submission.status === 'pending' ? 'Menunggu' : 'Diproses'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{submission.userName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{submission.submittedDate}</span>
                        </div>
                      </div>

                      <p className="text-gray-700 mb-3">{submission.description}</p>

                      {submission.attachments && submission.attachments.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <FileText className="w-4 h-4" />
                          <span>{submission.attachments.length} dokumen dilampirkan</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      {submission.status === 'pending' && (
                        <button
                          onClick={() => handleProcessSubmission(submission.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          <Eye className="w-4 h-4" />
                          Proses
                        </button>
                      )}
                      
                      {submission.status === 'processing' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission.id);
                              setActionType('approve');
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Setujui
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSubmission(submission.id);
                              setActionType('reject');
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            <XCircle className="w-4 h-4" />
                            Tolak
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Modal */}
                  {selectedSubmission === submission.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {actionType === 'approve' ? (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Upload Dokumen Approval</h4>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-3">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <label className="cursor-pointer">
                              <span className="text-blue-600 hover:text-blue-700 font-medium">
                                Pilih file
                              </span>
                              <input
                                type="file"
                                onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                                className="hidden"
                                accept=".pdf"
                              />
                            </label>
                            {documentFile && (
                              <p className="text-sm text-gray-600 mt-2">{documentFile.name}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedSubmission(null);
                                setActionType(null);
                                setDocumentFile(null);
                              }}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                            >
                              Batal
                            </button>
                            <button
                              onClick={() => handleApprove(submission.id)}
                              disabled={!documentFile}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                              Konfirmasi Setujui
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Konfirmasi Penolakan</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Apakah Anda yakin ingin menolak pengajuan ini?
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedSubmission(null);
                                setActionType(null);
                              }}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                            >
                              Batal
                            </button>
                            <button
                              onClick={() => handleReject(submission.id)}
                              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                              Konfirmasi Tolak
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
