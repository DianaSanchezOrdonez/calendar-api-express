export class AccessResfreshTokenDto {
  readonly access_token: string
  readonly expiry_date: number
  readonly token_type: string
  readonly scope: string
  readonly refresh_token: string
}
