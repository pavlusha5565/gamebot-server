import { ERole } from 'src/database/entities/User/User.entity';

export interface IUserSearch {
  id?: string;
  name?: string;
  email?: string;
}

export type RegisterDto = {
  email: string;
  username: string;
  password: string;
  role: ERole;
};
