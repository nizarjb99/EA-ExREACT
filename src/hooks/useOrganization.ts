import { useEffect, useState } from 'react';
import organizationService from '../services/organization-service';
import { CanceledError } from '../services/api-client';
import { Organization } from '../models/Organization';
import activityService from '../services/activity-service';

interface UseOrganizationsReturn {
  organizations: Organization[];
  loading: boolean;
  error: string;
  createOrganization: (data: Omit<Organization, '_id'>) => Promise<void>;
  updateOrganization: (organization: Organization) => Promise<void>;
  deleteOrganization: (organizationId: string) => Promise<void>;
  fetchOrganizations: () => void;
}

export const useOrganization = (): UseOrganizationsReturn => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = () => {
    setLoading(true);
    setError('');
    const { request, cancel } = organizationService.getAll<Organization>();
    request
      .then((res) => {
        setOrganizations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError((err as Error).message);
        setLoading(false);
      });
    return () => cancel();
  };

  const createOrganization = async (data: Omit<Organization, '_id'>) => {
    const tempOrg: Organization = {
      _id: 'temp_' + Date.now(),
      ...data,
    };
    const originalOrganizations = [...organizations];
    setOrganizations([tempOrg, ...organizations]);

    try {
      const res = await organizationService.create(data);
      const savedOrg = res.data as Organization;
      setOrganizations((prevOrgs) =>
        prevOrgs.map((o) => (o._id === tempOrg._id ? savedOrg : o))
      );
      activityService.logActivity('CREATE', 'Organization', `Creada organització: ${data.name}`);
    } catch (err) {
      setError((err as Error).message);
      setOrganizations(originalOrganizations);
      throw err;
    }
  };

  const updateOrganization = async (organization: Organization) => {
    const originalOrganizations = [...organizations];
    setOrganizations(
      organizations.map((o) => (o._id === organization._id ? organization : o))
    );

    try {
      await organizationService.update(organization);
      activityService.logActivity('UPDATE', 'Organization', `Editada organització: ${organization.name}`);
    } catch (err) {
      setError((err as Error).message);
      setOrganizations(originalOrganizations);
      throw err;
    }
  };

  const deleteOrganization = async (organizationId: string) => {
    const originalOrganizations = [...organizations];
    setOrganizations(organizations.filter((o) => o._id !== organizationId));

    try {
      await organizationService.delete(organizationId);
      const deletedOrg = originalOrganizations.find((o) => o._id === organizationId);
      activityService.logActivity('DELETE', 'Organization', `Eliminada organització: ${deletedOrg?.name ?? organizationId}`);
    } catch (err) {
      setError((err as Error).message);
      setOrganizations(originalOrganizations);
      throw err;
    }
  };

  return {
    organizations,
    loading,
    error,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    fetchOrganizations,
  };
};

