/**
 * RouteX - Admin Student Management Component
 */

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../../../data/services/user.service';
import { User } from '../../../../data/models';

@Component({
    selector: 'rx-student-management',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './student-management.component.html',
    styleUrl: './student-management.component.scss' // Reusing driver styles or similar
})
export class StudentManagementComponent {
    userService = inject(UserService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    students = this.userService.students;

    userDialog = signal(false);
    submitted = signal(false);
    editMode = signal(false);
    currentUser = signal<Partial<User>>({});

    openNew(): void {
        this.currentUser.set({
            name: '',
            email: '',
            role: 'student',
            favoriteRouteIds: []
        });
        this.editMode.set(false);
        this.submitted.set(false);
        this.userDialog.set(true);
    }

    editStudent(student: User): void {
        this.currentUser.set({ ...student });
        this.editMode.set(true);
        this.userDialog.set(true);
    }

    deleteStudent(student: User): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to remove student ${student.name}?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userService.deleteUser(student.id);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Student Removed', life: 3000 });
            }
        });
    }

    saveStudent(): void {
        this.submitted.set(true);
        const user = this.currentUser();

        if (user.name?.trim() && user.email?.trim()) {
            if (this.editMode()) {
                this.userService.updateUser(user.id!, user);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Student Updated', life: 3000 });
            } else {
                this.userService.addUser(user as User);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Student Added', life: 3000 });
            }

            this.userDialog.set(false);
            this.currentUser.set({});
        }
    }
}
