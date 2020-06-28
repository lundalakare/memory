export interface Role {
  dependsOn?: string[];
  scopes?: string[];
  admin?: boolean;
}

export const roles: Record<string, Role> = {
  default: {
    scopes: [
      'decks:write', 'decks:read'
    ]
  },
  admin: {
    dependsOn: ['default'],
    admin: true
  }
}
