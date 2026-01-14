import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../../interfaces/user';
import { UserService } from './user-service';
import { AuthService } from '../Auth/auth-service';
import { UserMapper } from './user-mapper';
import { Department } from '../../interfaces/department';
import { Status } from '../../interfaces/status';

@Injectable({
  providedIn: 'root',
})
export class UserFacade {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private userMapper: UserMapper
  ) {}

  loadUsers(): Observable<User[]> {
    return this.userService.GetAllUsers().pipe(
      map((users) =>
        users.map((user) => ({
          ...user,
          department: this.userMapper.departmentLabel(user.department) as Department,
          status: this.userMapper.statusLabel(user.status) as Status,
        }))
      )
    );
  }

  registerUser(formValue: {
    name: string;
    email: string;
    department: Department | number;
    hasAccess: boolean;
    passwordHash?: string;
    profile?: string;
  }): Observable<boolean> {
    if (formValue.hasAccess) {
      return this.authService.register({
        name: formValue.name,
        email: formValue.email,
        passwordHash: formValue.passwordHash || '',
        department: this.userMapper.toApiDepartment(formValue.department),
        hasAccess: formValue.hasAccess,
      });
    }

    const payload: User = {
      id: 0,
      name: formValue.name,
      email: formValue.email,
      department: this.userMapper.toApiDepartment(formValue.department),
      status: 1,
      hasAccess: formValue.hasAccess,
      passwordHash: '',
      profile: formValue.profile || 'Operador',
      createdAt: new Date().toISOString(),
      items: [],
      movementsFrom: [],
      movementsTo: [],
    };

    return this.userService.AddUser(payload);
  }

  updateUser(
    user: User,
    formValue: {
      name: string;
      email: string;
      department: Department | number;
      hasAccess: boolean;
      profile: string;
      status: Status | number;
      passwordHash?: string;
    }
  ): Observable<boolean> {
    const payload: User = {
      ...user,
      name: formValue.name,
      email: formValue.email,
      department: this.userMapper.toApiDepartment(formValue.department),
      hasAccess: formValue.hasAccess,
      profile: formValue.profile,
      status: this.userMapper.toApiStatus(formValue.status),
      passwordHash: formValue.passwordHash || user.passwordHash,
      items: user.items ?? [],
      movementsFrom: user.movementsFrom ?? [],
      movementsTo: user.movementsTo ?? [],
    };

    return this.userService.UpdateUser(payload);
  }
}
