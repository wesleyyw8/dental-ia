import { Mail, Phone, Search, X } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { StateView } from '../components/StateView'
import { buscarPacientePorTelefone, fetchPacientes, limparBuscaPaciente } from '../redux/actions/pacientesActions'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
  selectPacientes, selectPacientesError, selectPacientesLoading,
  selectPacienteSearchError, selectPacienteSearching, selectPacienteSearchResult,
} from '../redux/selectors/pacientesSelectors'
import { initials } from '../utils/formatters'

export function PacientesPage() {
  const dispatch = useAppDispatch()
  const pacientes = useAppSelector(selectPacientes)
  const loading = useAppSelector(selectPacientesLoading)
  const error = useAppSelector(selectPacientesError)
  const result = useAppSelector(selectPacienteSearchResult)
  const searching = useAppSelector(selectPacienteSearching)
  const searchError = useAppSelector(selectPacienteSearchError)
  const [phone, setPhone] = useState('')
  const searched = Boolean(result || searchError)

  useEffect(() => { dispatch(fetchPacientes()); return () => { dispatch(limparBuscaPaciente()) } }, [dispatch])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const normalized = phone.replace(/\D/g, '')
    if (normalized) dispatch(buscarPacientePorTelefone(normalized))
  }
  const clear = () => { setPhone(''); dispatch(limparBuscaPaciente()) }

  return <div className="page">
    <PageHeader eyebrow="CADASTROS" title="Pacientes" description="Consulte os pacientes atendidos pela clínica." />
    <section className="search-card">
      <div><h2>Buscar por telefone</h2><p>Digite o número completo, incluindo o DDD.</p></div>
      <form onSubmit={submit} className="search-form">
        <label className="input-with-icon"><Phone size={18} /><input value={phone} onChange={(event) => { setPhone(event.target.value); if (searched) dispatch(limparBuscaPaciente()) }} placeholder="Ex.: 11988880001" inputMode="tel" aria-label="Telefone do paciente" /></label>
        {phone && <button type="button" className="clear-input" onClick={clear} aria-label="Limpar busca"><X size={16} /></button>}
        <button className="button button--primary" disabled={!phone.replace(/\D/g, '') || searching}>{searching ? <span className="button-spinner" /> : <Search size={17} />} Buscar</button>
      </form>
    </section>

    <section className="panel">
      <div className="panel__header"><div><h2>{searched ? 'Resultado da busca' : 'Todos os pacientes'}</h2><p>{searched ? 'Paciente correspondente ao telefone informado' : `${pacientes.length} pacientes cadastrados`}</p></div>{searched && <button className="button button--ghost button--small" onClick={clear}>Ver todos</button>}</div>
      {searching ? <StateView type="loading" /> : searchError ? <StateView type="empty" title="Paciente não encontrado" message={searchError} /> : result ?
        <div className="patient-grid"><PatientCard patient={result} /></div> : loading ? <StateView type="loading" /> : error ? <StateView type="error" message={error} onRetry={() => dispatch(fetchPacientes())} /> : pacientes.length === 0 ? <StateView type="empty" message="Nenhum paciente foi retornado pela API." /> :
        <div className="patient-grid">{pacientes.map((patient) => <PatientCard key={patient.id} patient={patient} />)}</div>}
    </section>
  </div>
}

function PatientCard({ patient }: { patient: { id: number; nome: string; telefone: string; email: string } }) {
  return <article className="patient-card"><span className="avatar avatar--large avatar--patient">{initials(patient.nome)}</span><div className="patient-card__content"><h3>{patient.nome}</h3><span className="muted">Paciente #{patient.id}</span><div className="contact-list"><a href={`tel:${patient.telefone}`}><Phone size={15} />{patient.telefone}</a><a href={`mailto:${patient.email}`}><Mail size={15} />{patient.email}</a></div></div></article>
}
