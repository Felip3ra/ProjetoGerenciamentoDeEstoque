import type { Movement } from './movement';
import type { User } from './user';

export interface Item {
  id: number;
  category: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  patrimonyNumber: string;
  description: string;
  purchaseDate: string;
  statusItem: string;
  currentUserId?: number | null;
  createdAt: string;
  updatedAt: string;
  currentUser?: User;
  movements?: Movement[];
}
