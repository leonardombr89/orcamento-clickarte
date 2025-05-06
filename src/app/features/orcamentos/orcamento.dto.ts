export interface OrcamentoDTO {
  id?: number;
  clienteNome: string;
  clienteTelefone: string;
  clienteEmail: string;
  nomeServico: string;
  observacoes?: string;
  informacoesArte?: string;
  mensagem?: string;
  valorTotal?: number;
  dataCriacao?: string;
  validade?: string;
  status?: 'APROVADO' | 'REPROVADO' | 'VENCIDO' | 'CANCELADO' | 'PENDENTE';
  dataPrevisaoEntrega?: string;
  criarCardTrello?: boolean;
  itens: OrcamentoItemDTO[];
}

export interface OrcamentoItemDTO {
  id?: number;
  produtoNome: string;
  precoUnitario: number;
  quantidade: number;
  subTotal?: number;
}
