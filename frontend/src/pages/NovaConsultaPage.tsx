import { CalendarDays, Check, ChevronRight, Clock3, Stethoscope, UserRound, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { StateView } from '../components/StateView'
import { Toast } from '../components/Toast'
import { criarConsulta, resetCriarConsulta } from '../redux/actions/consultasActions'
import { fetchDentistas, limparDentistas } from '../redux/actions/dentistasActions'
import { fetchHorarios, limparHorarios } from '../redux/actions/horariosActions'
import { fetchPacientes } from '../redux/actions/pacientesActions'
import { fetchProcedimentos } from '../redux/actions/procedimentosActions'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { selectConsultaCreateError, selectConsultaCreated, selectConsultaCreating } from '../redux/selectors/consultasSelectors'
import { selectDentistas, selectDentistasError, selectDentistasLoading } from '../redux/selectors/dentistasSelectors'
import { selectHorariosDisponiveis, selectHorariosError, selectHorariosLoading } from '../redux/selectors/horariosSelectors'
import { selectPacientes, selectPacientesError, selectPacientesLoading } from '../redux/selectors/pacientesSelectors'
import { selectProcedimentos, selectProcedimentosError, selectProcedimentosLoading } from '../redux/selectors/procedimentosSelectors'
import { formatCurrency, formatLongDate, initials, todayIso } from '../utils/formatters'

export function NovaConsultaPage() {
  const dispatch = useAppDispatch()
  const procedimentos = useAppSelector(selectProcedimentos)
  const procedimentosLoading = useAppSelector(selectProcedimentosLoading)
  const procedimentosError = useAppSelector(selectProcedimentosError)
  const dentistas = useAppSelector(selectDentistas)
  const dentistasLoading = useAppSelector(selectDentistasLoading)
  const dentistasError = useAppSelector(selectDentistasError)
  const pacientes = useAppSelector(selectPacientes)
  const pacientesLoading = useAppSelector(selectPacientesLoading)
  const pacientesError = useAppSelector(selectPacientesError)
  const horarios = useAppSelector(selectHorariosDisponiveis)
  const horariosLoading = useAppSelector(selectHorariosLoading)
  const horariosError = useAppSelector(selectHorariosError)
  const creating = useAppSelector(selectConsultaCreating)
  const createError = useAppSelector(selectConsultaCreateError)
  const created = useAppSelector(selectConsultaCreated)

  const [procedimentoId, setProcedimentoId] = useState<number | null>(null)
  const [dentistaId, setDentistaId] = useState<number | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [pacienteId, setPacienteId] = useState<number | null>(null)
  const [patientQuery, setPatientQuery] = useState('')
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    dispatch(fetchProcedimentos())
    dispatch(fetchPacientes())
    return () => { dispatch(limparDentistas()); dispatch(limparHorarios()); dispatch(resetCriarConsulta()) }
  }, [dispatch])

  const procedimento = procedimentos.find((item) => item.id === procedimentoId)
  const dentista = dentistas.find((item) => item.id === dentistaId)
  const paciente = pacientes.find((item) => item.id === pacienteId)
  const filteredPatients = useMemo(() => {
    const term = patientQuery.trim().toLowerCase()
    if (!term) return pacientes
    return pacientes.filter((item) => item.nome.toLowerCase().includes(term) || item.telefone.includes(term.replace(/\D/g, '')))
  }, [pacientes, patientQuery])
  const complete = Boolean(procedimentoId && dentistaId && date && time && pacienteId)

  const chooseProcedure = (id: number) => {
    setProcedimentoId(id); setDentistaId(null); setDate(''); setTime(''); setPacienteId(null)
    dispatch(limparHorarios()); dispatch(fetchDentistas(id)); dispatch(resetCriarConsulta())
  }
  const chooseDentist = (id: number) => {
    setDentistaId(id); setDate(''); setTime(''); setPacienteId(null); dispatch(limparHorarios())
  }
  const chooseDate = (value: string) => {
    setDate(value); setTime(''); setPacienteId(null); dispatch(limparHorarios())
    if (dentistaId && procedimentoId && value) dispatch(fetchHorarios(dentistaId, procedimentoId, value))
  }
  const submit = async () => {
    if (!complete || !pacienteId || !dentistaId || !procedimentoId) return
    const ok = await dispatch(criarConsulta({ paciente_id: pacienteId, dentista_id: dentistaId, procedimento_id: procedimentoId, data: date, horario: time }))
    if (ok) setConfirming(false)
  }
  const reset = () => {
    setProcedimentoId(null); setDentistaId(null); setDate(''); setTime(''); setPacienteId(null); setPatientQuery('')
    dispatch(limparDentistas()); dispatch(limparHorarios()); dispatch(resetCriarConsulta())
  }

  return <div className="page booking-page">
    <PageHeader eyebrow="AGENDAMENTO" title="Nova consulta" description="Siga as etapas para encontrar o melhor horário." />
    <div className="booking-layout">
      <div className="booking-form">
        <BookingSection number="01" icon={<Stethoscope />} title="Escolha o procedimento" active>
          {procedimentosLoading ? <StateView type="loading" compact /> : procedimentosError ? <StateView type="error" compact message={procedimentosError} onRetry={() => dispatch(fetchProcedimentos())} /> :
            <div className="choice-grid choice-grid--procedures">{procedimentos.map((item) => <button key={item.id} className={`choice-card ${procedimentoId === item.id ? 'selected' : ''}`} onClick={() => chooseProcedure(item.id)}>
              <span className="choice-card__check"><Check size={14} /></span><strong>{item.nome}</strong><small>{item.duracao_minutos} min</small><span>{formatCurrency(item.preco)}</span>
            </button>)}</div>}
        </BookingSection>

        <BookingSection number="02" icon={<Users />} title="Escolha o dentista" active={Boolean(procedimentoId)} locked={!procedimentoId}>
          {dentistasLoading ? <StateView type="loading" compact /> : dentistasError ? <StateView type="error" compact message={dentistasError} onRetry={() => procedimentoId && dispatch(fetchDentistas(procedimentoId))} /> : dentistas.length === 0 ? <StateView type="empty" compact title="Nenhum profissional disponível" message="Não há dentistas vinculados a este procedimento." /> :
            <div className="choice-grid">{dentistas.map((item) => <button key={item.id} className={`choice-card choice-card--person ${dentistaId === item.id ? 'selected' : ''}`} onClick={() => chooseDentist(item.id)}>
              <span className="avatar">{initials(item.nome)}</span><span><strong>{item.nome}</strong><small>{item.especialidade}</small></span><span className="choice-card__check"><Check size={14} /></span>
            </button>)}</div>}
        </BookingSection>

        <BookingSection number="03" icon={<CalendarDays />} title="Data e horário" active={Boolean(dentistaId)} locked={!dentistaId}>
          <label className="field"><span>Data da consulta</span><input type="date" min={todayIso()} value={date} onChange={(event) => chooseDate(event.target.value)} /></label>
          {date && <div className="time-area"><span className="field-label">Horários disponíveis</span>
            {horariosLoading ? <StateView type="loading" compact /> : horariosError ? <StateView type="error" compact message={horariosError} onRetry={() => dentistaId && procedimentoId && dispatch(fetchHorarios(dentistaId, procedimentoId, date))} /> : horarios.length === 0 ? <StateView type="empty" compact title="Sem horários nesta data" message="Escolha outra data para continuar." /> :
              <div className="time-grid">{horarios.map((item) => <button key={item} className={time === item ? 'selected' : ''} onClick={() => { setTime(item); setPacienteId(null) }}><Clock3 size={15} />{item}</button>)}</div>}
          </div>}
        </BookingSection>

        <BookingSection number="04" icon={<UserRound />} title="Selecione o paciente" active={Boolean(time)} locked={!time}>
          <input className="patient-filter" placeholder="Buscar por nome ou telefone" value={patientQuery} onChange={(event) => setPatientQuery(event.target.value)} />
          {pacientesLoading ? <StateView type="loading" compact /> : pacientesError ? <StateView type="error" compact message={pacientesError} onRetry={() => dispatch(fetchPacientes())} /> : filteredPatients.length === 0 ? <StateView type="empty" compact title="Nenhum paciente encontrado" /> :
            <div className="patient-select-list">{filteredPatients.map((item) => <button key={item.id} onClick={() => setPacienteId(item.id)} className={pacienteId === item.id ? 'selected' : ''}><span className="avatar avatar--patient">{initials(item.nome)}</span><span><strong>{item.nome}</strong><small>{item.telefone}</small></span><span className="radio-dot" /></button>)}</div>}
        </BookingSection>
      </div>

      <aside className="booking-summary">
        <span className="eyebrow">RESUMO</span><h2>Sua consulta</h2>
        <div className="summary-list">
          <SummaryItem icon={<Stethoscope />} label="Procedimento" value={procedimento?.nome} />
          <SummaryItem icon={<Users />} label="Dentista" value={dentista?.nome} />
          <SummaryItem icon={<CalendarDays />} label="Data" value={date ? formatLongDate(date) : undefined} />
          <SummaryItem icon={<Clock3 />} label="Horário" value={time || undefined} />
          <SummaryItem icon={<UserRound />} label="Paciente" value={paciente?.nome} />
        </div>
        {procedimento && <div className="summary-total"><span>Valor do procedimento</span><strong>{formatCurrency(procedimento.preco)}</strong></div>}
        <button className="button button--primary button--wide" disabled={!complete || creating} onClick={() => { dispatch(resetCriarConsulta()); setConfirming(true) }}>Revisar e confirmar <ChevronRight size={18} /></button>
        {!complete && <p className="summary-hint">Preencha todas as etapas para continuar.</p>}
      </aside>
    </div>

    <Modal open={confirming} title="Confirmar agendamento" onClose={() => !creating && setConfirming(false)} actions={<><button className="button button--secondary" onClick={() => setConfirming(false)} disabled={creating}>Voltar</button><button className="button button--primary" onClick={submit} disabled={creating}>{creating ? <><span className="button-spinner" /> Agendando…</> : 'Confirmar consulta'}</button></>}>
      <p className="modal-intro">Confira os dados antes de criar a consulta.</p>
      <div className="confirmation-card"><div><span>Paciente</span><strong>{paciente?.nome}</strong></div><div><span>Procedimento</span><strong>{procedimento?.nome}</strong></div><div><span>Profissional</span><strong>{dentista?.nome}</strong></div><div><span>Data e horário</span><strong>{date && formatLongDate(date)}, às {time}</strong></div></div>
      {createError && <div className="inline-error">{createError}</div>}
    </Modal>
    {created && <Toast message="Consulta agendada com sucesso!" onClose={() => dispatch(resetCriarConsulta())} />}
    {created && <div className="success-banner"><div><Check size={22} /><span><strong>Agendamento concluído</strong><small>A agenda já foi atualizada com a nova consulta.</small></span></div><div><button className="button button--secondary" onClick={reset}>Agendar outra</button><Link className="button button--primary" to="/">Ver agenda</Link></div></div>}
  </div>
}

function BookingSection({ number, icon, title, active, locked = false, children }: { number: string; icon: React.ReactNode; title: string; active: boolean; locked?: boolean; children: React.ReactNode }) {
  return <section className={`booking-section ${active ? 'active' : ''} ${locked ? 'locked' : ''}`}><div className="booking-section__heading"><span>{active ? icon : number}</span><h2>{title}</h2>{locked && <small>Complete a etapa anterior</small>}</div>{!locked && <div className="booking-section__content">{children}</div>}</section>
}

function SummaryItem({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return <div className={`summary-item ${value ? 'filled' : ''}`}><span>{icon}</span><div><small>{label}</small><strong>{value ?? 'A definir'}</strong></div></div>
}
