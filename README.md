# Seconds - Event Countdown Timer

A modern, full-stack event countdown application built with Next.js that allows users to create beautiful, customizable countdown timers for any event.

## ✨ Features

- **Custom Countdown Timers**: Create personalized countdown timers with custom themes and colors
- **Event Management**: Organize events by categories (Technology, Health, Education, Finance)
- **RSVP System**: Collect and manage RSVPs with email tracking
- **Real-time Updates**: Live countdown timers that update every second
- **User Authentication**: Secure login with Google OAuth via NextAuth.js
- **Image Upload**: Custom event cover images with UploadThing integration
- **Unique URLs**: SEO-friendly slugs for easy event sharing
- **Responsive Design**: Beautiful UI that works on all devices
- **Google Calendar Integration**: Seamless calendar synchronization

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes, Server Actions
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with Google OAuth
- **File Upload**: UploadThing
- **Deployment**: Vercel

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database (local or MongoDB Atlas)
- Google OAuth credentials

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/seconds.git
cd seconds
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_random_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── actions/          # Server actions for data operations
├── app/             # Next.js app router pages
├── components/      # Reusable React components
├── lib/            # Utility functions and configurations
└── models/         # MongoDB schemas
```

## 🎯 Key Components

- **Event Creation**: Multi-step form with live preview
- **Countdown Timer**: Real-time countdown display
- **RSVP Management**: Email collection and tracking
- **User Dashboard**: Personal event management
- **Theme Customization**: Color and styling options

## 🔧 Configuration

### MongoDB Setup

1. Create a MongoDB database (local or Atlas)
2. Add your connection string to `MONGODB_URI` in `.env.local`

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### UploadThing Setup

1. Sign up at [UploadThing](https://uploadthing.com/)
2. Create a new app
3. Get your secret and app ID
4. Add to environment variables

## 🚀 Deployment

### Deploy on Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:

- `MONGODB_URI`
- `NEXTAUTH_URL` (your production URL)
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`

## 📝 Usage

1. **Sign In**: Use Google OAuth to authenticate
2. **Create Event**: Fill out the event form with details
3. **Customize**: Choose colors, themes, and upload images
4. **Share**: Use the generated URL to share your countdown
5. **Manage RSVPs**: Track who's planning to attend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
