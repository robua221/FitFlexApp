# 🏋️‍♂️ FitFlex Gym App

**Course ID:** T440  
**Developer:** Robin Alexander  
**Roll Number:** 101471125  
**Group:** 8  
**Figma:** https://www.figma.com/design/f7FBbh9j9uHZxQg6J6ePeB/FitFlex-App?node-id=0-1&t=PkIMCrt9eRZIH295-1 
**Jira:** [Kanban Board](https://robin-alexander.atlassian.net/jira/software/projects/KAN/boards/1?atlOrigin=eyJpIjoiOGQzYzI0ODNmYjM4NDc5Mzk3ZDQ1MjY5Nzc0OTAyYTQiLCJwIjoiaiJ9)

FitFlex is a mobile fitness app built with **React Native**, **Firebase**, and **Expo**, designed to help users explore exercises, save favorites, locate nearby gyms, track their fitness routine, and get AI-powered nutrition insights.

---

## 📱 Features

### Core Features
- **Explore Exercises:** Browse a wide variety of exercises with descriptions, difficulty, target muscles, equipment, and animated GIF previews fetched from ExerciseDB API.
- **Favorites:** Save and manage your favorite exercises for quick access.
- **Search & Smart Filter:** Search exercises by name or body part (case-insensitive) and filter by difficulty or equipment type.
- **Nearby Gyms:** Locate gyms near your current location with interactive Google Maps integration.
- **User Authentication:** Secure login and logout using Firebase Authentication.
- **Exercise Videos:** Search YouTube exercise videos by body part directly from the app.
- **AI Calorie Tracker:** Get estimated calorie counts and macronutrient breakdown for meals or workouts using AI assistance.

### Advanced Features
- **Push Notifications:** Reminders for workouts or new exercises using Firebase Cloud Messaging.
- **Deep Linking:** Navigate directly to specific app screens through external links.
- **Logging & Crash Reporting:** Track errors with Firebase Crashlytics and console logs.
- **Speech Input:** Voice-enabled search for exercises for hands-free operation.
- **CI/CD Pipeline:** Automated builds and deployments using GitHub Actions and App Center.
- **Material UI Components:** Smooth, modern interface with React Native Paper for consistent UI.
- **Unit & UI Testing:** Verified components with Jest and React Native Testing Library.

---

## 🛠️ Tech Stack

- **Frontend:** React Native, Expo, React Navigation (Stack), React Native Maps
- **Backend & Database:** Firebase Authentication & Firestore
- **APIs:** ExerciseDB API, Google Places API, YouTube search for exercise videos
- **Dev Tools:** VS Code, GitHub, Jira, Figma
- **Testing:** Jest, React Native Testing Library
- **CI/CD:** GitHub Actions, Microsoft App Center / TestFlight

---

## 🔍 Screens

1. **Home Screen:** Navigate to Explore Exercises, Favorites, Nearby Gyms, or AI Calorie Tracker.
2. **Explore Screen:** Browse, search, filter, and add exercises to favorites.
3. **Favorites Screen:** View saved exercises and remove or clear them.
4. **Nearby Gyms Screen:** Find gyms near your location on a map and get directions.
5. **AI Calorie Tracker Screen:** Input meal or workout details and receive AI-generated calorie and macronutrient information.
6. **Exercise Videos Screen:** Search for body-part-specific exercise videos and watch them in-app through embedded YouTube WebView.

---

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/robua221/FitFlexApp.git
cd FitFlexApp
