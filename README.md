# Imagify - AI Image Generation Platform

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.2.0-blue)](https://reactjs.org/)

Imagify is a modern web application that allows users to generate images using AI through text prompts. Built with React for the frontend and Node.js/Express for the backend, it features user authentication, credit-based usage, and seamless image generation.

## 📸 Demo

[Live Demo](https://your-deployed-app-url.com) *(Add your deployed app URL here)*

### Screenshots
<!-- Add screenshots of your application here -->
<!-- ![Home Page](screenshots/home.png) -->
<!-- ![Image Generation](screenshots/generate.png) -->

## 🚀 Features

- **AI Image Generation**: Generate images from text prompts using advanced AI models
- **User Authentication**: Secure registration and login system with JWT tokens
- **Credit System**: Manage user credits for image generation
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS
- **Real-time Feedback**: Toast notifications for user actions and errors

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **React Toastify** - User notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Axios** - HTTP client for API calls

## 📁 Project Structure

```
Imagify/
├── Imagify/                 # Frontend React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context for state management
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── package.json
├── server/                 # Backend Node.js application
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middlewares
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   └── package.json
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIPDROP_API=your_clipdrop_api_key
PORT=4000
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run server
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd Imagify
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Imagify directory:
```env
VITE_BACKEND_URL=http://localhost:4000
```

4. Start the development server:
```bash
npm run dev
```

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Ensure MongoDB is accessible
3. Deploy the server code to a Node.js hosting service (Heroku, Railway, etc.)

### Frontend Deployment
1. Build the production version:
```bash
npm run build
```
2. Deploy the `dist` folder to a static hosting service (Vercel, Netlify, etc.)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Email format and password strength validation
- **CORS Protection**: Configured to allow only specific origins
- **Error Handling**: Generic error messages to prevent information leakage
- **HTTPS Enforcement**: Required for production deployment

## 📡 API Endpoints

### User Routes
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/credits` - Get user credit balance

### Image Routes
- `POST /api/image/generate-image` - Generate image from prompt

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd Imagify
npm run test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for details about recent updates and fixes.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- [Clipdrop API](https://clipdrop.co/) for AI image generation
- [React](https://reactjs.org/) community
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support or questions, please open an issue in the GitHub repository.

## 🚨 Issues

If you encounter any bugs or have feature requests, please create an issue on GitHub with detailed information.

## 🔄 Recent Security Updates

- Removed insecure JWT secret fallbacks
- Added comprehensive input validation
- Implemented proper CORS configuration
- Enhanced error handling to prevent information leakage
- Fixed credit balance update logic
- Improved MongoDB connection management
- Added HTTPS enforcement requirements

---

**Note**: Ensure all environment variables are properly configured before deployment. Never commit sensitive information to version control.
