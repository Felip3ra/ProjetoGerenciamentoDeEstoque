import { Department } from './department';
import { Status } from './status';
import type { Item } from './item';
import type { Movement } from './movement';

export interface User {
  id: number;
  name: string;
  email: string;
  department: Department | number;
  status: Status | number;
  hasAccess: boolean;
  passwordHash: string;
  profile: string;
  createdAt: string;
  items?: Item[];
  movementsFrom?: Movement[];
  movementsTo?: Movement[];
}

export interface UserLogin {
  email: string;
  passwordHash: string;
}

export interface UserRegister {
  name: string;
  email: string;
  passwordHash: string;
  department: Department | number;
  hasAccess: boolean;
}
