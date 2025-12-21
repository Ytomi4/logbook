import { apiClient } from './api';
import type {
  UserProfile,
  UpdateProfileRequest,
  UsernameCheckResponse,
} from '../types';

export async function getProfile(): Promise<UserProfile> {
  return apiClient.get<UserProfile>('/profile');
}

export async function updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
  return apiClient.put<UserProfile>('/profile', data);
}

export async function checkUsername(username: string): Promise<UsernameCheckResponse> {
  return apiClient.get<UsernameCheckResponse>('/username/check', { username });
}

interface AvatarUploadResponse {
  avatarUrl: string;
  message: string;
}

export async function uploadAvatar(file: File): Promise<AvatarUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/avatar', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload avatar');
  }

  return response.json();
}
