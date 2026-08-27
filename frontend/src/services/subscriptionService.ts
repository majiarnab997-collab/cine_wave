import { SubscriptionPlan } from '../types';
import { SUBSCRIPTION_PLANS } from '../data/demoData';
import { authService } from './authService';

export const subscriptionService = {
  getPlans(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS;
  },

  getPlanById(id: string): SubscriptionPlan | undefined {
    return SUBSCRIPTION_PLANS.find(p => p.id === id);
  },

  updateUserPlan(planId: string): boolean {
    const user = authService.getCurrentUser();
    if (!user) return false;
    user.subscriptionPlanId = planId;
    user.subscriptionStatus = 'active';
    authService.updateUser(user);
    return true;
  }
};
