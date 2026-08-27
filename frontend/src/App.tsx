import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { PlaybackProvider } from './context/PlaybackContext';
import { SettingsProvider } from './context/SettingsContext';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfileSelectionPage } from './pages/ProfileSelectionPage';
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { TVShowsPage } from './pages/TVShowsPage';
import { BrowsePage } from './pages/BrowsePage';
import { SearchPage } from './pages/SearchPage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { ShowDetailsPage } from './pages/ShowDetailsPage';
import { WatchPage } from './pages/WatchPage';
import { MyListPage } from './pages/MyListPage';
import { ContinueWatchingPage } from './pages/ContinueWatchingPage';
import { HistoryPage } from './pages/HistoryPage';
import { AccountPage } from './pages/AccountPage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ErrorState } from './components/common/ErrorState';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Admin Route Wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <WatchlistProvider>
            <PlaybackProvider>
              <SettingsProvider>
                <Routes>
                  {/* Public Landing & Auth Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                  {/* Profile Selection */}
                  <Route
                    path="/profiles"
                    element={
                      <ProtectedRoute>
                        <ProfileSelectionPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Main Streaming Experience */}
                  <Route
                    path="/home"
                    element={
                      <ProtectedRoute>
                        <HomePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/movies"
                    element={
                      <ProtectedRoute>
                        <MoviesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tv-shows"
                    element={
                      <ProtectedRoute>
                        <TVShowsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/browse"
                    element={
                      <ProtectedRoute>
                        <BrowsePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/genres"
                    element={
                      <ProtectedRoute>
                        <BrowsePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/search"
                    element={
                      <ProtectedRoute>
                        <SearchPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Details Routes */}
                  <Route
                    path="/movie/:id"
                    element={
                      <ProtectedRoute>
                        <MovieDetailsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/show/:id"
                    element={
                      <ProtectedRoute>
                        <ShowDetailsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Custom OTT Video Player */}
                  <Route
                    path="/watch/:id"
                    element={
                      <ProtectedRoute>
                        <WatchPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* User Lists & History */}
                  <Route
                    path="/my-list"
                    element={
                      <ProtectedRoute>
                        <MyListPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/continue-watching"
                    element={
                      <ProtectedRoute>
                        <ContinueWatchingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/history"
                    element={
                      <ProtectedRoute>
                        <HistoryPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* User Account & Settings */}
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <AccountPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Portal */}
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboardPage />
                      </AdminRoute>
                    }
                  />

                  {/* 404 Fallback */}
                  <Route
                    path="*"
                    element={
                      <div className="min-h-screen bg-[#08080C] flex items-center justify-center p-6">
                        <ErrorState
                          title="Lost in the CineWave Cosmos (404)"
                          message="The page or video you are looking for has departed to another timeline."
                          showHomeButton={true}
                        />
                      </div>
                    }
                  />
                </Routes>
              </SettingsProvider>
            </PlaybackProvider>
          </WatchlistProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
