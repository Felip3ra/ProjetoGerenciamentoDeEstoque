import { Department } from './department';
import { Status } from './status';
import type { Item } from './item';
import type { Movement } from './movement';

export interface User {
  id: number;
  name: string;
  email: string;
  department: Department;
  status: Status;
  hasAccess: boolean;
  passwordHash: string;
  profile: string;
  createdAt: string;
  items?: Item[];
  movementsFrom?: Movement[];
  movementsTo?: Movement[];
}
