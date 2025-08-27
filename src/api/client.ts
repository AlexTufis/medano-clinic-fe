import {
  DoctorDto,
  CreateAppointmentDto,
  AppointmentResponseDto,
  CreateReviewDto,
  ReviewDto,
  AppointmentHourDto,
} from "../types/dto";
import TokenStorage from "../utils/tokenStorage";
import apiClient from "./apiClient";

export const getDoctors = async (): Promise<DoctorDto[]> => {
  try {
    console.log("Base URL:", apiClient.defaults.baseURL); // Debug log
    console.log("Token exists:", !!TokenStorage.getToken()); // Check if token exists
    console.log(
      "Token value:",
      TokenStorage.getToken()?.substring(0, 20) + "..."
    ); // Show first 20 chars

    const response = await apiClient.get("/Client/doctors");
    console.log("Response received:", response.status);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching doctors:", error);

    // More detailed error logging
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else if (error.request) {
      console.error(
        "No response received. Network error or server not running."
      );
      console.error("Request details:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    throw error;
  }
};

export const createAppointment = async (
  appointmentData: CreateAppointmentDto
): Promise<AppointmentResponseDto> => {
  try {
    const response = await apiClient.post(
      "/Client/appointments",
      appointmentData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const getClientAppointments = async (): Promise<
  AppointmentResponseDto[]
> => {
  try {
    const response = await apiClient.get("/Client/getAppointments");
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

export const createReview = async (
  reviewData: CreateReviewDto
): Promise<ReviewDto> => {
  try {
    const response = await apiClient.post("/Client/reviews", reviewData);
    return response.data;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

export const getReviews = async (): Promise<ReviewDto[]> => {
  try {
    const response = await apiClient.get("/Client/getReviews");
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const getDoctorAppointmentHoursByDay = async (
  doctorId: string,
  dayOfWeek: string
): Promise<AppointmentHourDto[]> => {
  try {
    const response = await apiClient.get(
      `/Client/appointment-hours/doctor/${doctorId}/day/${dayOfWeek}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching appointment hours:", error);
    throw error;
  }
};
