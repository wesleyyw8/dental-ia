import { Mail, Phone, Plus, Search, X } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { StateView } from '../components/StateView'
import { Toast } from '../components/Toast'
import { buscarPacientePorTelefone, criarPaciente, fetchPacientes, limparBuscaPaciente, resetCriarPaciente } from '../redux/actions/pacientesActions'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
  selectPacientes, selectPacientesError, selectPacientesLoading,
  selectPacienteCreated, selectPacienteCreateError, selectPacienteCreating,
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
  const creating = useAppSelector(selectPacienteCreating)
  const createError = useAppSelector(selectPacienteCreateError)
  const created = useAppSelector(selectPacienteCreated)
  const [phone, setPhone] = useState('')
  const [newPatientOpen, setNewPatientOpen] = useState(false)
  const [form, setForm] = useState({ nome: '', telefone: '', email: '' })
  const [attempted, setAttempted] = useState(false)
  const searched = Boolean(result || searchError)

  useEffect(() => {
    dispatch(fetchPacientes())
    return () => { dispatch(limparBuscaPaciente()); dispatch(resetCriarPaciente()) }
  }, [dispatch])

  const validName = form.nome.trim().length >= 2
  const validPhone = form.telefone.replace(/\D/g, '').length >= 10
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  const validForm = validName && validPhone && validEmail

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const normalized = phone.replace(/\D/g, '')
    if (normalized) dispatch(buscarPacientePorTelefone(normalized))
  }
  const clear = () => { setPhone(''); dispatch(limparBuscaPaciente()) }
  const openCreate = () => {
    setForm({ nome: '', telefone: '', email: '' })
    setAttempted(false)
    dispatch(resetCriarPaciente())
    setNewPatientOpen(true)
  }
  const closeCreate = () => {
    if (creating) return
    setNewPatientOpen(false)
    setAttempted(false)
    dispatch(resetCriarPaciente())
  }
  const submitPatient = async (event: FormEvent) => {
    event.preventDefault()
    setAttempted(true)
    if (!validForm) return
    const ok = await dispatch(criarPaciente({
      nome: form.nome.trim(), telefone: form.telefone.trim(), email: form.email.trim(),
    }))
    if (ok) {
      setNewPatientOpen(false)
      setForm({ nome: '', telefone: '', email: '' })
      setAttempted(false)
      clear()
    }
  }

  return <div className="page">
    <PageHeader eyebrow="CADASTROS" title="Pacientes" description="Consulte os pacientes atendidos pela clínica."
      action={<button className="button button--primary" onClick={openCreate}><Plus size={18} /> Novo paciente</button>} />
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

    <Modal open={newPatientOpen} title="Novo paciente" onClose={closeCreate} actions={<>
      <button className="button button--secondary" onClick={closeCreate} disabled={creating}>Cancelar</button>
      <button className="button button--primary" type="submit" form="new-patient-form" disabled={creating}>
        {creating ? <><span className="button-spinner" /> Salvando…</> : 'Cadastrar paciente'}
      </button>
    </>}>
      <p className="modal-intro">Preencha os dados para cadastrar o paciente.</p>
      <form id="new-patient-form" className="modal-form" onSubmit={submitPatient} noValidate>
        <label className="form-field"><span>Nome</span><input value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} placeholder="Nome completo" autoFocus />{attempted && !validName && <small>Informe o nome do paciente.</small>}</label>
        <label className="form-field"><span>Telefone</span><input value={form.telefone} onChange={(event) => setForm({ ...form, telefone: event.target.value })} placeholder="(11) 99999-9999" inputMode="tel" />{attempted && !validPhone && <small>Informe um telefone válido com DDD.</small>}</label>
        <label className="form-field"><span>E-mail</span><input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="paciente@email.com" type="email" />{attempted && !validEmail && <small>Informe um e-mail válido.</small>}</label>
      </form>
      {createError && <div className="inline-error">{createError}</div>}
    </Modal>
    {created && <Toast message={`${created.nome} foi cadastrado com sucesso!`} onClose={() => dispatch(resetCriarPaciente())} />}
  </div>
}

function PatientCard({ patient }: { patient: { id: number; nome: string; telefone: string; email: string } }) {
  return <article className="patient-card"><span className="avatar avatar--large avatar--patient">{initials(patient.nome)}</span><div className="patient-card__content"><h3>{patient.nome}</h3><span className="muted">Paciente #{patient.id}</span><div className="contact-list"><a href={`tel:${patient.telefone}`}><Phone size={15} />{patient.telefone}</a><a href={`mailto:${patient.email}`}><Mail size={15} />{patient.email}</a></div></div></article>
}
