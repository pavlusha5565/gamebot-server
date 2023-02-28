export interface IUserSearch {
  id?: string;
  name?: string;
  email?: string;
}

export type RegisterDto = {
  email: string;
  username: string;
  password: string;
};
