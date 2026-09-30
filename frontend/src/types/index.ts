export interface Paciente {
  id: number
  nome: string
  telefone: string
  email: string
}

export interface Procedimento {
  id: number
  nome: string
  descricao: string
  duracao_minutos: number
  preco: number
  ativo?: boolean
}

export interface Dentista {
  id: number
  nome: string
  especialidade: string
  telefone: string
  email: string
  ativo?: boolean
}

export interface Disponibilidade {
  id: number
  dentista_id: number
  data: string
  hora_inicio: string
  hora_fim: string
}

export interface Consulta {
  id: number
  paciente_id: number
  paciente_nome: string
  dentista_id: number
  dentista_nome: string
  procedimento_id: number
  procedimento_nome: string
  data_hora_inicio: string
  data_hora_fim: string
  status: string
}

export interface HorariosResponse {
  procedimento?: Procedimento
  disponibilidades?: Disponibilidade[]
  consultas?: Consulta[]
  horarios_disponiveis?: string[]
  erro?: string
}

export interface NovaConsulta {
  paciente_id: number
  dentista_id: number
  procedimento_id: number
  data: string
  horario: string
}

export interface CriarConsultaResponse {
  id?: number
  erro?: string
  [key: string]: unknown
}

export interface AsyncState {
  loading: boolean
  error: string | null
}
