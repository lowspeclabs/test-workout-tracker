
import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, WorkoutSession, WorkoutTemplate } from './types';
import Onboarding from './views/Onboarding';
import Home from './views/Home';
import Plan from './views/Plan';
import Stats from './views/Stats';
import Profile from './views/Profile';
import SessionPlayer from './views/SessionPlayer';
import { WORKOUT_TEMPLATES } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'plan' | 'stats' | 'profile' | 'session'>('home');
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('paperfit_profile');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [sessions, setSessions] = useState<WorkoutSession[]>(() => {
    const saved = localStorage.getItem('paperfit_sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeWorkout, setActiveWorkout] = useState<WorkoutTemplate | null>(null);

  useEffect(() => {
    if (profile) {
      localStorage.setItem('paperfit_profile', JSON.stringify(profile));
      if (profile.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('paperfit_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile(newProfile);
    setView('home');
  };

  const startWorkout = (workout: WorkoutTemplate) => {
    setActiveWorkout(workout);
    setView('session');
  };

  const finishWorkout = (session: WorkoutSession) => {
    setSessions(prev => [...prev, session]);
    setActiveWorkout(null);
    setView('stats');
  };

  if (!profile || !profile.onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (view === 'session' && activeWorkout) {
    return <SessionPlayer 
      workout={activeWorkout} 
      onFinish={finishWorkout} 
      onClose={() => setView('home')} 
    />;
  }

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background-light dark:bg-background-dark text-slate-900 dark:text-white border-x border-primary/10 transition-colors">
      <main className="flex-1 overflow-y-auto pb-24">
        {view === 'home' && <Home profile={profile} sessions={sessions} onStartWorkout={startWorkout} />}
        {view === 'plan' && <Plan onStartWorkout={startWorkout} />}
        {view === 'stats' && <Stats sessions={sessions} />}
        {view === 'profile' && <Profile profile={profile} setProfile={setProfile} onClearData={() => setSessions([])} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-primary/5 px-8 pb-8 pt-3 flex justify-between items-center max-w-md mx-auto z-50">
        <NavButton icon="home" label="Daily" active={view === 'home'} onClick={() => setView('home')} />
        <NavButton icon="fitness_center" label="Plan" active={view === 'plan'} onClick={() => setView('plan')} />
        <NavButton icon="insights" label="Insights" active={view === 'stats'} onClick={() => setView('stats')} />
        <NavButton icon="settings" label="Profile" active={view === 'profile'} onClick={() => setView('profile')} />
      </nav>
      
      {/* iOS Home Indicator */}
      <div className="fixed bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-primary/20 dark:bg-white/20 rounded-full pointer-events-none"></div>
    </div>
  );
};

const NavButton: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-primary dark:text-white scale-110' : 'text-neutral-400 opacity-60 hover:opacity-100'}`}
  >
    <span className={`material-symbols-outlined text-2xl ${active ? 'fill-1' : ''}`}>{icon}</span>
    <span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
  </button>
);

export default App;
