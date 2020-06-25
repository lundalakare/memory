export class OpenIDUserFiltered {
  id: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string|number;
  email: string;
  email_verified: boolean;
  sub: string;
}

export class OpenIDUser extends OpenIDUserFiltered {
  _scopes: string[];
  _admin: boolean;
}
