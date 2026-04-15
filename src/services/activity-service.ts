import { Activity, ActivityAction, ActivityEntity } from '../models/Activity';

class ActivityService {
  private readonly STORAGE_KEY = 'easyeat_activities';

  getActivities(): Activity[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data) as Activity[];
    } catch {
      return [];
    }
  }

  logActivity(action: ActivityAction, entity: ActivityEntity, details: string): void {
    const newActivity: Activity = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      action,
      entity,
      details,
      timestamp: new Date().toISOString(),
    };

    const currentActivities = this.getActivities();
    const updatedActivities = [newActivity, ...currentActivities];

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedActivities));
  }

  clearActivities(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

const activityService = new ActivityService();
export default activityService;
