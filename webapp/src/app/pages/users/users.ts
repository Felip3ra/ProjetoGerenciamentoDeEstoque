import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { LucideAngularModule, Package, Plus, Search, SquarePen, Trash2 } from 'lucide-angular';
import { UserCreateModal } from '../../components/users/user-create-modal/user-create-modal';
import { UserEditModal } from '../../components/users/user-edit-modal/user-edit-modal';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, UserCreateModal, UserEditModal],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class UsersPage {
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Package = Package;
  readonly Edit = SquarePen;
  readonly Trash = Trash2;

  OpenUserCreate = signal(false);
  OpenUserEdit = signal(false);

  showUserCreate() {
    this.OpenUserCreate.set(true);
  }

  showUserEdit() {
    this.OpenUserEdit.set(true);
  }
}
