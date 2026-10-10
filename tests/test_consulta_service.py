import unittest
from unittest.mock import patch

from app.services.consulta_service import cancelar_consulta_por_id


class CancelarConsultaServiceTestCase(unittest.TestCase):
    @patch("app.services.consulta_service.cancelar_consulta")
    def test_cancela_consulta_apenas_uma_vez(self, cancelar_consulta):
        cancelar_consulta.return_value = {"id": 42}

        resultado = cancelar_consulta_por_id(42)

        self.assertEqual(
            resultado,
            {
                "mensagem": "Consulta cancelada com sucesso",
                "consulta_id": 42,
            },
        )
        cancelar_consulta.assert_called_once_with(42)

    @patch("app.services.consulta_service.cancelar_consulta")
    def test_retorna_erro_quando_consulta_nao_pode_ser_cancelada(
        self, cancelar_consulta
    ):
        cancelar_consulta.return_value = None

        resultado = cancelar_consulta_por_id(42)

        self.assertEqual(
            resultado,
            {"erro": "Consulta não encontrada ou já está cancelada"},
        )
        cancelar_consulta.assert_called_once_with(42)


if __name__ == "__main__":
    unittest.main()
