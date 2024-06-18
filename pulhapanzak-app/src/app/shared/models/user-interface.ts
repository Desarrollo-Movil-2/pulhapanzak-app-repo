export interface IUser {
  uid: string;
  email: string;
  name: string;
  password?: string;
  phoneNumber: string;
  identityNumber: string;
  photoUrl: string;
  birthdate?: Date | null;
  deviceId?: string | null;
}
