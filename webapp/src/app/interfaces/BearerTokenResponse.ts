export interface BearerTokenResponse {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  refreshToken?: string;
}