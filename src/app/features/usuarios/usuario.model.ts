export interface Usuario {
    id?: number;
    nome: string;
    username: string;
    senha?: string;
    perfil: 'GESTOR' | 'OPERADOR';
    ativo?: boolean;
  }