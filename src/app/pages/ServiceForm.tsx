import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { ArrowLeft, Upload, FileText, Send } from 'lucide-react';
import { toast } from 'sonner';

const serviceNames: { [key: string]: string } = {
  ktp: 'KTP',
  kk: 'Kartu Keluarga',
  akta: 'Akta Kelahiran',
  skck: 'SKCK',
  domisili: 'Surat Domisili',
  usaha: 'Surat Usaha',
  kendaraan: 'Surat Kendaraan',
  lainnya: 'Lainnya'
};

export default function ServiceForm() {
  const { type } = useParams<{ type: string }>();
  const { user } = useAuth();
  const { addSubmission } = useData();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    description: '',
    notes: ''
  });
  const [files, setFiles] = useState<File[]>([]);

  React.useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    // Simulate file upload
    const attachments = files.map(file => `https://example.com/${file.name}`);

    addSubmission({
      userId: user.id,
      userName: user.name,
      serviceType: serviceNames[type || 'lainnya'],
      description: formData.description,
      attachments
    });

    toast.success('Pengajuan berhasil dikirim!');
    navigate('/status');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 mb-4 hover:text-blue-200 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
          <h1 className="text-3xl">Pengajuan {serviceNames[type || 'lainnya']}</h1>
          <p className="text-blue-100 mt-2">Isi formulir di bawah ini dengan lengkap</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Type Display */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <FileText className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Jenis Layanan</p>
                <p className="font-semibold text-gray-900">{serviceNames[type || 'lainnya']}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Pengajuan *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Jelaskan keperluan Anda secara detail..."
                rows={4}
                required
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Tambahan
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Informasi tambahan (opsional)"
                rows={3}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dokumen Pendukung *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    Pilih file
                  </span>
                  <span className="text-gray-600"> atau drag & drop</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PDF, JPG, JPEG, PNG (Max. 5MB per file)
                </p>
              </div>
              {files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      <FileText className="w-4 h-4" />
                      {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Requirements Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Persyaratan Dokumen:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Foto/scan KTP asli</li>
                <li>• Foto/scan Kartu Keluarga</li>
                <li>• Dokumen pendukung lainnya (jika diperlukan)</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Kirim Pengajuan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
