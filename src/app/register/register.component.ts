import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true
})
export class RegisterComponent {
  formularioRegistre: FormGroup;
  
  @Output() registreComplet = new EventEmitter<void>();

  constructor(
    private form: FormBuilder,
    private userService: UserService
  ) {
    
    this.formularioRegistre = this.form.group({
      name: ['', Validators.required],  
      email: ['', [Validators.required, Validators.email]],
      age: ['', [Validators.required, Validators.min(1)]]  
    });
  }

  teError(camp: string, tipusError: string): boolean {
    const control = this.formularioRegistre.get(camp);
    return !!control && control.touched && control.hasError(tipusError);
  }

  // Método de registro
  registrar(): void {
    if (this.formularioRegistre.invalid) {
      Object.keys(this.formularioRegistre.controls).forEach(key => {
        const control = this.formularioRegistre.get(key);
        control?.markAsTouched();
      });
      return;
    }

    // Obtener datos del formulario
    const dades = this.formularioRegistre.value;
    
    // Enviar al servicio
    this.userService.registerUser(dades).subscribe({
      next: () => {
        // Enviar evento de finalización de registro
        this.registreComplet.emit();
        // Restablecer formularios
        this.formularioRegistre.reset();
      },
      error: (err) => {
        console.error('Error al registrar:', err);
      }
    });
  }
}