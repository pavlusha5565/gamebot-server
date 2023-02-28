export interface ILogin {
  email: string;
  password: string;
}

export interface ITokenPayload {
  email: string;
  userId: string;
  sessionId: string;
}
