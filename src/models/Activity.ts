export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE';
export type ActivityEntity = 'User' | 'Organization';

export interface Activity {
  id: string;
  action: ActivityAction;
  entity: ActivityEntity;
  details: string;
  timestamp: string;
}
