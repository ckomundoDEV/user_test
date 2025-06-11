export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}
export interface CreateUserDTO {
  name: string;
  email: string;
}