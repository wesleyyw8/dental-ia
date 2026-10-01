import { CalendarCheck2, CalendarClock, CalendarDays, Clock3, Plus, XCircle, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Consulta } from '../types'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { StateView } from '../components/StateView'
import { Toast } from '../components/Toast'
import { cancelarConsulta, fetchConsultas, remarcarConsulta, resetConsultaMutation } from '../redux/actions/consultasActions'
import { fetchHorarios, limparHorarios } from '../redux/actions/horariosActions'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import {
  selectConsultaCancelError, selectConsultaCancelingId, selectConsultaMutationSuccess,
  selectConsultaRescheduleError, selectConsultaReschedulingId,
  selectConsultas, selectConsultasError, selectConsultasLoading,
} from '../redux/selectors/consultasSelectors'
import { selectHorariosDisponiveis, selectHorariosError, selectHorariosLoading } from '../redux/selectors/horariosSelectors'
import { formatDate, formatLongDate, formatTime, initials, todayIso } from '../utils/formatters'

type Filter = 'todas' | 'hoje' | 'proximas'

export function AgendaPage() {
  const dispatch = useAppDispatch()
  const consultas = useAppSelector(selectConsultas)
  const loading = useAppSelector(selectConsultasLoading)
  const error = useAppSelector(selectConsultasError)
  const horarios = useAppSelector(selectHorariosDisponiveis)
  const horariosLoading = useAppSelector(selectHorariosLoading)
  const horariosError = useAppSelector(selectHorariosError)
  const cancelingId = useAppSelector(selectConsultaCancelingId)
  const cancelError = useAppSelector(selectConsultaCancelError)
  const reschedulingId = useAppSelector(selectConsultaReschedulingId)
  const rescheduleError = useAppSelector(selectConsultaRescheduleError)
  const mutationSuccess = useAppSelector(selectConsultaMutationSuccess)
  const [filter, setFilter] = useState<Filter>('todas')
  const [rescheduleTarget, setRescheduleTarget] = useState<Consulta | null>(null)
  const [cancelTarget, setCancelTarget] = useState<Consulta | null>(null)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')

  useEffect(() => {
    dispatch(fetchConsultas())
    return () => { dispatch(limparHorarios()); dispatch(resetConsultaMutation()) }
  }, [dispatch])

  const today = todayIso()
  const ordered = useMemo(() => [...consultas]
    .filter((item) => filter === 'todas' || (filter === 'hoje'
      ? item.data_hora_inicio.slice(0, 10) === today
      : item.status === 'agendada' && item.data_hora_inicio.slice(0, 10) > today))
    .sort((a, b) => a.data_hora_inicio.localeCompare(b.data_hora_inicio)), [consultas, filter, today])
  const todayCount = consultas.filter((item) => item.status === 'agendada' && item.data_hora_inicio.slice(0, 10) === today).length
  const upcomingCount = consultas.filter((item) => item.status === 'agendada' && item.data_hora_inicio.slice(0, 10) > today).length
  const patientCount = new Set(consultas.map((item) => item.paciente_id)).size

  const openReschedule = (consulta: Consulta) => {
    dispatch(resetConsultaMutation())
    dispatch(limparHorarios())
    setNewDate('')
    setNewTime('')
    setRescheduleTarget(consulta)
  }
  const closeReschedule = () => {
    if (reschedulingId) return
    setRescheduleTarget(null)
    setNewDate('')
    setNewTime('')
    dispatch(limparHorarios())
    if (rescheduleError) dispatch(resetConsultaMutation())
  }
  const chooseRescheduleDate = (value: string) => {
    setNewDate(value)
    setNewTime('')
    dispatch(limparHorarios())
    if (rescheduleTarget && value) {
      dispatch(fetchHorarios(rescheduleTarget.dentista_id, rescheduleTarget.procedimento_id, value))
    }
  }
  const confirmReschedule = async () => {
    if (!rescheduleTarget || !newDate || !newTime) return
    const ok = await dispatch(remarcarConsulta(rescheduleTarget.id, newDate, newTime))
    if (ok) {
      setRescheduleTarget(null)
      setNewDate('')
      setNewTime('')
      dispatch(limparHorarios())
    }
  }
  const openCancel = (consulta: Consulta) => {
    dispatch(resetConsultaMutation())
    setCancelTarget(consulta)
  }
  const closeCancel = () => {
    if (cancelingId) return
    setCancelTarget(null)
    if (cancelError) dispatch(resetConsultaMutation())
  }
  const confirmCancel = async () => {
    if (!cancelTarget) return
    const ok = await dispatch(cancelarConsulta(cancelTarget.id))
    if (ok) setCancelTarget(null)
  }

  return <div className="page">
    <PageHeader eyebrow="VISÃO GERAL" title="Agenda da clínica" description="Acompanhe os atendimentos e mantenha o dia sob controle."
      action={<Link className="button button--primary" to="/nova-consulta"><Plus size={18} /> Nova consulta</Link>} />

    <section className="stats-grid" aria-label="Resumo da agenda">
      <div className="stat-card"><span className="stat-card__icon mint"><CalendarCheck2 /></span><div><span>Consultas hoje</span><strong>{loading ? '—' : todayCount}</strong></div><small>atendimentos</small></div>
      <div className="stat-card"><span className="stat-card__icon amber"><CalendarDays /></span><div><span>Próximas consultas</span><strong>{loading ? '—' : upcomingCount}</strong></div><small>agendadas</small></div>
      <div className="stat-card"><span className="stat-card__icon blue"><UserRound /></span><div><span>Pacientes na agenda</span><strong>{loading ? '—' : patientCount}</strong></div><small>únicos</small></div>
    </section>

    <section className="panel agenda-panel">
      <div className="panel__header">
        <div><h2>Consultas</h2><p>{ordered.length} {ordered.length === 1 ? 'atendimento' : 'atendimentos'} nesta visualização</p></div>
        <div className="segmented" aria-label="Filtrar consultas">
          {(['todas', 'hoje', 'proximas'] as Filter[]).map((item) => <button key={item} onClick={() => setFilter(item)} className={filter === item ? 'active' : ''}>{item === 'proximas' ? 'Próximas' : item[0].toUpperCase() + item.slice(1)}</button>)}
        </div>
      </div>
      {loading ? <StateView type="loading" /> : error ? <StateView type="error" message={error} onRetry={() => dispatch(fetchConsultas())} /> : ordered.length === 0 ?
        <StateView type="empty" title="Agenda livre por aqui" message="Não existem consultas para o período selecionado." /> :
        <div className="table-wrap"><table className="data-table"><thead><tr><th>Data e hora</th><th>Paciente</th><th>Profissional</th><th>Procedimento</th><th>Status</th><th className="actions-column">Ações</th></tr></thead>
          <tbody>{ordered.map((consulta) => {
            const hasOccurred = new Date(consulta.data_hora_fim) < new Date()
            const canManage = consulta.status === 'agendada' && !hasOccurred
            const displayStatus = consulta.status === 'agendada' ? (hasOccurred ? 'Já ocorreu' : 'Agendada') : consulta.status
            const statusClass = consulta.status === 'agendada' ? (hasOccurred ? 'past' : 'upcoming') : consulta.status.toLowerCase()
            return <tr key={consulta.id} className={canManage ? 'appointment--upcoming' : 'appointment--past'}>
            <td><div className="date-cell"><strong>{formatDate(consulta.data_hora_inicio)}</strong><span><Clock3 size={14} />{formatTime(consulta.data_hora_inicio)} – {formatTime(consulta.data_hora_fim)}</span></div></td>
            <td><div className="person-cell"><span className="avatar avatar--patient">{initials(consulta.paciente_nome)}</span><strong>{consulta.paciente_nome}</strong></div></td>
            <td><div className="person-cell"><span className="avatar">{initials(consulta.dentista_nome)}</span><span>{consulta.dentista_nome}</span></div></td>
            <td>{consulta.procedimento_nome}</td>
            <td><span className={`status status--${statusClass}`}>{displayStatus}</span></td>
            <td><div className="row-actions">
              <button className="table-action" onClick={() => openReschedule(consulta)} disabled={!canManage} title={canManage ? 'Remarcar consulta' : 'Esta consulta não pode ser remarcada'}><CalendarClock size={15} /> Remarcar</button>
              <button className="table-action table-action--danger" onClick={() => openCancel(consulta)} disabled={!canManage} title={canManage ? 'Cancelar consulta' : 'Esta consulta não pode ser cancelada'}><XCircle size={15} /> Cancelar</button>
            </div></td>
          </tr>
          })}</tbody></table></div>}
    </section>

    <Modal open={Boolean(rescheduleTarget)} title="Remarcar consulta" onClose={closeReschedule} actions={<>
      <button className="button button--secondary" onClick={closeReschedule} disabled={Boolean(reschedulingId)}>Voltar</button>
      <button className="button button--primary" onClick={confirmReschedule} disabled={!newDate || !newTime || Boolean(reschedulingId)}>
        {reschedulingId ? <><span className="button-spinner" /> Remarcando…</> : 'Confirmar remarcação'}
      </button>
    </>}>
      {rescheduleTarget && <>
        <p className="modal-intro">Escolha uma nova data e um dos horários disponibilizados pela clínica.</p>
        <div className="appointment-details">
          <div><span>Paciente</span><strong>{rescheduleTarget.paciente_nome}</strong></div>
          <div><span>Procedimento</span><strong>{rescheduleTarget.procedimento_nome}</strong></div>
          <div><span>Dentista</span><strong>{rescheduleTarget.dentista_nome}</strong></div>
          <div><span>Horário atual</span><strong>{formatDate(rescheduleTarget.data_hora_inicio)}, às {formatTime(rescheduleTarget.data_hora_inicio)}</strong></div>
        </div>
        <label className="form-field reschedule-date"><span>Nova data</span><input type="date" min={todayIso()} value={newDate} onChange={(event) => chooseRescheduleDate(event.target.value)} /></label>
        {newDate && <div className="time-area"><span className="field-label">Horários disponíveis em {formatLongDate(newDate)}</span>
          {horariosLoading ? <StateView type="loading" compact /> : horariosError ? <StateView type="error" compact message={horariosError} onRetry={() => chooseRescheduleDate(newDate)} /> : horarios.length === 0 ? <StateView type="empty" compact title="Sem horários nesta data" message="Escolha outra data para continuar." /> :
            <div className="time-grid">{horarios.map((horario) => <button key={horario} type="button" className={newTime === horario ? 'selected' : ''} onClick={() => setNewTime(horario)}><Clock3 size={15} />{horario}</button>)}</div>}
        </div>}
        {rescheduleError && <div className="inline-error">{rescheduleError}</div>}
      </>}
    </Modal>

    <Modal open={Boolean(cancelTarget)} title="Cancelar consulta" onClose={closeCancel} actions={<>
      <button className="button button--secondary" onClick={closeCancel} disabled={Boolean(cancelingId)}>Manter consulta</button>
      <button className="button button--danger" onClick={confirmCancel} disabled={Boolean(cancelingId)}>
        {cancelingId ? <><span className="button-spinner" /> Cancelando…</> : 'Sim, cancelar'}
      </button>
    </>}>
      {cancelTarget && <>
        <p className="modal-intro">Esta ação cancelará o atendimento abaixo. Deseja continuar?</p>
        <div className="appointment-details appointment-details--cancel">
          <div><span>Paciente</span><strong>{cancelTarget.paciente_nome}</strong></div>
          <div><span>Consulta</span><strong>{cancelTarget.procedimento_nome}</strong></div>
          <div><span>Data e horário</span><strong>{formatDate(cancelTarget.data_hora_inicio)}, às {formatTime(cancelTarget.data_hora_inicio)}</strong></div>
        </div>
        {cancelError && <div className="inline-error">{cancelError}</div>}
      </>}
    </Modal>

    {mutationSuccess && <Toast message={mutationSuccess} onClose={() => dispatch(resetConsultaMutation())} />}
  </div>
}
