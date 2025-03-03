import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-introducir-codigo',
  imports: [CommonModule, FormsModule],
  templateUrl: './introducir-codigo.component.html',
  styleUrl: './introducir-codigo.component.css'
})
export class IntroducirCodigoComponent {

  code: string ='';
  onSubmit(): void {}
}
