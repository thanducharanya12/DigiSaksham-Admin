import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, AdminTab } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { AuthModal, AuthModalTab } from './components/AuthModal';
import { CitizenPortal } from './components/CitizenPortal';
import { DashboardPage } from './pages/DashboardPage';
import { SchemesPage } from './pages/SchemesPage';
import { GuidesPage } from './pages/GuidesPage';
import { JobsPage } from './pages/JobsPage';
import { VolunteersPage } from './pages/VolunteersPage';
import { HelpRequestsPage } from './pages/HelpRequestsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { adminApi, authApi } from './services/api';
import { AdminStats, Scheme, Volunteer, HelpRequest, User, UserRegisterPayload } from './types';
import { AdminLanguage, adminTranslations } from './localization/i18n';

export const App: React.FC = () => {
  // Current logged in user (can be citizen/farmer or admin)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Auth modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('citizen-login');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin tab navigation
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Persistent Language State
  const [lang, setLang] = useState<AdminLanguage>(() => {
    const saved = localStorage.getItem('admin_lang');
    return (saved === 'te' || saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const handleSelectLanguage = (newLang: AdminLanguage) => {
    setLang(newLang);
    localStorage.setItem('admin_lang', newLang);
  };

  const t = adminTranslations[lang];

  // App Data for authenticated admin dashboard
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);

  useEffect(() => {
    // Check initial session
    const token = authApi.getToken();
    const storedUser = authApi.getCurrentUser();
    if (token && storedUser) {
      setCurrentUser(storedUser);
      if (storedUser.role === 'admin') {
        loadDashboardData();
      }
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      const [sData, schData, vData, hrData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getSchemes(),
        adminApi.getVolunteers(),
        adminApi.getHelpRequests()
      ]);
      setStats(sData);
      setSchemes(schData);
      setVolunteers(vData);
      setHelpRequests(hrData);
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    }
  };

  const handleLogin = async (phone: string, pass: string) => {
    setIsSubmitting(true);
    setAuthError('');
    try {
      const { user } = await authApi.login(phone, pass);
      setCurrentUser(user);
      setIsAuthModalOpen(false);

      if (user.role === 'admin') {
        await loadDashboardData();
      }
    } catch (err: any) {
      setAuthError(err.message || t.invalidCredentials);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (payload: UserRegisterPayload) => {
    setIsSubmitting(true);
    setAuthError('');
    try {
      const { user } = await authApi.register(payload);
      setCurrentUser(user);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed. Please check details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    authApi.logout();
    setCurrentUser(null);
  };

  const handleOpenAuth = (tab: AuthModalTab = 'citizen-login') => {
    setAuthModalTab(tab);
    setAuthError('');
    setIsAuthModalOpen(true);
  };

  // 1. PUBLIC LANDING VIEW (UNAUTHENTICATED)
  if (!currentUser) {
    return (
      <>
        <LandingPage
          lang={lang}
          onSelectLanguage={handleSelectLanguage}
          onOpenAuth={handleOpenAuth}
          onOpenLogin={() => handleOpenAuth('admin-login')}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          initialTab={authModalTab}
          onClose={() => {
            setIsAuthModalOpen(false);
            setAuthError('');
          }}
          lang={lang}
          onSelectLanguage={handleSelectLanguage}
          onLoginSuccess={handleLogin}
          onRegisterSuccess={handleRegister}
          authError={authError}
          isSubmitting={isSubmitting}
        />
      </>
    );
  }

  // 2. CITIZEN / RURAL USER PORTAL (WHEN LOGGED IN AS CITIZEN)
  if (currentUser.role !== 'admin') {
    return (
      <CitizenPortal
        user={currentUser}
        lang={lang}
        onSelectLanguage={handleSelectLanguage}
        onLogout={handleLogout}
      />
    );
  }

  // 3. ADMINISTRATOR CONTROL CENTER (WHEN LOGGED IN AS ADMIN)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar 
        onLogout={handleLogout} 
        lang={lang} 
        onSelectLanguage={handleSelectLanguage} 
        t={t} 
      />

      <div className="flex flex-1">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingRequestsCount={stats?.pending_help_requests || 2}
          t={t}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeTab === 'dashboard' && stats && (
            <DashboardPage stats={stats} onNavigateTab={setActiveTab} />
          )}

          {activeTab === 'schemes' && (
            <SchemesPage schemes={schemes} />
          )}

          {activeTab === 'guides' && (
            <GuidesPage />
          )}

          {activeTab === 'jobs' && (
            <JobsPage />
          )}

          {activeTab === 'volunteers' && (
            <VolunteersPage volunteers={volunteers} />
          )}

          {activeTab === 'requests' && (
            <HelpRequestsPage requests={helpRequests} volunteers={volunteers} />
          )}

          {activeTab === 'audit' && (
            <AuditLogsPage />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
