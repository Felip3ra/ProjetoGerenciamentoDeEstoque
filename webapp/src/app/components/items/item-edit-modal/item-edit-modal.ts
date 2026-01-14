import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, X } from 'lucide-angular';
import { Item } from '../../../interfaces/item';
import { ToastService } from '../../../Services/Toast/toast-service';
import { ItemFacade } from '../../../Services/Item/item-facade';

@Component({
  selector: 'app-item-edit-modal',
  standalone: true,
  imports: [LucideAngularModule, ReactiveFormsModule],
  templateUrl: './item-edit-modal.html',
  styleUrls: ['./item-edit-modal.css'],
})
export class ItemEditModal {
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
  @Input() item: Item | null = null;
  @Output() close = new EventEmitter<void>();
  form: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  getPurchaseDateValue(): string {
    if (!this.item?.purchaseDate) {
      return '';
    }
    const parsed = new Date(this.item.purchaseDate);
    if (Number.isNaN(parsed.getTime())) {
      return '';
    }
    return parsed.toISOString().slice(0, 10);
  }

  ngOnChanges(): void {
    if (!this.item) {
      return;
    }
    this.form.patchValue({
      category: this.item.category,
      name: this.item.name,
      brand: this.item.brand,
      model: this.item.model,
      serialNumber: this.item.serialNumber,
      patrimonyNumber: this.item.patrimonyNumber,
      description: this.item.description,
      purchaseDate: this.getPurchaseDateValue(),
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.item) {
      this.errorMessage = 'Preencha os campos obrigatorios.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.itemFacade.updateItem(this.item, this.form.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastService.success('Item atualizado com sucesso.');
        this.close.emit();
      },
      error: () => {
        this.errorMessage = 'Erro ao salvar o item. Tente novamente.';
        this.toastService.error('Erro ao atualizar item.');
        this.isSubmitting = false;
      }
    });
  }
}
