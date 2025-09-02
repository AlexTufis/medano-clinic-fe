import {
  AdminDashboardDto,
  UserDto,
  AppointmentResponseDto,
  UpdateUserRoleDto,
  UpdateAppointmentStatusDto,
} from "../types/dto";
import apiClient from "./apiClient";

export async function getAdminDashboardStats(): Promise<AdminDashboardDto> {
  const response = await apiClient.get<AdminDashboardDto>("/Admin/dashboard");
  return response.data;
}

export async function getAllUsers(): Promise<UserDto[]> {
  const response = await apiClient.get<UserDto[]>("/Admin/users");
  return response.data;
}

export async function getAllAppointments(): Promise<AppointmentResponseDto[]> {
  try {
    const response = await apiClient.get<AppointmentResponseDto[]>(
      "/Admin/getAppointments"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}

export async function updateUserRole(
  dto: UpdateUserRoleDto
): Promise<{ message: string }> {
  try {
    const response = await apiClient.put<{ message: string }>(
      "/Doctor/update-user-role",
      dto
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}

export async function updateAppointmentStatus(
  appointmentId: string,
  dto: UpdateAppointmentStatusDto
): Promise<AppointmentResponseDto> {
  try {
    const response = await apiClient.put<AppointmentResponseDto>(
      `/Admin/appointments/${appointmentId}/status`,
      dto
    );
    return response.data;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
}
