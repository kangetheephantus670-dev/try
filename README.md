# TRY - Customer Report Management System

A full-stack web application for managing customer reports and responses with an admin dashboard.

## Features

✅ Customer report submission form  
✅ Real-time report status tracking  
✅ Admin dashboard for managing reports  
✅ Admin responses to customer reports  
✅ Report categorization  
✅ Status management (pending, reviewing, resolved, closed)  
✅ Responsive design  
✅ MySQL database storage  

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Session Management**: Express-session
- **Security**: CORS, Body Parser

## Project Structure

```
try/
├── public/                 # Frontend files
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js                 # Homepage JS
│   │   ├── admin-login.js          # Admin login JS
│   │   └── admin-dashboard.js      # Dashboard JS
│   ├── index.html                  # Homepage
│   ├── admin-login.html            # Admin login page
│   └── admin-dashboard.html        # Admin dashboard
├── routes/                 # API routes
│   ├── reports.js          # Report API endpoints
│   └── admin.js            # Admin API endpoints
├── config/
│   └── database.js         # Database configuration
├── views/                  # EJS templates (optional)
├── app.js                  # Main server file
├── package.json
├── .env.example            # Environment variables template
├── .gitignore
├── database-setup.sql      # Database schema
└── README.md
```

## Installation & Setup

### 1. Install Node.js & MySQL
- Download Node.js from https://nodejs.org/
- Download XAMPP (includes MySQL) from https://www.apachefriends.org/

### 2. Start XAMPP
- Open XAMPP Control Panel
- Start Apache and MySQL services

### 3. Create Database
- Open phpMyAdmin (http://localhost/phpmyadmin)
- Import `database-setup.sql`:
  - Click Import tab
  - Select `database-setup.sql` file
  - Click Go

### 4. Setup Project

```bash
# Navigate to project directory
cd c:\Users\Admin\Desktop\try

# Install dependencies
npm install

# Copy environment file
copy .env.example .env

# Edit .env with your database credentials
# (Keep defaults if using XAMPP locally)
```

### 5. Run Server

```bash
# Start development server
npm run dev

# Or start normally
npm start
```

Visit: http://localhost:3000

## Usage

### Customer Features
1. Go to http://localhost:3000
2. Fill out the report form with your details
3. Submit the report
4. Track your report status on the homepage

### Admin Features
1. Log in at http://localhost:3000/admin
   - Email: `admin@try.com`
   - Password: `admin123`
2. View all customer reports in dashboard
3. Update report status
4. Add responses to customer reports
5. View statistics and activity

## API Endpoints

### Public Endpoints
- `POST /api/reports/submit` - Submit a new report
- `GET /api/reports/public` - Get recent public reports

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/check-session` - Check admin session
- `GET /api/admin/reports` - Get all reports
- `GET /api/admin/reports/:id` - Get report details
- `PUT /api/admin/reports/:id/status` - Update report status
- `POST /api/admin/reports/:id/response` - Add admin response
- `GET /api/admin/stats` - Get dashboard statistics

## Database Schema

### reports table
- `id` - Report ID (Primary Key)
- `customer_name` - Customer name
- `email` - Customer email
- `phone` - Customer phone
- `title` - Report title
- `description` - Detailed description
- `category` - Report category
- `status` - Current status (pending, reviewing, resolved, closed)
- `admin_response` - Admin's response
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Hosting on GitHub

### 1. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Create GitHub Repository
- Go to https://github.com/new
- Create new repository named "try"
- Don't initialize with README (we have one)

### 3. Push to GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/try.git
git push -u origin main
```

## Free Online Database Options

### Option 1: Railway (Recommended)
1. Go to https://railway.app
2. Sign up and create new project
3. Add MySQL service
4. Get connection credentials
5. Update `.env` with credentials

### Option 2: Render
1. Go to https://render.com
2. Create new PostgreSQL database
3. Get credentials
4. Update connection string

### Option 3: PlanetScale (MySQL)
1. Go to https://planetscale.com
2. Create account and database
3. Get MySQL credentials
4. Update `.env`

### Option 4: Heroku
1. Create Heroku app
2. Add MySQL add-on
3. Get credentials from config vars
4. Update `.env`

## Deploying Backend

### Deploy to Render or Railway:

1. Push to GitHub (if not done)
2. Connect your GitHub account on Render/Railway
3. Select your repository
4. Set environment variables in dashboard
5. Deploy!

## Environment Variables

Create `.env` file:

```env
# Local MySQL (XAMPP)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=try_db
DB_PORT=3306

# Online Database (example)
# DB_HOST=your-db-host.com
# DB_USER=your_user
# DB_PASSWORD=your_password
# DB_NAME=your_db_name

PORT=3000
NODE_ENV=production
ADMIN_EMAIL=admin@try.com
ADMIN_PASSWORD=admin123
```

## Security Recommendations

⚠️ **Important for Production:**

1. Change default admin credentials in `.env`
2. Add password hashing for admin accounts
3. Implement JWT authentication
4. Add rate limiting
5. Use HTTPS/SSL
6. Validate all user inputs
7. Add CSRF protection
8. Implement proper access control
9. Use environment variables for sensitive data
10. Add request logging and monitoring

## Troubleshooting

### Connection Refused Error
- Make sure MySQL is running in XAMPP
- Check database credentials in `.env`
- Verify database exists

### Module Not Found
- Run `npm install` to install dependencies
- Make sure you're in the project directory

### Port Already in Use
- Change `PORT` in `.env`
- Or kill process using port 3000

### Admin Dashboard Not Loading
- Clear browser cache
- Check if session is valid
- Verify admin credentials

## Support & Updates

For issues or improvements:
1. Check documentation
2. Review error logs
3. Create GitHub issue
4. Check environment variables
5. Verify database connection

## License

ISC License - Feel free to use and modify!

## Author

Created for customer report management system

---

**Happy coding!** 🚀
