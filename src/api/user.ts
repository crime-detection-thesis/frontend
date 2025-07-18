import apiClient from './apiInstance';

export interface User {
  id: number;
  username: string;
}

export function getUsersByCenter(surveillance_center_id: number): Promise<User[]> {
  return apiClient
    .get(`/user/users/?surveillance_center_id=${surveillance_center_id}`)
    .then(r => r.data);
}

export function serializeUserIds(
    userIds: number[],
    initialPrefix = '&'
  ): string {
    if (userIds.length === 0) return '';
    return userIds
      .map((id, idx) => `${idx === 0 ? initialPrefix : '&'}user_id=${id}`)
      .join('');
  }
