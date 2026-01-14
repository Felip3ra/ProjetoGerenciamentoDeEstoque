import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X } from 'lucide-angular';
import { ToastService } from '../../../Services/Toast/toast-service';
import { ItemFacade } from '../../../Services/Item/item-facade';

@Component({
  selector: 'app-item-form-modal',
  standalone: true,
  imports: [LucideAngularModule, ReactiveFormsModule],
  templateUrl: './item-form-modal.html',
  styleUrls: ['./item-form-modal.css'],
})
export class ItemFormModal {
  constructor(
    private fb: FormBuilder,
    private itemFacade: ItemFacade,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      category: ['', [Validators.required]],
      name: ['', [Validators.required]],
      brand: [''],
      model: [''],
      serialNumber: ['', [Validators.required]],
      patrimonyNumber: [''],
      description: [''],
      purchaseDate: [''],
    });
  }

  readonly CloseIcon = X;
  @Output() close = new EventEmitter<void>();
  form: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  onSubmit() {
    if (this.form.invalid) {
      this.errorMessage = 'Preencha os campos obrigatorios.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.itemFacade.createItem(this.form.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.success('Item cadastrado com sucesso.');
        this.close.emit();
      },
      error: () => {
        this.errorMessage = 'Erro ao salvar o item. Tente novamente.';
        this.toastService.error('Erro ao cadastrar item.');
        this.isSubmitting = false;
      }
    });
  }
}
