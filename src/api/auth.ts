import axios from "axios";
import { LoginDto, RegisterDto } from "../types/dto";

const api = axios.create({
  baseURL: "https://localhost:7000",
  withCredentials: true, // send cookies for cookie-auth
});

export async function login(dto: LoginDto): Promise<void> {
  await api.post("/api/Auth/login", dto);
}

export async function logout(): Promise<void> {
  await api.post("/api/Auth/logout");
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

  const res = await api.post<{ message: string }>(
    "/api/Auth/register",
    cleanedDto
  );
  return res.data;
}
