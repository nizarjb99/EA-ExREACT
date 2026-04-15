import { useEffect, useState } from 'react';
import userService from '../services/user-service';
import organizationService from '../services/organization-service';
import { CanceledError } from '../services/api-client';
import { User } from '../models/User';
import { Organization } from '../models/Organization';
import activityService from '../services/activity-service';

interface UseUsersReturn {
  users: User[];
  organizations: Organization[];
  loading: boolean;
  error: string;
  createUser: (data: Omit<User, '_id'>) => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  fetchUsers: () => void;
}

export const useUser = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchOrganizations();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    setError('');
    const { request, cancel } = userService.getAll<User>();
    request
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError((err as Error).message);
        setLoading(false);
      });
    return () => cancel();
  };

  const fetchOrganizations = () => {
    const { request, cancel } = organizationService.getAll<Organization>();
    request
      .then((res) => {
        setOrganizations(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError((err as Error).message);
      });
    return () => cancel();
  };

  const createUser = async (data: Omit<User, '_id'>) => {
    const tempUser: User = {
      _id: 'temp_' + Date.now(),
      ...data,
    };
    const originalUsers = [...users];
    setUsers([tempUser, ...users]);

    try {
      const res = await userService.create(data);
      const savedUser = res.data as User;
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === tempUser._id ? savedUser : u))
      );
      activityService.logActivity('CREATE', 'User', `Creat usuari: ${data.name}`);
    } catch (err) {
      setError((err as Error).message);
      setUsers(originalUsers);
      throw err;
    }
  };

  const updateUser = async (user: User) => {
    const originalUsers = [...users];
    setUsers(users.map((u) => (u._id === user._id ? user : u)));

    try {
      await userService.update(user);
      activityService.logActivity('UPDATE', 'User', `Editat usuari: ${user.name}`);
    } catch (err) {
      setError((err as Error).message);
      setUsers(originalUsers);
      throw err;
    }
  };

  const deleteUser = async (userId: string) => {
    const originalUsers = [...users];
    setUsers(users.filter((u) => u._id !== userId));

    try {
      await userService.delete(userId);
      const deletedUser = originalUsers.find((u) => u._id === userId);
      activityService.logActivity('DELETE', 'User', `Eliminat usuari: ${deletedUser?.name ?? userId}`);
    } catch (err) {
      setError((err as Error).message);
      setUsers(originalUsers);
      throw err;
    }
  };

  return {
    users,
    organizations,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    fetchUsers,
  };
};

