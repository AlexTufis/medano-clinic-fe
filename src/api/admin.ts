import { AdminDashboardDto, UserDto } from "../types/dto";
import apiClient from "./apiClient";

export async function getAdminDashboardStats(): Promise<AdminDashboardDto> {
  const response = await apiClient.get<AdminDashboardDto>("/Admin/dashboard");
  return response.data;
}

export async function getAllUsers(): Promise<UserDto[]> {
  const response = await apiClient.get<UserDto[]>("/Admin/users");
  return response.data;
}
