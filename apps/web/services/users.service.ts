import { apiClient } from './api';
import { User } from '@loopin/types';
import { UpdateProfileInput } from '@loopin/validation';

export interface FollowUserItem {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  trustScore?: string;
  isFollowing: boolean;
  isSelf: boolean;
}

export interface DetailedUserProfile extends User {
  lookingFor?: string;
  languages?: string;
  zodiac?: string;
  education?: string;
  occupation?: string;
  communicationStyle?: string;
  loveLanguage?: string;
  pets?: string;
  drinking?: string;
  smoking?: string;
  workout?: string;
  gallery?: string[];
  interests?: string[];
  isFollowing?: boolean;
  isBlocked?: boolean;
  isSelf?: boolean;
  stats?: {
    reelsCount: number;
    eventsCount: number;
    followersCount: number;
    followingCount: number;
  };
  reels?: Array<{
    id: string;
    imageUrl: string;
    caption: string;
    likeCount: number;
    commentCount: number;
    mediaType: string;
  }>;
  events?: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
    imageUrl: string;
    ageRange?: string;
    isHost: boolean;
  }>;
}

export const usersService = {
  async getProfile(usernameOrId: string): Promise<DetailedUserProfile> {
    const cleanUsername = usernameOrId.replace(/^@/, '');
    return apiClient<DetailedUserProfile>(`/users/${cleanUsername}`, {
      method: 'GET',
    });
  },

  async updateProfile(data: UpdateProfileInput): Promise<DetailedUserProfile> {
    return apiClient<DetailedUserProfile>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async toggleFollow(targetUserId: string): Promise<{ isFollowing: boolean; followerCount: number }> {
    return apiClient<{ isFollowing: boolean; followerCount: number }>(`/users/${targetUserId}/follow`, {
      method: 'POST',
    });
  },

  async getFollowers(targetUserId: string): Promise<FollowUserItem[]> {
    return apiClient<FollowUserItem[]>(`/users/${targetUserId}/followers`, {
      method: 'GET',
    });
  },

  async getFollowing(targetUserId: string): Promise<FollowUserItem[]> {
    return apiClient<FollowUserItem[]>(`/users/${targetUserId}/following`, {
      method: 'GET',
    });
  },

  async blockUser(targetUserId: string): Promise<{ isBlocked: boolean; message: string }> {
    return apiClient<{ isBlocked: boolean; message: string }>(`/users/${targetUserId}/block`, {
      method: 'POST',
    });
  },

  async unblockUser(targetUserId: string): Promise<{ isBlocked: boolean; message: string }> {
    return apiClient<{ isBlocked: boolean; message: string }>(`/users/${targetUserId}/unblock`, {
      method: 'POST',
    });
  },
};
