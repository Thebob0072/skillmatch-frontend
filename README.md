# SkillMatch Frontend

A modern React + TypeScript application for connecting clients with service providers. Built with Vite, React Router, Tailwind CSS, and comprehensive authentication.

## 🚀 Features

- **Authentication**: JWT-based auth + Google OAuth integration
- **Multi-language**: Thai, English, Chinese support via i18next
- **Payment Integration**: Stripe for secure transactions
- **Real-time Communication**: WebSocket notifications
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Type Safety**: Full TypeScript coverage
- **Testing**: Vitest + React Testing Library

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8080` (or configured URL)
- Google OAuth Client ID
- Stripe Publishable Key (for payments)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd skillmatch-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and set:
   - `VITE_API_URL`: Your backend API URL
   - `VITE_GOOGLE_CLIENT_ID`: Google OAuth Client ID
   - `VITE_CLOUD_STORAGE_BASE_URL`: Cloud storage bucket URL
   - `VITE_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   App will be available at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Lint code with ESLint

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API service layer
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── constants/          # App constants and config
├── utils/              # Utility functions
└── test/               # Test files
```

## 🔑 Key Technologies

- **React 19**: Latest React features
- **TypeScript**: Type safety throughout
- **Vite (Rolldown)**: Lightning-fast build tool
- **React Router v6**: Client-side routing
- **Axios**: HTTP client with interceptors
- **Tailwind CSS 4**: Utility-first styling
- **i18next**: Internationalization
- **@react-oauth/google**: Google authentication
- **@stripe/stripe-js**: Payment processing
- **Vitest**: Unit testing framework

## 🌍 Environment Variables

Create a `.env.local` file with the following:

```env
VITE_API_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_CLOUD_STORAGE_BASE_URL=https://storage.googleapis.com/your-bucket
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
```

## �� Testing

Run the test suite:

```bash
npm run test
```

Run tests with UI:

```bash
npm run test:ui
```

## 📱 User Roles

- **Client**: Browse and book services
- **Provider**: Offer services, manage bookings
- **Admin**: System administration and verification

## 🎨 Tier System

Providers can subscribe to different tiers:
- Bronze (Free)
- Silver
- Gold
- Platinum
- **GOD** (Premium tier with special features)

## 🔒 Authentication Flow

1. User registers or logs in (email/password or Google)
2. JWT token stored in localStorage
3. Token included in all API requests via Axios interceptor
4. Automatic redirect to login on 401 errors

## 🌐 Supported Languages

- English (en)
- Thai (th)
- Chinese (zh)

Language persists in localStorage and can be switched via UI.

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for SkillMatch
