# Sukoon Dev Portal

A React app for managing IoT hubs and devices with secure authentication. Users can view unlinked hubs/devices, add new ones, delete old ones and generate and copy their linking codes.

## Features

- Device and hub management system
- User authentication with Supabase
- Home screen with two primary actions: Add Hub and Add Device
- Linking code generation for both hubs and devices
- Real-time data storage with Firebase
- Responsive design with dark theme

## Technologies Used

- React
- TypeScript
- Styled Components
- React Router
- Supabase for authentication
- Firebase for real-time database

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account
- Firebase account

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add your Supabase and Firebase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url  
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

3. Start the development server:
   ```bash
   npm run dev  
   ```

4. Open your browser and navigate to `http://localhost:5173` to access the application.

### Supabase Configuration

1. Create a new project in Supabase
2. Navigate to Authentication > Sign In/Up > Email
3. Disable "Confirm Email" to allow direct login without email confirmation
4. Go to Authentication > Users
5. Click "Add User" and create a new user
6. Make sure to check "Auto Confirm" when creating the user

### Firebase Configuration

1. Create a new project in Firebase Console
2. Enable Firestore Database
3. Set up security rules for your database
4. Add a web app to your Firebase project
5. Copy the configuration details to your `.env` file

### Running the Application

1. Start the development server:
   ```bash
   npm run dev  
   ```

2. Open your browser and navigate to `http://localhost:5173` to access the application.

## Project Structure

- `src/components/` - React components
  - `AddDevice.tsx` - Device creation and management
  - `AddHub.tsx` - Hub creation and management
  - `AvailableItems.tsx` - Display available hubs and devices
- `src/context/` - Context providers (Auth)
- `src/lib/` - Configuration files (Firebase & Supabase)
- `src/App.tsx` - Main application component with routing
- `src/index.css` - Global styles

## Usage

1. Log in with your Supabase credentials
2. From the home screen, choose "Add Hub" or "Add Device"
3. For hubs:
   - Fill in the hub details
   - Select hub type
   - Create Hub
4. For devices:
   - Enter device name
   - Select device type from the grid layout
   - Create Device
5. Copy linking codes by clicking on them.