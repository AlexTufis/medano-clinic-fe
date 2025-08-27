import { LoginRequestDto, LoginResponseDto, RegisterDto } from "../types/dto";
import TokenStorage from "../utils/tokenStorage";
import apiClient from "./apiClient";

export async function login(dto: LoginRequestDto): Promise<LoginResponseDto> {
  const response = await apiClient.post<LoginResponseDto>("/Auth/login", dto);

  // Store the token if it exists in the response
  if (response.data.token) {
    TokenStorage.setToken(
      response.data.token,
      response.data.email,
      response.data.role
    );
  }

  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/Auth/logout");
  // Clear the stored token
  TokenStorage.clearToken();
}

export async function register(dto: RegisterDto): Promise<{ message: string }> {
  // Clean up the dto - remove empty optional fields
  const cleanedDto = {
    userName: dto.userName,
    email: dto.email,
    password: dto.password,
    firstName: dto.firstName,
    lastName: dto.lastName,
    displayName: dto.displayName,
    ...(dto.dateOfBirth && { dateOfBirth: dto.dateOfBirth }),
    ...(dto.gender !== undefined && { gender: dto.gender }),
  };

  const res = await apiClient.post<{ message: string }>(
    "/Auth/register",
    cleanedDto
  );
  return res.data;
}
