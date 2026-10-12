import { useEffect, useState } from 'react';
import axios from 'axios';

// Images are stored as base64 inside MongoDB, which inflates them by roughly
// a third. Downscaling in the browser keeps the free Atlas quota (512MB) from
// filling up and keeps uploads small enough to survive the proxy timeout.
const MAX_DIMENSION = 1600;
const QUALITY = 0.82;

const compressImage = async (file) => {
  // GIFs may be animated, so rasterising them would destroy frames
  if (file.type === 'image/gif') return file;

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not read that image.'));
      img.src = objectUrl;
    });

    const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return file;
    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/webp', QUALITY);
    });

    // A heavily compressed source can come out larger; keep the smaller one
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.webp', { type: 'image/webp' });
  } catch {
    // Never block an upload because optimisation failed
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
};

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
      const upload = await compressImage(file);
      const base64Data = await readAsDataUrl(upload);
      const response = await axios.post(
        '/api/images/upload',
        {
          filename: upload.name,
          data: base64Data,
          contentType: upload.type,
          size: upload.size
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
