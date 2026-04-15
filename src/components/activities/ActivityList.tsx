import { useState, useEffect } from 'react';
import { Activity } from '../../models/Activity';
import activityService from '../../services/activity-service';

const actionBadgeClass: Record<Activity['action'], string> = {
  CREATE: 'bg-success',
  UPDATE: 'bg-warning text-dark',
  DELETE: 'bg-danger',
};

const actionIcon: Record<Activity['action'], string> = {
  CREATE: '➕',
  UPDATE: '✏️',
  DELETE: '🗑️',
};

const entityIcon: Record<Activity['entity'], string> = {
  User: '👤',
  Organization: '🏢',
};

const formatTimestamp = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleString('ca-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const ActivityList = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    setActivities(activityService.getActivities());
  }, []);

  const handleClear = () => {
    activityService.clearActivities();
    setActivities([]);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Historial d'Activitat</h2>
        <button
          id="btn-clear-activities"
          className="btn btn-outline-secondary btn-sm"
          onClick={handleClear}
          disabled={activities.length === 0}
        >
          🗑️ Esborrar historial
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No hi ha activitat registrada encara. Crea, edita o elimina un usuari o una organització per veure-ho aquí.
        </div>
      ) : (
        <ul className="list-group">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold mb-1">
                  <span className="me-2">{entityIcon[activity.entity]}</span>
                  {activity.details}
                </div>
                <small className="text-muted">
                  🕐 {formatTimestamp(activity.timestamp)}
                </small>
              </div>
              <div className="d-flex flex-column align-items-end gap-1">
                <span className={`badge rounded-pill ${actionBadgeClass[activity.action]}`}>
                  {actionIcon[activity.action]} {activity.action}
                </span>
                <span className="badge bg-secondary rounded-pill">
                  {activity.entity}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityList;
