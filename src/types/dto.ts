export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName: string;
  dateOfBirth?: string; // Using string for date input (YYYY-MM-DD format)
  gender?: number; // Gender enum: 0 = Male, 1 = Female, 2 = Other
}
