# 🛣️ RoadWatch

**Smart Road Issue Reporting & Management Platform**

RoadWatch is a comprehensive full-stack application that enables users to report and track road infrastructure issues in real-time. Combining mobile-first Android development, modern web technologies, and AI-powered analysis, RoadWatch helps communities maintain safer, better-maintained roads.

![Repository](https://img.shields.io/badge/Language-Kotlin%20%7C%20JavaScript%20%7C%20Backend-blue)
![License](https://img.shields.io/badge/License-Open%20Source-green)
![Status](https://img.shields.io/badge/Status-Active%20Development-yellow)

---

## 📱 Project Overview

RoadWatch consists of three main components:

1. **Android Mobile App** - Native Android application for reporting road issues
2. **Frontend Web Portal** - React + Vite web interface for viewing and managing reports
3. **Backend API** - Server infrastructure for data storage and processing

### Key Features

- 📍 **Real-Time GPS Tracking** - Capture exact location of road issues
- 📸 **Image Capture & Upload** - Document issues with photos from the camera
- 🤖 **AI Analysis** - Google Gemini API integration for automatic issue categorization
- 🗺️ **Interactive Maps** - Visualize reported issues on Google Maps
- 💾 **Offline Support** - Local database storage with Room for offline functionality
- 📊 **Issue Tracking** - Complete lifecycle management of reported road issues
- 🔐 **User Authentication** - Secure login and user management
- 📱 **Responsive Design** - Works seamlessly across devices
- 🌐 **Real-Time Sync** - Automatic synchronization between mobile and backend

---

## 📂 Project Structure

```
RoadWatch/
├── app/                              # Android Native Application (Kotlin)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/roadwatch/app/
│   │   │   │   ├── MainActivity.kt              # App entry point
│   │   │   │   ├── camera/
│   │   │   │   │   └── CameraLauncher.kt        # Camera capture
│   │   │   │   ├── data/
│   │   │   │   │   └── local/
│   │   │   │   │       ├── RoadIssueEntity.kt   # Room entity
│   │   │   │   │       ├── RoadIssueDao.kt      # Database operations
│   │   │   │   │       └── RoadWatchDatabase.kt # Room database
│   │   │   │   ├── location/
│   │   │   │   │   └── LocationManager.kt       # GPS services
│   │   │   │   ├── navigation/
│   │   │   │   │   └── NavGraph.kt              # Navigation routes
│   │   │   │   └── ui/
│   │   │   │       ├── auth/
│   │   │   │       │   └── AuthScreen.kt
│   │   │   │       ├── map/
│   │   │   │       │   └── MapScreen.kt
│   │   │   │       ├── report/
│   │   │   │       │   └── ReportScreen.kt
│   │   │   │       ├── tickets/
│   │   │   │       │   └── TicketsScreen.kt
│   │   │   │       └── theme/
│   │   │   │           ├── Theme.kt
│   │   │   │           ├── Type.kt
│   │   │   │           └── Color.kt
│   │   │   ├── AndroidManifest.xml
│   │   │   └── res/                 # Resources
│   │   ├── test/                    # Unit tests
│   │   └── androidTest/             # Instrumented tests
│   ├── build.gradle.kts
│   └── proguard-rules.pro
│
├── frontend/                         # React Web Application
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── backend/                          # Backend API Server
│   └── [To be implemented]
│
├── build.gradle.kts                  # Root Gradle configuration
├── settings.gradle.kts               # Gradle settings
├── gradle.properties                 # Gradle properties
├── gradle/                           # Gradle wrapper
├── .gitignore
└── README.md                         # This file
```

---

## 🛠️ Tech Stack

### **Android App**
- **Language:** Kotlin 100%
- **Framework:** Jetpack Compose (Modern Declarative UI)
- **Minimum API:** 24 (Android 7.0)
- **Target API:** 35 (Android 15)
- **Build System:** Gradle with Kotlin DSL

**Key Libraries:**
- `androidx.navigation.compose` - Navigation routing
- `androidx.room` - Local database persistence
- `com.google.android.gms:play-services-maps` - Google Maps integration
- `com.google.android.gms:play-services-location` - GPS and location services
- `io.coil:coil-compose` - Image loading and caching
- `io.ktor:ktor-client-android` - HTTP networking
- `com.google.ai.client.generativeai` - Google Gemini API for AI analysis
- `com.squareup.moshi` - JSON serialization
- `org.jetbrains.kotlinx:kotlinx-coroutines` - Async programming
- `androidx.compose.material3` - Material 3 Design components

### **Frontend Web**
- **Framework:** React 18+ with Vite
- **Bundler:** Vite (Fast build tool)
- **Build Tools:** Node.js, npm/yarn

### **Backend** (To be implemented)
- Node.js / Express.js or similar
- Database: PostgreSQL / MongoDB
- API Documentation: OpenAPI/Swagger

---

## 🚀 Getting Started

### Prerequisites

#### Android Development
- Android Studio (Latest stable version)
- Android SDK (API 24+)
- JDK 11 or higher
- Emulator or physical Android device

#### Frontend Development
- Node.js 16+ and npm/yarn
- Code editor (VS Code recommended)

#### General Requirements
- Git installed
- Google Gemini API key (for AI features)
- Google Maps API key

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Saro-07/RoadWatch.git
cd RoadWatch
```

#### 2. Android App Setup

Navigate to the Android project:
```bash
cd app
```

**Configure API Keys:**
Create `local.properties` file in the project root:
```properties
sdk.dir=/path/to/android/sdk
GEMINI_API_KEY=your_gemini_api_key_here
MAPS_API_KEY=your_google_maps_api_key_here
```

**Build the App:**
```bash
./gradlew build
```

**Run on Emulator:**
```bash
./gradlew installDebug
```

Or use Android Studio to run the app directly.

#### 3. Frontend Setup

Navigate to the frontend project:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

#### 4. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Follow the backend-specific setup instructions (to be documented).

---

## 📋 Features Overview

### Android App Features

#### 🔐 Authentication
- User registration and login
- Secure password management
- Session handling

#### 📍 Location & Mapping
- Real-time GPS location capture
- Interactive Google Maps integration
- Location-based issue filtering
- Distance calculations

#### 📸 Issue Reporting
- Camera integration using CameraX
- Photo capture and upload
- Issue description and categorization
- Severity level assignment (Low/Medium/High)
- Timestamp tracking

#### 🤖 AI Analysis
- Google Gemini API integration
- Automatic issue categorization
- Severity assessment
- Image analysis for road condition detection

#### 💾 Data Management
- Room database for local storage
- Offline-first architecture
- Automatic sync when connection restored
- Data encryption for sensitive information

#### 🎨 User Interface
- Material 3 design system
- Responsive layouts
- Dark mode support
- Smooth animations and transitions

### Web Portal Features (Frontend)

- Dashboard with issue statistics
- Interactive map visualization
- Issue list with filtering and sorting
- Report generation
- User management interface

---

## 🔄 Data Flow

```
Mobile App (Capture)
    ↓
Local Database (Room)
    ↓
Upload to Backend ↔ AI Analysis (Gemini)
    ↓
Backend Database
    ↓
Web Portal (Dashboard)
    ↓
Map Visualization & Reports
```

---

## 🧪 Testing

### Android App Tests

**Run Unit Tests:**
```bash
./gradlew test
```

**Run Instrumented Tests:**
```bash
./gradlew connectedAndroidTest
```

**Run Specific Test Class:**
```bash
./gradlew test --tests com.roadwatch.app.data.local.*
```

### Frontend Tests

```bash
npm run test
```

---

## 📦 Building for Release

### Android App

**Build Release APK:**
```bash
./gradlew assembleRelease
```

**Build Release AAB (For Play Store):**
```bash
./gradlew bundleRelease
```

APK/AAB files will be generated in:
```
app/build/outputs/apk/release/
app/build/outputs/bundle/release/
```

**Signing the App:**
Create a keystore file:
```bash
keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias release
```

### Frontend

**Build for Production:**
```bash
npm run build
```

Output: `dist/` directory ready for deployment

---

## 🔒 Security Considerations

- ✅ API keys stored in local.properties (never committed)
- ✅ HTTPS for all API communications
- ✅ Data encryption at rest (Room database)
- ✅ ProGuard obfuscation for release builds
- ✅ Permission handling with Android best practices
- ✅ Secure authentication tokens

---

## 📱 Permissions Required

### Android App Permissions
- `android.permission.CAMERA` - Photo capture
- `android.permission.ACCESS_FINE_LOCATION` - GPS coordinates
- `android.permission.ACCESS_COARSE_LOCATION` - Approximate location
- `android.permission.INTERNET` - API communications
- `android.permission.READ_EXTERNAL_STORAGE` - Image access (if needed)
- `android.permission.WRITE_EXTERNAL_STORAGE` - Image storage (if needed)

---

## 🌐 API Endpoints (Backend)

*To be documented*

### Planned Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/issues` - Create new issue report
- `GET /api/issues` - Fetch all issues
- `GET /api/issues/{id}` - Get specific issue
- `PUT /api/issues/{id}` - Update issue status
- `GET /api/issues/map` - Get issues for map view

---

## 📊 Project Statistics

- **Programming Languages:** Kotlin (Mobile), JavaScript (Web)
- **Total Components:** 15+ Kotlin files, Database setup, Navigation system
- **Architecture:** MVVM with Jetpack Compose + REST API
- **Database:** SQLite (Local) + Backend database

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/RoadWatch.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**
   - Describe your changes clearly
   - Reference any related issues
   - Ensure all tests pass

### Contribution Guidelines
- Follow Kotlin coding standards
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- No hard-coded values (use configuration)

---

## 🐛 Bug Reports & Issues

Found a bug? Please create an issue on GitHub with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Device/OS information
- Relevant logs or screenshots

---

## 📝 Development Roadmap

### Phase 1 (Current)
- ✅ Android app structure and UI
- ✅ Camera and location integration
- ✅ Local database setup
- ⏳ Authentication system

### Phase 2
- Backend API development
- Integration with Gemini API
- Advanced map features
- Offline sync mechanism

### Phase 3
- Web dashboard
- Analytics and reporting
- Admin panel
- Push notifications

### Phase 4
- Machine learning for issue predictions
- Community features and rating system
- Multi-language support
- Performance optimization

---

## 📚 Documentation

- **Android Architecture:** [Learn about Jetpack Compose](https://developer.android.com/jetpack/compose)
- **Room Database:** [Android Room Documentation](https://developer.android.com/training/data-storage/room)
- **Google Maps Integration:** [Maps SDK for Android](https://developers.google.com/maps/documentation/android-sdk)
- **Google Gemini API:** [Generative AI Documentation](https://ai.google.dev/)

---

## 🔗 Useful Links

- [Android Studio Download](https://developer.android.com/studio)
- [Kotlin Documentation](https://kotlinlang.org/docs/)
- [Jetpack Compose Guide](https://developer.android.com/jetpack/compose/documentation)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

## 📄 License

This project is open source and available under the MIT License. Feel free to use, modify, and distribute as needed.

---

## 👨‍💻 Author

**Saravanan J** (Saro-07)

- GitHub: [@Saro-07](https://github.com/Saro-07)
- Email: saravanan12220@gmail.com

---

## 🙏 Acknowledgments

- Google for Jetpack, Firebase, Maps API, and Gemini AI
- JetBrains for Kotlin and IntelliJ IDEA
- The Android development community
- All contributors and testers

---

## 💡 Support & Questions

For questions or support:
1. Check existing [Issues](https://github.com/Saro-07/RoadWatch/issues)
2. Review the [Discussions](https://github.com/Saro-07/RoadWatch/discussions)
3. Create a new issue with detailed information

---

## 🚀 Quick Command Reference

```bash
# Android
./gradlew build              # Build app
./gradlew test              # Run tests
./gradlew installDebug      # Install on device

# Frontend
npm install                 # Install dependencies
npm run dev                 # Start dev server
npm run build               # Build for production
npm run test                # Run tests

# Git
git clone <repo>            # Clone repository
git checkout -b feature/x   # Create feature branch
git commit -m "message"     # Commit changes
git push origin feature/x   # Push changes
```

---

**Made with ❤️ for safer, better-maintained roads**

Last Updated: August 2026 | Version: 1.0.0
