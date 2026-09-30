import { CalendarCheck2, CalendarDays, Clock3, Plus, UserRound } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { StateView } from '../components/StateView'
import { fetchConsultas } from '../redux/actions/consultasActions'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { selectConsultas, selectConsultasError, selectConsultasLoading } from '../redux/selectors/consultasSelectors'
import { formatDate, formatTime, initials, todayIso } from '../utils/formatters'

type Filter = 'todas' | 'hoje' | 'proximas'

export function AgendaPage() {
  const dispatch = useAppDispatch()
  const consultas = useAppSelector(selectConsultas)
  const loading = useAppSelector(selectConsultasLoading)
  const error = useAppSelector(selectConsultasError)
  const [filter, setFilter] = useState<Filter>('todas')

  useEffect(() => { dispatch(fetchConsultas()) }, [dispatch])

  const today = todayIso()
  const ordered = useMemo(() => [...consultas]
    .filter((item) => filter === 'todas' || (filter === 'hoje' ? item.data_hora_inicio.slice(0, 10) === today : item.data_hora_inicio.slice(0, 10) > today))
    .sort((a, b) => a.data_hora_inicio.localeCompare(b.data_hora_inicio)), [consultas, filter, today])
  const todayCount = consultas.filter((item) => item.data_hora_inicio.slice(0, 10) === today).length
  const upcomingCount = consultas.filter((item) => item.data_hora_inicio.slice(0, 10) > today).length
  const patientCount = new Set(consultas.map((item) => item.paciente_id)).size

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
        <div className="table-wrap"><table className="data-table"><thead><tr><th>Data e hora</th><th>Paciente</th><th>Profissional</th><th>Procedimento</th><th>Status</th></tr></thead>
          <tbody>{ordered.map((consulta) => {
            const hasOccurred = new Date(consulta.data_hora_fim) < new Date()
            const displayStatus = consulta.status === 'agendada' ? (hasOccurred ? 'Já ocorreu' : 'Agendada') : consulta.status
            const statusClass = consulta.status === 'agendada' ? (hasOccurred ? 'past' : 'upcoming') : consulta.status.toLowerCase()
            return <tr key={consulta.id} className={hasOccurred ? 'appointment--past' : 'appointment--upcoming'}>
            <td><div className="date-cell"><strong>{formatDate(consulta.data_hora_inicio)}</strong><span><Clock3 size={14} />{formatTime(consulta.data_hora_inicio)} – {formatTime(consulta.data_hora_fim)}</span></div></td>
            <td><div className="person-cell"><span className="avatar avatar--patient">{initials(consulta.paciente_nome)}</span><strong>{consulta.paciente_nome}</strong></div></td>
            <td><div className="person-cell"><span className="avatar">{initials(consulta.dentista_nome)}</span><span>{consulta.dentista_nome}</span></div></td>
            <td>{consulta.procedimento_nome}</td>
            <td><span className={`status status--${statusClass}`}>{displayStatus}</span></td>
          </tr>
          })}</tbody></table></div>}
    </section>
  </div>
}
