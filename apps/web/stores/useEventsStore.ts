import { create } from 'zustand';
import { EventItem } from '@loopin/types';
import { initialMockEvents } from '../mock';

interface EventsState {
  events: EventItem[];
  setEvents: (events: EventItem[]) => void;
  toggleLike: (id: string) => void;
  toggleJoin: (id: string, currentUserName?: string, currentUserAvatar?: string) => void;
  addComment: (eventId: string, text: string, userName: string, userAvatar?: string) => void;
  addEvent: (event: EventItem) => void;
}

export const useEventsStore = create<EventsState>((set) => ({
  events: initialMockEvents,
  setEvents: (events) => set({ events }),

  toggleLike: (id) =>
    set((state) => ({
      events: state.events.map((e) => {
        if (e.id === id) {
          const nextLiked = !e.isLiked;
          return {
            ...e,
            isLiked: nextLiked,
            likeCount: e.likeCount + (nextLiked ? 1 : -1),
          };
        }
        return e;
      }),
    })),

  toggleJoin: (id, currentUserName = 'Selin Kaya', currentUserAvatar = '/assets/profile_avatar.png') =>
    set((state) => ({
      events: state.events.map((e) => {
        if (e.id === id) {
          const nextJoined = !e.isJoined;
          let newCapacity = e.currentCapacity + (nextJoined ? 1 : -1);
          newCapacity = Math.max(0, Math.min(e.maxCapacity, newCapacity));
          let attendees = [...e.attendees];

          if (nextJoined) {
            attendees.unshift({
              id: `att-${Date.now()}`,
              userId: 'usr-1',
              name: currentUserName,
              username: '@selinkaya',
              avatarUrl: currentUserAvatar,
              joinedAt: new Date().toISOString(),
            });
          } else {
            attendees = attendees.filter((a) => a.name !== currentUserName);
          }

          return {
            ...e,
            isJoined: nextJoined,
            currentCapacity: newCapacity,
            isFull: newCapacity >= e.maxCapacity,
            attendees,
          };
        }
        return e;
      }),
    })),

  addComment: (eventId, text, userName, userAvatar) =>
    set((state) => ({
      events: state.events.map((e) => {
        if (e.id === eventId) {
          const newComment = {
            id: `c-${Date.now()}`,
            eventId,
            userId: 'usr-1',
            userName,
            userAvatar,
            text,
            createdAt: new Date().toISOString(),
          };
          const nextComments = [...e.comments, newComment];
          return {
            ...e,
            comments: nextComments,
            commentCount: nextComments.length,
          };
        }
        return e;
      }),
    })),

  addEvent: (newEvent) =>
    set((state) => ({
      events: [newEvent, ...state.events],
    })),
}));
