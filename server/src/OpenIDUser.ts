export default interface OpenIDUser {
  nickname: string;
  name: string;
  picture: string;
  updated_at: string|number;
  email: string;
  email_verified: boolean;
  sub: string;
  _localId: string;
  _scopes: string[];
  _admin: boolean;
}
