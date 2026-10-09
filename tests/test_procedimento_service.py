import unittest
from unittest.mock import patch

from app.services.procedimento_service import buscar_procedimentos_disponiveis


class ProcedimentoServiceTestCase(unittest.TestCase):
    @patch("app.services.procedimento_service.listar_procedimentos")
    def test_lista_para_agendamento_apenas_procedimentos_disponiveis(
        self, listar_procedimentos
    ):
        listar_procedimentos.return_value = [
            {"id": 1, "nome": "Avaliação", "disponivel": True},
            {"id": 6, "nome": "Restauração", "disponivel": False},
        ]

        resultado = buscar_procedimentos_disponiveis()

        self.assertEqual(resultado, [listar_procedimentos.return_value[0]])


if __name__ == "__main__":
    unittest.main()
