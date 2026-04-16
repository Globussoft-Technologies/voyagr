export function canManageTeam(role: string): boolean {
  return role === "OWNER";
}

export function canEditContent(role: string): boolean {
  return role === "OWNER" || role === "ADMIN" || role === "EDITOR";
}

export function canManageSettings(role: string): boolean {
  return role === "OWNER" || role === "ADMIN";
}
