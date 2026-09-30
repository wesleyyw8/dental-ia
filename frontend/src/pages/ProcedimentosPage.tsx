import { Clock3, Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { PageHeader } from '../components/PageHeader'
import { StateView } from '../components/StateView'
import { fetchProcedimentos } from '../redux/actions/procedimentosActions'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { selectProcedimentos, selectProcedimentosError, selectProcedimentosLoading } from '../redux/selectors/procedimentosSelectors'
import { formatCurrency } from '../utils/formatters'

export function ProcedimentosPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectProcedimentos)
  const loading = useAppSelector(selectProcedimentosLoading)
  const error = useAppSelector(selectProcedimentosError)
  useEffect(() => { dispatch(fetchProcedimentos()) }, [dispatch])

  return <div className="page">
    <PageHeader eyebrow="CATÁLOGO" title="Procedimentos" description="Conheça os tratamentos disponíveis na clínica." />
    {loading ? <StateView type="loading" /> : error ? <StateView type="error" message={error} onRetry={() => dispatch(fetchProcedimentos())} /> : items.length === 0 ? <StateView type="empty" message="Nenhum procedimento ativo foi retornado pela API." /> :
      <div className="procedure-grid">{items.map((item, index) => <article className="procedure-card" key={item.id}>
        <div className={`procedure-card__visual procedure-card__visual--${index % 4}`}><Sparkles size={25} /><span>{String(index + 1).padStart(2, '0')}</span></div>
        <div className="procedure-card__body"><span className="status status--active">Disponível</span><h2>{item.nome}</h2><p>{item.descricao}</p><div className="procedure-card__footer"><span><Clock3 size={16} />{item.duracao_minutos} min</span><strong>{formatCurrency(item.preco)}</strong></div></div>
      </article>)}</div>}
  </div>
}
