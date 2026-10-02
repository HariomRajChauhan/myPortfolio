import { useState } from 'react';
import axios from 'axios';

const ImageUploader = ({ value, onChange, label, token }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    setUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result;

        // Upload to server
        const response = await axios.post(
          '/api/images/upload',
          {
            filename: file.name,
            data: base64Data,
            contentType: file.type,
            size: file.size
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const imageUrl = response.data.url;
        setPreview(imageUrl);
        onChange(imageUrl);
        setUploading(false);
      };

      reader.onerror = () => {
        alert('Failed to read file');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error.response?.data?.message || 'Failed to upload image');
      setUploading(false);
    }
  };

  const handleUrlChange = (url) => {
    setPreview(url);
    onChange(url);
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div className="image-uploader">
      <div className="image-uploader-input">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="Enter image URL or upload a file"
          className="image-uploader-url"
        />
        <label className="image-uploader-button">
          {uploading ? 'Uploading...' : 'Upload'}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {preview && (
        <div className="image-uploader-preview">
          <img src={preview} alt="Preview" />
          <button type="button" onClick={handleRemove} className="image-uploader-remove">
            Remove
          </button>
        </div>
      )}

      <small className="image-uploader-hint">
        {label || 'Upload an image (max 5MB) or paste a URL'}
      </small>
    </div>
  );
};

export default ImageUploader;
