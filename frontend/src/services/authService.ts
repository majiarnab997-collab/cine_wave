import { User } from '../types';
import { DEMO_USERS } from '../data/demoData';
import { storage } from './storage';

const USERS_KEY = 'auth_users';
const CURRENT_USER_KEY = 'auth_current_user';

function initUsers() {
  if (!storage.get<User[] | null>(USERS_KEY, null)) {
    storage.set(USERS_KEY, DEMO_USERS);
  }
}

initUsers();

export const authService = {
  getUsers(): User[] {
    return storage.get<User[]>(USERS_KEY, DEMO_USERS);
  },

  getCurrentUser(): User | null {
    const user = storage.get<User | null>(CURRENT_USER_KEY, null);
    if (user) return user;
    // Default to the first demo user (Alex) if no session exists yet
    const defaultUser = this.getUsers()[0];
    if (defaultUser) {
      storage.set(CURRENT_USER_KEY, defaultUser);
      return defaultUser;
    }
    return null;
  },

  login(email: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    if (found) {
      if (found.status === 'suspended') {
        return { success: false, error: 'This account has been suspended. Please contact support.' };
      }
      found.lastActive = 'Just now';
      storage.set(CURRENT_USER_KEY, found);
      this.updateUser(found);
      return { success: true, user: found };
    }
    return { success: false, error: 'Invalid email or password. You can use one of our demo logins.' };
  },

  demoLogin(role: 'user' | 'kids' | 'admin'): User {
    const users = this.getUsers();
    let target = users[0];
    if (role === 'admin') {
      target = users.find(u => u.role === 'admin') || users[1] || users[0];
    } else {
      target = users.find(u => u.role === 'user') || users[0];
    }
    storage.set(CURRENT_USER_KEY, target);
    return target;
  },

  signup(name: string, email: string, planId = 'plan-standard'): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: email.trim(),
      name: name.trim(),
      role: 'user',
      subscriptionPlanId: planId,
      subscriptionStatus: 'active',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      createdAt: new Date().toISOString(),
      lastActive: 'Just now',
      profiles: [
        {
          id: `prof-${Date.now()}`,
          userId: `user-${Date.now()}`,
          name: name.split(' ')[0] || 'My Profile',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          isKids: false,
          language: 'en',
          maturityLevel: 'TV-MA',
          autoplayNextEpisode: true,
          autoplayPreviews: true,
          createdAt: new Date().toISOString()
        }
      ]
    };

    users.push(newUser);
    storage.set(USERS_KEY, users);
    storage.set(CURRENT_USER_KEY, newUser);
    return { success: true, user: newUser };
  },

  logout(): void {
    storage.remove(CURRENT_USER_KEY);
    storage.remove('active_profile_id');
  },

  updateUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
      storage.set(USERS_KEY, users);
    }
    const current = this.getCurrentUser();
    if (current && current.id === user.id) {
      storage.set(CURRENT_USER_KEY, user);
    }
  }
};
