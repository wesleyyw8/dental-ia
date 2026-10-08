import { Clock3, Pencil, Plus, Sparkles, UsersRound, XCircle } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { StateView } from '../components/StateView'
import { Toast } from '../components/Toast'
import type { Procedimento } from '../types'
import {
  criarProcedimento,
  desativarProcedimento,
  editarProcedimento,
  fetchProfissionaisPorProcedimento,
  fetchProcedimentos,
  resetProcedimentoMutation,
} from '../redux/actions/procedimentosActions'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
  selectProcedimentoDeactivatingId,
  selectProcedimentoMutationError,
  selectProcedimentoMutationSuccess,
  selectProfissionaisPorProcedimento,
  selectProfissionaisProcedimentosError,
  selectProfissionaisProcedimentosLoading,
  selectProcedimentos,
  selectProcedimentosError,
  selectProcedimentosLoading,
  selectProcedimentoSaving,
} from '../redux/selectors/procedimentosSelectors'
import { formatCurrency } from '../utils/formatters'

const emptyForm = { nome: '', descricao: '', duracao: '', preco: '' }

export function ProcedimentosPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectProcedimentos)
  const loading = useAppSelector(selectProcedimentosLoading)
  const error = useAppSelector(selectProcedimentosError)
  const profissionaisPorProcedimento = useAppSelector(selectProfissionaisPorProcedimento)
  const profissionaisLoading = useAppSelector(selectProfissionaisProcedimentosLoading)
  const profissionaisError = useAppSelector(selectProfissionaisProcedimentosError)
  const saving = useAppSelector(selectProcedimentoSaving)
  const deactivatingId = useAppSelector(selectProcedimentoDeactivatingId)
  const mutationError = useAppSelector(selectProcedimentoMutationError)
  const mutationSuccess = useAppSelector(selectProcedimentoMutationSuccess)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Procedimento | null>(null)
  const [deactivateTarget, setDeactivateTarget] = useState<Procedimento | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [attempted, setAttempted] = useState(false)

  useEffect(() => {
    dispatch(fetchProcedimentos())
    return () => { dispatch(resetProcedimentoMutation()) }
  }, [dispatch])

  useEffect(() => {
    if (items.length > 0) {
      dispatch(fetchProfissionaisPorProcedimento(items.map((item) => item.id)))
    }
  }, [dispatch, items])

  const duration = Number(form.duracao)
  const price = Number(form.preco.replace(',', '.'))
  const validName = form.nome.trim().length >= 2
  const validDescription = form.descricao.trim().length >= 3
  const validDuration = Number.isInteger(duration) && duration > 0
  const validPrice = Number.isFinite(price) && price > 0
  const validForm = validName && validDescription && validDuration && validPrice

  const openCreate = () => {
    dispatch(resetProcedimentoMutation())
    setEditing(null)
    setForm(emptyForm)
    setAttempted(false)
    setFormOpen(true)
  }

  const openEdit = (item: Procedimento) => {
    dispatch(resetProcedimentoMutation())
    setEditing(item)
    setForm({ nome: item.nome, descricao: item.descricao, duracao: String(item.duracao_minutos), preco: String(item.preco) })
    setAttempted(false)
    setFormOpen(true)
  }

  const closeForm = () => {
    if (saving) return
    setFormOpen(false)
    setEditing(null)
    setAttempted(false)
    dispatch(resetProcedimentoMutation())
  }

  const submitForm = async (event: FormEvent) => {
    event.preventDefault()
    setAttempted(true)
    if (!validForm) return
    const payload = { nome: form.nome.trim(), descricao: form.descricao.trim(), duracao_minutos: duration, preco: price }
    const ok = editing
      ? await dispatch(editarProcedimento(editing.id, payload))
      : await dispatch(criarProcedimento(payload))
    if (ok) {
      setFormOpen(false)
      setEditing(null)
      setForm(emptyForm)
      setAttempted(false)
    }
  }

  const openDeactivate = (item: Procedimento) => {
    dispatch(resetProcedimentoMutation())
    setDeactivateTarget(item)
  }

  const closeDeactivate = () => {
    if (deactivatingId) return
    setDeactivateTarget(null)
    dispatch(resetProcedimentoMutation())
  }

  const confirmDeactivate = async () => {
    if (!deactivateTarget) return
    const ok = await dispatch(desativarProcedimento(deactivateTarget.id))
    if (ok) setDeactivateTarget(null)
  }

  return <div className="page">
    <PageHeader eyebrow="CATÁLOGO" title="Procedimentos" description="Conheça e gerencie os tratamentos disponíveis na clínica."
      action={<button className="button button--primary" onClick={openCreate}><Plus size={18} /> Novo procedimento</button>} />

    {loading ? <StateView type="loading" /> : error ? <StateView type="error" message={error} onRetry={() => dispatch(fetchProcedimentos())} /> : items.length === 0 ?
      <StateView type="empty" message="Nenhum procedimento ativo foi retornado pela API." /> :
      <div className="procedure-grid">{items.map((item, index) => {
        const profissionais = profissionaisPorProcedimento[item.id]

        return <article className="procedure-card" key={item.id}>
        <div className={`procedure-card__visual procedure-card__visual--${index % 4}`}><Sparkles size={25} /><span>{String(index + 1).padStart(2, '0')}</span></div>
        <div className="procedure-card__body">
          <span className="status status--active">Disponível</span><h2>{item.nome}</h2><p>{item.descricao}</p>
          <div className="procedure-card__professionals">
            <strong><UsersRound size={15} /> Profissionais:</strong>
            {profissionais ? profissionais.length > 0 ?
              <ul>{profissionais.map((profissional) => <li key={profissional.id}>{profissional.nome}</li>)}</ul> :
              <span>Nenhum profissional cadastrado</span> :
              <span>{profissionaisLoading ? 'Carregando profissionais…' : profissionaisError ? 'Não foi possível carregar os profissionais' : 'Nenhum profissional cadastrado'}</span>}
          </div>
          <div className="procedure-card__footer"><span><Clock3 size={16} />{item.duracao_minutos} min</span><strong>{formatCurrency(item.preco)}</strong></div>
          <div className="procedure-card__actions"><button className="table-action" onClick={() => openEdit(item)}><Pencil size={15} /> Editar</button><button className="table-action table-action--danger" onClick={() => openDeactivate(item)}><XCircle size={15} /> Desativar</button></div>
        </div>
      </article>})}</div>}

    <Modal open={formOpen} title={editing ? 'Editar procedimento' : 'Novo procedimento'} onClose={closeForm} actions={<>
      <button className="button button--secondary" onClick={closeForm} disabled={saving}>Cancelar</button>
      <button className="button button--primary" type="submit" form="procedure-form" disabled={saving}>{saving ? <><span className="button-spinner" /> Salvando…</> : editing ? 'Salvar alterações' : 'Cadastrar procedimento'}</button>
    </>}>
      <p className="modal-intro">{editing ? 'Atualize os dados do procedimento selecionado.' : 'Preencha os dados do novo procedimento.'}</p>
      <form id="procedure-form" className="modal-form" onSubmit={submitForm} noValidate>
        <label className="form-field"><span>Nome</span><input value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} placeholder="Ex.: Restauração" autoFocus />{attempted && !validName && <small>Informe o nome do procedimento.</small>}</label>
        <label className="form-field"><span>Descrição</span><textarea value={form.descricao} onChange={(event) => setForm({ ...form, descricao: event.target.value })} placeholder="Descreva o procedimento" rows={3} />{attempted && !validDescription && <small>Informe uma descrição.</small>}</label>
        <div className="form-row">
          <label className="form-field"><span>Duração em minutos</span><input type="number" min="1" step="1" value={form.duracao} onChange={(event) => setForm({ ...form, duracao: event.target.value })} placeholder="60" />{attempted && !validDuration && <small>Informe uma duração inteira maior que zero.</small>}</label>
          <label className="form-field"><span>Preço</span><input type="number" min="0.01" step="0.01" value={form.preco} onChange={(event) => setForm({ ...form, preco: event.target.value })} placeholder="300,00" />{attempted && !validPrice && <small>Informe um preço maior que zero.</small>}</label>
        </div>
      </form>
      {mutationError && <div className="inline-error">{mutationError}</div>}
    </Modal>

    <Modal open={Boolean(deactivateTarget)} title="Desativar procedimento" onClose={closeDeactivate} actions={<>
      <button className="button button--secondary" onClick={closeDeactivate} disabled={Boolean(deactivatingId)}>Manter procedimento</button>
      <button className="button button--danger" onClick={confirmDeactivate} disabled={Boolean(deactivatingId)}>{deactivatingId ? <><span className="button-spinner" /> Desativando…</> : 'Sim, desativar'}</button>
    </>}>
      {deactivateTarget && <>
        <p className="modal-intro">O procedimento deixará de aparecer nas opções de agendamento. Deseja continuar?</p>
        <div className="appointment-details appointment-details--cancel"><div><span>Procedimento</span><strong>{deactivateTarget.nome}</strong></div><div><span>Duração e preço</span><strong>{deactivateTarget.duracao_minutos} min · {formatCurrency(deactivateTarget.preco)}</strong></div></div>
        {mutationError && <div className="inline-error">{mutationError}</div>}
      </>}
    </Modal>

    {mutationSuccess && <Toast message={mutationSuccess} onClose={() => dispatch(resetProcedimentoMutation())} />}
  </div>
}
