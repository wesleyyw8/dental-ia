import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AgendaPage } from './pages/AgendaPage'
import { NovaConsultaPage } from './pages/NovaConsultaPage'
import { PacientesPage } from './pages/PacientesPage'
import { ProcedimentosPage } from './pages/ProcedimentosPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<AgendaPage />} />
          <Route path="/nova-consulta" element={<NovaConsultaPage />} />
          <Route path="/pacientes" element={<PacientesPage />} />
          <Route path="/procedimentos" element={<ProcedimentosPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
