'use client';

import React, { useEffect } from 'react';
import { useUIStore } from '../stores/useUIStore';
import { useEventsStore } from '../stores/useEventsStore';
import { useReelsStore } from '../stores/useReelsStore';
import { useAuthStore } from '../stores/useAuthStore';
import { eventsService } from '../services/events.service';
import { reelsService } from '../services/reels.service';

import { AppHeader } from '../components/navigation/AppHeader';
import { BottomNavbar } from '../components/navigation/BottomNavbar';
import { EventCard } from '../components/events/EventCard';
import { ReelCard } from '../components/reels/ReelCard';
import { ChatList } from '../components/messages/ChatList';
import { ActiveChatPanel } from '../components/messages/ActiveChatPanel';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { ProfileMediaGrid } from '../components/profile/ProfileMediaGrid';
import { ProfileEventsList } from '../components/profile/ProfileEventsList';

import { CreateModal } from '../components/modals/CreateModal';
import { EditProfileModal } from '../components/modals/EditProfileModal';
import { EventDetailModal } from '../components/events/EventDetailModal';
import { CommentsDrawer } from '../components/modals/CommentsDrawer';
import { AuthModal } from '../components/modals/AuthModal';
import { SettingsModal } from '../components/modals/SettingsModal';
import { NotificationsDrawer } from '../components/modals/NotificationsDrawer';

export default function AppHomePage() {
  const { currentTab, currentProfileSubTab, setCurrentProfileSubTab } = useUIStore();
  const { events, setEvents } = useEventsStore();
  const { reels, setReels } = useReelsStore();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();

    // Fetch live feed from PostgreSQL backend
    eventsService.getFeed()
      .then((data) => {
        if (data && data.length > 0) {
          setEvents(data);
        }
      })
      .catch((err) => {
        console.warn('Live events feed fallback:', err);
      });

    reelsService.getFeed()
      .then((data) => {
        if (data && data.length > 0) {
          setReels(data);
        }
      })
      .catch((err) => {
        console.warn('Live reels feed fallback:', err);
      });
  }, []);

  return (
    <div className="device-mockup">
      {/* Top Header */}
      <AppHeader />

      {/* Main Screen Content */}
      <main className="app-content">
        {/* TAB 1: ANASAYFA (ETKİNLİKLER) */}
        {currentTab === 'home' && (
          <section className="h-full feed-container events-snap-feed">
            {events.map((event, index) => (
              <EventCard key={event.id} event={event} isFirstCard={index === 0} />
            ))}
          </section>
        )}

        {/* TAB 2: REELS (FOTOĞRAF VE VİDEO) */}
        {currentTab === 'reels' && (
          <section className="h-full feed-container reels-snap-feed">
            {reels.map((reel, index) => (
              <ReelCard key={reel.id} reel={reel} isFirstCard={index === 0} />
            ))}
          </section>
        )}

        {/* TAB 3: MESAJLAR */}
        {currentTab === 'messages' && (
          <section className="h-full relative">
            <ChatList />
            <ActiveChatPanel />
          </section>
        )}

        {/* TAB 4: PROFİL */}
        {currentTab === 'profile' && (
          <section className="h-full flex flex-col overflow-y-auto bg-[#0A0A0A]">
            <ProfileHeader />

            {/* Profile Navigation SubTabs */}
            <div className="flex border-b border-white/10 bg-[#141414]">
              <button
                onClick={() => setCurrentProfileSubTab('reels')}
                className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                  currentProfileSubTab === 'reels'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <span>📷</span> Paylaşımlar
              </button>
              <button
                onClick={() => setCurrentProfileSubTab('events')}
                className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${
                  currentProfileSubTab === 'events'
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <span>🎉</span> Etkinliklerim
              </button>
            </div>

            {/* Profile SubTab Content */}
            <div className="flex-1">
              {currentProfileSubTab === 'reels' ? <ProfileMediaGrid /> : <ProfileEventsList />}
            </div>
          </section>
        )}
      </main>

      {/* Bottom Navbar */}
      <BottomNavbar />

      {/* Interactive Global Modals */}
      <CreateModal />
      <EditProfileModal />
      <EventDetailModal />
      <CommentsDrawer />
      <AuthModal />
      <SettingsModal />
      <NotificationsDrawer />
    </div>
  );
}
