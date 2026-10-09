import { Mail, Pencil, Phone, Plus, Stethoscope, XCircle } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { StateView } from '../components/StateView'
import { Toast } from '../components/Toast'
import {
  criarDentista,
  desativarDentista,
  editarDentista,
  fetchDentistas,
  resetDentistaMutation,
} from '../redux/actions/dentistasActions'
import { fetchProcedimentos } from '../redux/actions/procedimentosActions'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
  selectDentistaDeactivatingId,
  selectDentistaMutationError,
  selectDentistaMutationSuccess,
  selectDentistas,
  selectDentistasError,
  selectDentistasLoading,
  selectDentistaSaving,
} from '../redux/selectors/dentistasSelectors'
import {
  selectProcedimentos,
  selectProcedimentosError,
  selectProcedimentosLoading,
} from '../redux/selectors/procedimentosSelectors'
import type { Dentista } from '../types'
import { initials } from '../utils/formatters'

const emptyForm = {
  nome: '',
  especialidade: '',
  telefone: '',
  email: '',
  procedimentoIds: [] as number[],
}

export function ProfissionaisPage() {
  const dispatch = useAppDispatch()
  const profissionais = useAppSelector(selectDentistas)
  const loading = useAppSelector(selectDentistasLoading)
  const error = useAppSelector(selectDentistasError)
  const saving = useAppSelector(selectDentistaSaving)
  const deactivatingId = useAppSelector(selectDentistaDeactivatingId)
  const mutationError = useAppSelector(selectDentistaMutationError)
  const mutationSuccess = useAppSelector(selectDentistaMutationSuccess)
  const procedimentos = useAppSelector(selectProcedimentos)
  const procedimentosLoading = useAppSelector(selectProcedimentosLoading)
  const procedimentosError = useAppSelector(selectProcedimentosError)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Dentista | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<Dentista | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [attempted, setAttempted] = useState(false)

  useEffect(() => {
    dispatch(fetchDentistas())
    dispatch(fetchProcedimentos())
    return () => { dispatch(resetDentistaMutation()) }
  }, [dispatch])

  const validName = form.nome.trim().length >= 2
  const validSpecialty = form.especialidade.trim().length >= 2
  const validPhone = form.telefone.replace(/\D/g, '').length >= 10
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
  const validProcedures = form.procedimentoIds.length > 0
  const validForm = validName && validSpecialty && validPhone && validEmail && validProcedures

  const openCreate = () => {
    dispatch(resetDentistaMutation())
    setEditing(null)
    setForm(emptyForm)
    setAttempted(false)
    setFormOpen(true)
  }

  const openEdit = (profissional: Dentista) => {
    dispatch(resetDentistaMutation())
    setEditing(profissional)
    setForm({
      nome: profissional.nome,
      especialidade: profissional.especialidade,
      telefone: profissional.telefone,
      email: profissional.email,
      procedimentoIds: profissional.procedimentos?.map((procedimento) => procedimento.id) ?? [],
    })
    setAttempted(false)
    setFormOpen(true)
  }

  const closeForm = () => {
    if (saving) return
    setFormOpen(false)
    setEditing(null)
    setAttempted(false)
    dispatch(resetDentistaMutation())
  }

  const toggleProcedure = (procedimentoId: number) => {
    setForm((current) => ({
      ...current,
      procedimentoIds: current.procedimentoIds.includes(procedimentoId)
        ? current.procedimentoIds.filter((id) => id !== procedimentoId)
        : [...current.procedimentoIds, procedimentoId],
    }))
  }

  const submitForm = async (event: FormEvent) => {
    event.preventDefault()
    setAttempted(true)

    if (!validForm) return

    const payload = {
      nome: form.nome.trim(),
      especialidade: form.especialidade.trim(),
      telefone: form.telefone.trim(),
      email: form.email.trim(),
      procedimento_ids: form.procedimentoIds,
    }
    const ok = editing
      ? await dispatch(editarDentista(editing.id, payload))
      : await dispatch(criarDentista(payload))

    if (ok) {
      setFormOpen(false)
      setEditing(null)
      setForm(emptyForm)
      setAttempted(false)
    }
  }

  const closeDeactivate = () => {
    if (deactivatingId) return
    setDeactivateTarget(null)
    dispatch(resetDentistaMutation())
  }

  const confirmDeactivate = async () => {
    if (!deactivateTarget) return
    const ok = await dispatch(desativarDentista(deactivateTarget.id))
    if (ok) setDeactivateTarget(null)
  }

  return <div className="page">
    <PageHeader eyebrow="EQUIPE" title="Profissionais" description="Cadastre e gerencie os profissionais e seus procedimentos."
      action={<button className="button button--primary" onClick={openCreate}><Plus size={18} /> Novo profissional</button>} />

    {loading ? <StateView type="loading" /> : error ? <StateView type="error" message={error} onRetry={() => dispatch(fetchDentistas())} /> : profissionais.length === 0 ?
      <StateView type="empty" message="Nenhum profissional ativo foi retornado pela API." /> :
      <div className="professional-grid">{profissionais.map((profissional) => <article className="professional-card" key={profissional.id}>
        <div className="professional-card__header">
          <span className="avatar avatar--professional">{initials(profissional.nome)}</span>
          <div><h2>{profissional.nome}</h2><span>{profissional.especialidade}</span></div>
          <span className="status status--active">Ativo</span>
        </div>
        <div className="professional-card__contacts">
          <a href={`tel:${profissional.telefone}`}><Phone size={15} />{profissional.telefone}</a>
          <a href={`mailto:${profissional.email}`}><Mail size={15} />{profissional.email}</a>
        </div>
        <div className="professional-card__procedures">
          <strong><Stethoscope size={15} /> Procedimentos:</strong>
          {profissional.procedimentos?.length ? <div>{profissional.procedimentos.map((procedimento) => <span key={procedimento.id}>{procedimento.nome}</span>)}</div> : <small>Nenhum procedimento cadastrado</small>}
        </div>
        <div className="professional-card__actions">
          <button className="table-action" onClick={() => openEdit(profissional)}><Pencil size={15} /> Editar</button>
          <button className="table-action table-action--danger" onClick={() => { dispatch(resetDentistaMutation()); setDeactivateTarget(profissional) }}><XCircle size={15} /> Desativar</button>
        </div>
      </article>)}</div>}

    <Modal open={formOpen} title={editing ? 'Editar profissional' : 'Novo profissional'} onClose={closeForm} actions={<>
      <button className="button button--secondary" onClick={closeForm} disabled={saving}>Cancelar</button>
      <button className="button button--primary" type="submit" form="professional-form" disabled={saving || procedimentosLoading}>
        {saving ? <><span className="button-spinner" /> Salvando…</> : editing ? 'Salvar alterações' : 'Cadastrar profissional'}
      </button>
    </>}>
      <p className="modal-intro">Informe os dados do profissional e selecione todos os procedimentos que ele realiza.</p>
      <form id="professional-form" className="modal-form" onSubmit={submitForm} noValidate>
        <label className="form-field"><span>Nome</span><input value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} placeholder="Ex.: Dra. Ana Silva" autoFocus />{attempted && !validName && <small>Informe o nome do profissional.</small>}</label>
        <label className="form-field"><span>Especialidade</span><input value={form.especialidade} onChange={(event) => setForm({ ...form, especialidade: event.target.value })} placeholder="Ex.: Clínico Geral" />{attempted && !validSpecialty && <small>Informe a especialidade.</small>}</label>
        <div className="form-row">
          <label className="form-field"><span>Telefone</span><input value={form.telefone} onChange={(event) => setForm({ ...form, telefone: event.target.value })} placeholder="(11) 99999-9999" inputMode="tel" />{attempted && !validPhone && <small>Informe um telefone válido com DDD.</small>}</label>
          <label className="form-field"><span>E-mail</span><input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="profissional@email.com" type="email" />{attempted && !validEmail && <small>Informe um e-mail válido.</small>}</label>
        </div>
        <fieldset className="procedure-selector">
          <legend>Procedimentos que realiza</legend>
          {procedimentosLoading ? <span>Carregando procedimentos…</span> : procedimentosError ? <div className="inline-error">{procedimentosError}</div> :
            <div>{procedimentos.map((procedimento) => <label key={procedimento.id} className={form.procedimentoIds.includes(procedimento.id) ? 'selected' : ''}>
              <input type="checkbox" checked={form.procedimentoIds.includes(procedimento.id)} onChange={() => toggleProcedure(procedimento.id)} />
              <span>{procedimento.nome}</span>
            </label>)}</div>}
          {attempted && !validProcedures && <small>Selecione pelo menos um procedimento.</small>}
        </fieldset>
      </form>
      {mutationError && <div className="inline-error">{mutationError}</div>}
    </Modal>

    <Modal open={Boolean(deactivateTarget)} title="Desativar profissional" onClose={closeDeactivate} actions={<>
      <button className="button button--secondary" onClick={closeDeactivate} disabled={Boolean(deactivatingId)}>Manter profissional</button>
      <button className="button button--danger" onClick={confirmDeactivate} disabled={Boolean(deactivatingId)}>{deactivatingId ? <><span className="button-spinner" /> Desativando…</> : 'Sim, desativar'}</button>
    </>}>
      {deactivateTarget && <>
        <p className="modal-intro">Este profissional deixará de aparecer nas opções de agendamento. Deseja continuar?</p>
        <div className="appointment-details appointment-details--cancel"><div><span>Profissional</span><strong>{deactivateTarget.nome}</strong></div><div><span>Especialidade</span><strong>{deactivateTarget.especialidade}</strong></div></div>
        {mutationError && <div className="inline-error">{mutationError}</div>}
      </>}
    </Modal>

    {mutationSuccess && <Toast message={mutationSuccess} onClose={() => dispatch(resetDentistaMutation())} />}
  </div>
}
