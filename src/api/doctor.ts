import {
  ReviewDto,
  AppointmentResponseDto,
  CreateMedicalReportDto,
  MedicalReportDto,
} from "../types/dto";
import apiClient from "./apiClient";

export async function getDoctorReviews(): Promise<ReviewDto[]> {
  try {
    const response = await apiClient.get<ReviewDto[]>(`/Doctor/my-reviews`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor reviews:", error);
    throw error;
  }
}

export async function getDoctorAppointments(): Promise<
  AppointmentResponseDto[]
> {
  try {
    const response = await apiClient.get<AppointmentResponseDto[]>(
      `/Doctor/my-appointments`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    throw error;
  }
}

export async function createMedicalReport(
  dto: CreateMedicalReportDto
): Promise<MedicalReportDto> {
  try {
    const response = await apiClient.post<MedicalReportDto>(
      "/Doctor/medical-reports",
      dto
    );
    return response.data;
  } catch (error) {
    console.error("Error creating medical report:", error);
    throw error;
  }
}
