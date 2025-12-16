import React, { useState } from 'react';
import api from '../services/api';

const UploadModal = ({ isOpen, onClose, onUploadSuccess, challengeId, taskId }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }
      setFile(selectedFile);
      setError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('challengeId', challengeId || '');
    formData.append('taskId', taskId || '');

    try {
      setUploading(true);
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      onUploadSuccess({
        url: response.data.url,
        public_id: response.data.public_id,
        resource_type: response.data.resource_type,
        challengeId,
        taskId
      });

      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">Submit Proof</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Photo or Video
          </label>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Max file size: 50MB. Supported: JPG, PNG, MP4, MOV, AVI
          </p>
        </div>

        {preview && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            {file.type.startsWith('video/') ? (
              <video
                src={preview}
                controls
                className="w-full max-h-48 rounded-md"
              />
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-48 object-cover rounded-md"
              />
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploading || !file}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
