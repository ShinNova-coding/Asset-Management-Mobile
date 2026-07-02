# ITAMS Mobile Application

A modern **IT Asset Management System (ITAMS)** mobile application built with **React Native**, **Expo**, and **TypeScript**. The application allows employees to manage assigned IT assets, submit expense requests, receive notifications, and manage their profiles through a clean and responsive mobile interface.

---

## 📱 Features

### 🏠 Home

* Assigned asset overview with status badges
* Asset details and status
* Pull-to-refresh support
* Skeleton loading animations
* Offline detection

### 💰 Expense Management

* Submit expense requests with receipt upload
* Expense history with status tracking
* Category selection
* Form validation

### 🔔 Notifications
* Real-time push notifications via Firebase Cloud Messaging (FCM)
* Foreground notification capture and local storage
* Cold-start notification handling on app open from notification tap
* Real-time notification list/ unread badge count on Notifications tab
* Mark all as read
* Swipe-to-delete individual notifications
* Different notification types with custom icons
* Notifications grouped by time (Today, Yesterday, This Week, Older)
* Pull-to-refresh

### 👤 Profile

* View and edit profile information
* Profile photo upload
* Change password
* Dark/Light theme support
* Logout functionality

---

## ✨ Additional Features

* Secure user authentication and session management
* Token-based API authentication
* User profile synchronization
* Asset assignment and maintenance history tracking
* Offline support with local SQLite storage
* Network connectivity detection and graceful offline handling
* Skeleton loading screens for improved user experience
* Pull-to-refresh across supported screens
* Responsive and modern mobile UI
* Dark and Light theme support
* Consistent error and empty-state handling
* RESTful API integration
* Image selection and upload support

---

## 🛠 Tech Stack

* React Native
* Expo
* TypeScript
* Expo Router
* Axios
* React Context API
* SQLite
* AsyncStorage
* Expo Image Picker
* Expo Notifications
* Day.js
* React Native Safe Area Context
* Firebase Cloud Messaging (FCM)
* Expo Vector Icons
* React Native Gesture Handler

---

## 📂 Project Structure

src/
├── app/
│   ├── (auth)
│   ├── (main)
│   └── _layout.tsx
├── api/
├── components/
├── context/
├── assets/
├── database/
├── services/
├── types/
├── utils/
└── constants/

---

## 🔄 Application Flow

Login
   │
   ▼
Home
 ├── Asset Details
 ├── History
 ├── Expense
 ├── Notifications
 └── Profile
        ├── Edit Profile
        ├── Change Password
        └── Logout


---

## 📡 API Features

* User Authentication
* Profile Management
* Asset Management
* Expense Requests
* Notification Management
* History Retrieval
* Image Upload

---

## 🎨 UI Highlights

* Modern Mobile UI
* Dark Mode
* Skeleton Loaders
* Empty States
* Offline Screen
* Smooth Navigation
* Consistent Color Theme

---

## 📌 Future Improvements

* Push notification deep linking to related screens
* Custom notification sounds and vibration settings
* QR Code Asset Scanning
* Biometric Authentication
* Multi-language Support
* Analytics Dashboard

---

## 👨‍💻 Author

**Nang Kham Moe Oo**
Final-Year Computer Science Student

---

## 📄 License

This project is intended for educational and internship purposes.
