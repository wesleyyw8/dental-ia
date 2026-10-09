import unittest
from unittest.mock import patch

from app.services.consulta_service import agendar_consulta


class ConsultaServiceTestCase(unittest.TestCase):

    @patch("app.services.consulta_service.criar_consulta")
    @patch("app.services.consulta_service.buscar_horarios")
    @patch("app.services.consulta_service.buscar_procedimento_por_id")
    def test_agendar_consulta(
        self,
        buscar_procedimento_por_id,
        buscar_horarios,
        criar_consulta,
    ):
        buscar_procedimento_por_id.return_value = {
            "id": 1,
            "duracao_minutos": 60,
        }

        buscar_horarios.return_value = {
            "horarios_disponiveis": ["14:00", "15:00"]
        }

        criar_consulta.return_value = {"id": 123}

        resultado = agendar_consulta(
            paciente_id=10,
            dentista_id=2,
            procedimento_id=1,
            data="2026-10-12",
            horario="14:00",
        )

        self.assertEqual(resultado, {"id": 123})

        criar_consulta.assert_called_once()

        args = criar_consulta.call_args.args

        self.assertEqual(args[0], 10)
        self.assertEqual(args[1], 2)
        self.assertEqual(args[2], 1)


    @patch("app.services.consulta_service.criar_consulta")
    @patch("app.services.consulta_service.buscar_horarios")
    @patch("app.services.consulta_service.buscar_procedimento_por_id")
    def test_agendar_consulta_horario_indisponivel(
        self,
        buscar_procedimento_por_id,
        buscar_horarios,
        criar_consulta,
    ):
        buscar_procedimento_por_id.return_value = {
            "id": 1,
            "duracao_minutos": 60,
        }

        buscar_horarios.return_value = {
            "horarios_disponiveis": ["14:00", "15:00"]
        }

        resultado = agendar_consulta(
            paciente_id=10,
            dentista_id=2,
            procedimento_id=1,
            data="2026-10-12",
            horario="16:00",
        )

        self.assertEqual(
            resultado,
            {"erro": "Horário não disponível"},
        )

        criar_consulta.assert_not_called()

if __name__ == "__main__":
    unittest.main()