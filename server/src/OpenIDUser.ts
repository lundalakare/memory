export class OpenIDUserBase {
  id: string;
  nickname: string;
  name: string;
  picture: string;
  updated_at: string|number;
  email: string;
  email_verified: boolean;
  sub: string;
}

export class OpenIDUserFiltered extends OpenIDUserBase {
  user_metadata: Record<string, any>
  app_metadata: Record<string, any>
}

export class OpenIDUser extends OpenIDUserFiltered {
  _scopes: string[];
  _admin: boolean;
  'https://memory.lundalakare.se/user_metadata': Record<string, any>
  'https://memory.lundalakare.se/app_metadata': Record<string, any>
}
