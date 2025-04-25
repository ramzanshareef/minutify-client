# Minutify - AI-Powered Meeting Summarization Chrome Extension

<p align="center">
  <img src="./assets/icon.png" alt="Minutify Logo" width="200">
  <h3 align="center">Transform Your Meetings into Actionable Insights</h3>
</p>

## 🚀 Features

- **Secure Authentication** - Powered by Clerk for seamless login/signup
- **AI-Powered Summarization** - Custom NLP model processes meeting audio
- **Smart Action Items** - Automatic extraction of key tasks and decisions
- **Meeting Dashboard** - Historical overview of all past meetings
- **File Management** - Supports audio uploads up to 25MB
- **Chrome Native** - Fully integrated browser experience

## 📦 Installation

### Prerequisites
- Node.js v16+
- Chrome browser
- Clerk account (for authentication)
- Access to backend API (contact maintainers for access)

### Local Setup

1. **Clone Repository**
```bash
git clone https://github.com/ramzanshareef/minutify-client.git
cd minutify-client

2. **Install Dependencies**
```bash
pnpm install
```

3. **Environment Variables**
Create .env file with:
```bash
PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-pub-key"
PLASMO_PUBLIC_CLERK_FRONTEND_API="your-clerk-frontend-api"
PLASMO_PUBLIC_BACKEND_URL="http://localhost:8000" # or your backend URL
```

4. **Run Development Server**
```bash
pnpm dev
```

5. **Load Extension in Chrome**
- Navigate to chrome://extensions/
- Enable "Developer mode"
- Click "Load unpacked" and select the build/chrome-mv3-dev directory

## 🎯 Usage

1. **Login**  
   Click extension icon → Sign in with your email account 

2. **New Meeting**
   - Navigate to "New Meeting"
   - Upload audio file (MP3/WAV, ≤25MB)
   - AI processing begins automatically

3. **View Summary**
   - Automatic redirect after processing
   - View key points, action items, and discussion highlights

4. **Dashboard Access**
   - See all historical meetings
   - Filter by date or search keywords
   - Click any entry for full details

## 🛠️ Technical Stack

**Frontend**  
- Plasmo Framework (Chrome Extension)
- React + TypeScript
- Clerk Authentication
- Web Audio API

**Backend**  
- Custom NLP Pipeline (Python/TensorFlow)
- REST API (Node.js/Express)
- MongoDB for data storage

## 📄 Supported Formats

- MP3 (Preferred) 🏆
- WAV
- OGG
- AAC

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the project.
2. Create your feature branch:  
     ```bash
     git checkout -b feature/AmazingFeature
     ```
3. **Commit Your Changes**:  
     ```bash
     git commit -m "Add your commit message here"
     ```
4. Push to the branch:  
     ```bash
     git push origin feature/AmazingFeature
     ```
5. Open a Pull Request.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact
Project Maintainer: Mohd Ramzan Shareef
- [LinkedIn](https://www.linkedin.com/in/ramzanshareef)
- [Email](mailto:mail.ramzanshareef@gmail.com)
- [GitHub](https://github.com/ramzanshareef)