import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { LucideAngularModule, Package, Plus, Search, SquarePen, Trash2 } from 'lucide-angular';
import { UserCreateModal } from '../../components/users/user-create-modal/user-create-modal';
import { UserEditModal } from '../../components/users/user-edit-modal/user-edit-modal';
import { User } from '../../interfaces/user';
import { UserMapper } from '../../Services/User/user-mapper';
import { UserFacade } from '../../Services/User/user-facade';

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

  constructor(private userFacade: UserFacade, private userMapper: UserMapper){}

  OpenUserCreate = signal(false);
  OpenUserEdit = signal(false);

  TotalUsers = signal(0);
  Data = signal<User[]>([])
  SelectedUser = signal<User | null>(null);
  SearchTerm = signal('');
  ngOnInit(): void {
    this.reloadUsers();
  }

  showUserCreate() {
    this.OpenUserCreate.set(true);
  }

  showUserEdit(user: User) {
    this.SelectedUser.set(user);
    this.OpenUserEdit.set(true);
  }

  reloadUsers() {
    this.userFacade.loadUsers().subscribe({
      next: (Users: User[]) => {
        this.TotalUsers.set(Users.length);
        this.Data.set(Users);
      }
    });
  }

  FilteredUsers = computed(() => {
    const term = this.SearchTerm().trim().toLowerCase();
    if (!term) {
      return this.Data();
    }
    return this.Data().filter((user) => {
      const name = user.name?.toLowerCase() ?? '';
      const email = user.email?.toLowerCase() ?? '';
      const department = this.userMapper.departmentLabel(user.department).toLowerCase();
      return name.includes(term) || email.includes(term) || department.includes(term);
    });
  });

  clearFilters() {
    this.SearchTerm.set('');
  }

  departmentLabel(value: User['department']): string {
  const result = this.userMapper.departmentLabel(value);
  console.log({ entrada: value, tipo: typeof value, saida: result }); // Debug
  return result;
}

  statusLabel(value: User['status']): string {
    return this.userMapper.statusLabel(value);
  }

  isActiveStatus(value: User['status']): boolean {
    return this.userMapper.isActiveStatus(value);
  }

  accessLabel(value: User['hasAccess']): string {
    return this.userMapper.accessLabel(value);
  }

  departmentClass(value: User['department']): string {
    return this.userMapper.departmentClass(value);
  }
}
