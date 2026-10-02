import { useEffect, useState } from 'react';
import axios from 'axios';

const ImageUploader = ({ value, onChange, label, token }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');
  const [error, setError] = useState('');

  // The parent owns the value: re-syncing on change is what makes the preview
  // correct when the form is repopulated by "Edit" or reset by section switches.
  useEffect(() => {
    setPreview(value || '');
  }, [value]);

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    // Allow re-selecting the same file after a failure
    event.target.value = '';
    if (!file) return;

    setError('');

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setError('Unsupported file type. Use JPEG, PNG, GIF or WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image is larger than the 5MB limit.');
      return;
    }

    setUploading(true);

    const readAsDataUrl = (blob) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Could not read the selected file.'));
        reader.readAsDataURL(blob);
      });

    try {
      const base64Data = await readAsDataUrl(file);
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

      setPreview(response.data.url);
      onChange(response.data.url);
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url) => {
    setError('');
    setPreview(url);
    onChange(url);
  };

  const handleRemove = () => {
    setPreview('');
    setError('');
    onChange('');
  };

  return (
    <div className="image-uploader">
      <div className="image-uploader-input">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="Paste an image URL"
          className="image-uploader-url"
          aria-label="Image URL"
        />
        <label className={`image-uploader-button${uploading ? ' is-busy' : ''}`}>
          {uploading ? 'Uploading…' : 'Upload'}
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      {error && (
        <p className="image-uploader-error" role="alert">{error}</p>
      )}

      {preview && (
        <figure className="image-uploader-preview">
          <img src={preview} alt="" />
          <figcaption className="image-uploader-actions">
            <button type="button" onClick={handleRemove} className="image-uploader-remove">
              Remove image
            </button>
          </figcaption>
        </figure>
      )}

      <small className="image-uploader-hint">
        {label || 'Upload an image (max 5MB) or paste a URL'}
      </small>
    </div>
  );
};

export default ImageUploader;
