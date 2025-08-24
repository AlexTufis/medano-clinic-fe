import {
  AdminDashboardDto,
  UserDto,
  AppointmentResponseDto,
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
