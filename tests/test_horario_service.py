import unittest
from unittest.mock import patch

from app.services.horario_service import buscar_horarios


class BuscarHorariosTestCase(unittest.TestCase):
    @patch("app.services.horario_service.dentista_realiza_procedimento")
    def test_rejeita_atendimento_no_fim_de_semana(
        self, dentista_realiza_procedimento
    ):
        for data in ("2026-10-10", "2026-10-11"):
            with self.subTest(data=data):
                resultado = buscar_horarios(
                    dentista_id=1,
                    procedimento_id=1,
                    data=data,
                )

                self.assertEqual(
                    resultado,
                    {
                        "erro": (
                            "A clínica não realiza atendimentos aos finais de semana"
                        )
                    },
                )

        dentista_realiza_procedimento.assert_not_called()


if __name__ == "__main__":
    unittest.main()
