import { User } from "../interfaces/game";

export function getUserFromId(id: string, users: User[]): User | null {
  for (let user of users) {
    if (user.id === id) {
      return user;
    }
  }

  return null;
}
