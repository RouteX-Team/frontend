/**
 * RouteX - Student Form Component
 * Add/Edit student details on a separate page
 */

import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '../../../../../data/services/user.service';
import { RouteService } from '../../../../../data/services/route.service';
import { User } from '../../../../../data/models';

@Component({
    selector: 'rx-student-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        MultiSelectModule,
        ToastModule
    ],
    providers: [MessageService],
    templateUrl: './student-form.component.html',
    styleUrl: './student-form.component.scss'
})
export class StudentFormComponent implements OnInit {
    private router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private userService = inject(UserService);
    private routeService = inject(RouteService);
    private messageService = inject(MessageService);

    isEditMode = signal(false);
    studentId = signal<string | null>(null);
    submitted = signal(false);
    loading = signal(false);

    student = signal<Partial<User>>({
        name: '',
        email: '',
        phone: '',
        role: 'student',
        favoriteRouteIds: []
    });

    routes = this.routeService.routes;

    ngOnInit(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEditMode.set(true);
            this.studentId.set(id);
            this.loadStudent(id);
        }
    }

    loadStudent(id: string): void {
        const student = this.userService.getUser(id);
        if (student) {
            this.student.set({ ...student });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Student not found'
            });
            this.router.navigate(['/admin/students']);
        }
    }

    onSubmit(): void {
        this.submitted.set(true);
        const studentData = this.student();

        if (!studentData.name?.trim() || !studentData.email?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'Please fill in all required fields'
            });
            return;
        }

        this.loading.set(true);

        setTimeout(() => {
            if (this.isEditMode()) {
                this.userService.updateUser(this.studentId()!, studentData);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Updated',
                    detail: `Student ${studentData.name} updated successfully`
                });
            } else {
                this.userService.addUser({ ...studentData, role: 'student' } as User);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Created',
                    detail: `Student ${studentData.name} added successfully`
                });
            }

            this.loading.set(false);
            setTimeout(() => this.router.navigate(['/admin/students']), 1000);
        }, 500);
    }

    onCancel(): void {
        this.router.navigate(['/admin/students']);
    }
}
