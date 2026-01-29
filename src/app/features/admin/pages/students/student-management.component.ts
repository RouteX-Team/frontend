/**
 * RouteX - Admin Student Management Component
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
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
        TableModule,
        ButtonModule,
        InputTextModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './student-management.component.html',
    styleUrl: './student-management.component.scss'
})
export class StudentManagementComponent {
    private router = inject(Router);
    userService = inject(UserService);
    private confirmationService = inject(ConfirmationService);
    private messageService = inject(MessageService);

    students = this.userService.students;

    openNew(): void {
        this.router.navigate(['/admin/students/new']);
    }

    editStudent(student: User): void {
        this.router.navigate(['/admin/students', student.id, 'edit']);
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
}
