export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  country: string;
  city: string;
  address: string;
  description?: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
