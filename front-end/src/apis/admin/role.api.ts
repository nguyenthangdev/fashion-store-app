import type { PermissionsInterface, RolesDetailInterface, RolesInfoInterface, RolesResponseInterface } from '~/types/role.type'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchRoleAPI = async (): Promise<RolesResponseInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/roles`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailRoleAPI = async (id: string): Promise<RolesDetailInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/roles/detail/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchCreateRoleAPI = async (data: RolesInfoInterface) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/admin/roles/create`,
    data,
    { withCredentials: true }
  )
  return response.data
}

export const fetchEditRoleAPI = async (id: string, payload: RolesInfoInterface) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/roles/edit/${id}`,
    payload,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDeleteRoleAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/roles/delete/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchPermissions = async (permissions: PermissionsInterface[]) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/roles/permissions`,
    { permissions },
    { withCredentials: true }
  )
  return response.data
}