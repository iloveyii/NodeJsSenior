export type JwtPayload = {
  email: string;
  id: number;
  roles?: string;
};

export type JwtPayloadWithRefreshToken = JwtPayload & { refreshToken: string };
