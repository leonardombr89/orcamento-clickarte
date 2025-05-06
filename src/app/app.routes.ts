import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { OrcamentoListComponent } from './features/orcamentos/orcamento-list/orcamento-list.component';
import { OrcamentoFormComponent } from './features/orcamentos/orcamento-form/orcamento-form.component';
import { OrcamentoCalculadoraComponent } from './features/orcamentos/orcamento-calculadora/orcamento-calculadora.component';
import { LoginComponent } from './pages/login/login.component';
import { RegistroInicialComponent } from './pages/registro/registro-inicial.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UsuarioListComponent } from './features/usuarios/usuario-list/usuario-list.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: OrcamentoCalculadoraComponent },
      { path: 'orcamentos', component: OrcamentoListComponent },
      { path: 'orcamentos/novo', component: OrcamentoFormComponent },
      { path: 'orcamentos/:id/editar', component: OrcamentoFormComponent },
    
      {
        path: 'usuarios',
        component: UsuarioListComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['GESTOR'] }
      }
    ]    
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro-inicial',
    component: RegistroInicialComponent
  },
  {
    path: 'registro-gestor',
    loadComponent: () => import('./pages/registro-gestor/registro-gestor.component').then(m => m.RegistroGestorComponent)
  },
  {
    path: 'nao-encontrado',
    loadComponent: () => import('./pages/nao-encontrado/nao-encontrado.component').then(m => m.NaoEncontradoComponent)
  }  
];
