import type { Item } from './item';
import type { User } from './user';

export interface Movement {
  id: number;
  itemId: number;
  fromUserId?: number | null;
  toUserId?: number | null;
  movementType: string;
  movementDateTime: string;
  observation: string;
  previousStatus: string;
  newStatus: string;
  createdAt: string;
  item?: Item;
  fromUser?: User;
  toUser?: User;
}
