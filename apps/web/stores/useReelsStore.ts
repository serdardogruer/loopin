import { create } from 'zustand';
import { ReelItem } from '@loopin/types';
import { initialMockReels } from '../mock';

interface ReelsState {
  reels: ReelItem[];
  setReels: (reels: ReelItem[]) => void;
  toggleLike: (id: string) => void;
  toggleFollow: (publisherId: string) => void;
  addReel: (reel: ReelItem) => void;
}

export const useReelsStore = create<ReelsState>((set) => ({
  reels: initialMockReels,
  setReels: (reels) => set({ reels }),

  toggleLike: (id) =>
    set((state) => ({
      reels: state.reels.map((r) => {
        if (r.id === id) {
          const nextLiked = !r.isLiked;
          return {
            ...r,
            isLiked: nextLiked,
            likeCount: r.likeCount + (nextLiked ? 1 : -1),
          };
        }
        return r;
      }),
    })),

  toggleFollow: (publisherId) =>
    set((state) => ({
      reels: state.reels.map((r) => {
        if (r.publisherId === publisherId) {
          return {
            ...r,
            isFollowingPublisher: !r.isFollowingPublisher,
          };
        }
        return r;
      }),
    })),

  addReel: (newReel) =>
    set((state) => ({
      reels: [newReel, ...state.reels],
    })),
}));
