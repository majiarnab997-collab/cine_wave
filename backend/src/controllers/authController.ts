import { Request, Response } from 'express';
import { db } from '../db';
import { User, Profile } from '../models';

export const authController = {
  login: (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    if (user.isSuspended) {
      return res.status(403).json({ success: false, error: 'This account has been suspended by administration.' });
    }

    db.logActivity('user_login', { email: user.email }, user.id);
    return res.json({ success: true, user });
  },

  demoLogin: (req: Request, res: Response) => {
    const { role } = req.body;
    let user: User | undefined;

    if (role === 'admin') {
      user = db.users.find(u => u.role === 'admin');
    } else {
      user = db.users.find(u => u.role === 'user');
    }

    if (!user) {
      return res.status(404).json({ success: false, error: 'Demo user not available' });
    }

    db.logActivity('demo_login', { role }, user.id);
    return res.json({ success: true, user });
  },

  signup: (req: Request, res: Response) => {
    const { name, email, subscriptionPlanId } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Name and email are required' });
    }

    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ success: false, error: 'An account with this email already exists.' });
    }

    const defaultProfile: Profile = {
      id: `prof-${Date.now()}`,
      name: name.split(' ')[0],
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      isKids: false,
      language: 'en',
      maturityLevel: 'R',
      autoplayNext: true,
      autoplayPreviews: true
    };

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role: 'user',
      subscriptionPlanId: subscriptionPlanId || 'plan-standard',
      subscriptionStatus: 'trial',
      billingCycle: 'monthly',
      nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      profiles: [defaultProfile],
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    db.save();
    db.logActivity('user_registered', { email }, newUser.id);

    return res.status(201).json({ success: true, user: newUser });
  },

  getCurrentUser: (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    return res.json({ success: true, user });
  },

  updatePlan: (req: Request, res: Response) => {
    const { userId, planId } = req.body;
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.subscriptionPlanId = planId;
    db.save();
    db.logActivity('plan_updated', { newPlan: planId }, user.id);

    return res.json({ success: true, user });
  }
};
