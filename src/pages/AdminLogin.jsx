import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { username: username.trim().toLowerCase(), password });
      onLogin(response.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1 className="admin-login-wordmark">Hariom</h1>
          <div>
            <p className="admin-login-label">Content Studio</p>
            <p className="admin-login-subtitle">Secure authentication required</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <label className="admin-login-field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="harry@43"
              required
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              disabled={loading}
              aria-invalid={Boolean(error)}
            />
          </label>

          <label className="admin-login-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              disabled={loading}
              aria-invalid={Boolean(error)}
            />
          </label>

          {error && (
            <div className="admin-login-error" role="alert">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="admin-login-button">
            {loading ? 'Authenticating…' : 'Sign in'}
          </button>
        </form>

        <p className="admin-login-footer">
          Admin portal · Portfolio management system
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
