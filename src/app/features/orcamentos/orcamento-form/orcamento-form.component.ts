import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-orcamento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './orcamento-form.component.html'
})
export class OrcamentoFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      clienteNome: [''],
      clienteTelefone: [''],
      clienteEmail: [''],
      observacoes: [''],
      validade: [''],
      status: ['APROVADO'], // enum-like string
      itens: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.id;

    if (this.isEditMode) {
      this.http.get<any>(`/api/orcamentos/${this.id}`).subscribe(data => {
        this.form.patchValue(data);
        data.itens.forEach((item: any) => this.addItem(item));
      });
    } else {
      this.addItem(); // ao menos um item
    }
  }

  get itens(): FormArray {
    return this.form.get('itens') as FormArray;
  }

  addItem(item: any = { produtoNome: '', precoUnitario: 0, quantidade: 1 }) {
    this.itens.push(
      this.fb.group({
        produtoNome: [item.produtoNome],
        precoUnitario: [item.precoUnitario],
        quantidade: [item.quantidade]
      })
    );
  }

  removeItem(index: number) {
    this.itens.removeAt(index);
  }

  submit() {
    const orcamento = this.form.value;

    const request$ = this.isEditMode
      ? this.http.put(`/api/orcamentos/${this.id}`, orcamento)
      : this.http.post('/api/orcamentos', orcamento);

    request$.subscribe(() => {
      this.router.navigate(['/orcamentos']);
    });
  }
}
