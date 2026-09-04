# Admin Panel Documentation

## Access the Admin Panel

Navigate to: `https://hariomchauhan.com.np/admin`

## Default Credentials (Development Mode)
- **Username**: `admin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change these credentials in production by setting up MongoDB and creating a new admin account!

## Features

### 1. Contact Messages Tab
- View all contact form submissions
- See sender name, email, message, and timestamp
- Delete messages after responding
- Sorted by newest first

### 2. Projects Tab
- View all portfolio projects
- See project details: title, description, tech stack, GitHub links
- Delete outdated projects
- Featured projects are highlighted

### 3. Certificates Tab
- View all certificates
- See issuer, date, and credential links
- Delete expired or irrelevant certificates

### 4. Analytics Tab
- **Total Visits**: Lifetime visitor count
- **Visits Today**: Today's unique visits
- **Quick Stats**: 
  - Total projects count
  - Total certificates count
  - Total contact messages
  - Average daily visits

## How It Works

### Authentication
- JWT-based authentication with 7-day token expiry
- Token stored in browser localStorage
- Protected routes require valid Bearer token
- Logout clears token and returns to login

### API Endpoints (All Protected)
```
POST   /api/auth/login          - Login and get JWT token
GET    /api/admin/contacts      - Get all contact messages
DELETE /api/admin/contacts/:id  - Delete a contact message
GET    /api/admin/projects      - Get all projects
DELETE /api/admin/projects/:id  - Delete a project
GET    /api/admin/certificates  - Get all certificates
DELETE /api/admin/certificates/:id - Delete a certificate
GET    /api/admin/analytics     - Get visit statistics
```

## Production Setup

### 1. Set Up MongoDB
```bash
# In backend/.env
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=production
```

### 2. Create First Admin
Use the register endpoint once (then it's disabled):
```bash
curl -X POST https://your-backend.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"your-username","password":"your-strong-password"}'
```

### 3. Login
```bash
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your-username","password":"your-strong-password"}'
```

## Security Notes

1. **Change Default Password**: Immediately change `admin123` in production
2. **Strong JWT Secret**: Use a long, random string for `JWT_SECRET`
3. **HTTPS Only**: Ensure backend uses HTTPS in production
4. **Rate Limiting**: Consider adding rate limiting to auth endpoints
5. **Monitor Access**: Regularly check analytics for suspicious activity

## Development vs Production

### Development (server-dev.js)
- In-memory data (resets on restart)
- No database required
- Default admin: `admin` / `admin123`
- Mock analytics data

### Production (server.js)
- MongoDB Atlas persistence
- Data survives restarts
- Real analytics from Visit collection
- Secure admin registration

## Troubleshooting

### "Invalid credentials" error
- Check username/password spelling
- Ensure admin account exists in database
- Verify bcrypt is hashing correctly

### "No token provided" error
- Login again to get fresh token
- Check localStorage for `adminToken`
- Clear browser cache and retry

### "Route not found" (404)
- Verify backend server is running
- Check API endpoint paths are correct
- Ensure admin routes are registered in server.js

## Future Enhancements

- [ ] Add project/certificate creation via admin UI
- [ ] Edit existing entries
- [ ] Bulk operations (delete multiple)
- [ ] Export contacts to CSV
- [ ] Real-time visit updates
- [ ] Dark/light mode toggle
- [ ] Two-factor authentication
- [ ] Activity logs
