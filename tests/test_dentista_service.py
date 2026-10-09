import unittest
from unittest.mock import patch

from app.services.dentista_service import cadastrar_dentista, editar_dentista


class DentistaServiceTestCase(unittest.TestCase):
    @patch("app.services.dentista_service.criar_dentista")
    @patch("app.services.dentista_service.buscar_dentista_por_email")
    def test_cadastro_normaliza_ids_repetidos(
        self, buscar_dentista_por_email, criar_dentista
    ):
        buscar_dentista_por_email.return_value = None
        criar_dentista.return_value = {"id": 3}

        resultado = cadastrar_dentista(
            "Dra. Maria",
            "Dentística",
            "11999990000",
            "maria@dentalai.com",
            [6, 1, 6],
        )

        self.assertEqual(resultado, {"id": 3})
        criar_dentista.assert_called_once_with(
            "Dra. Maria",
            "Dentística",
            "11999990000",
            "maria@dentalai.com",
            [1, 6],
        )

    @patch("app.services.dentista_service.atualizar_dentista")
    @patch("app.services.dentista_service.buscar_dentista_por_email")
    def test_edicao_exige_ao_menos_um_procedimento(
        self, buscar_dentista_por_email, atualizar_dentista
    ):
        resultado = editar_dentista(
            3,
            "Dra. Maria",
            "Dentística",
            "11999990000",
            "maria@dentalai.com",
            [],
        )

        self.assertEqual(resultado, {"erro": "Selecione pelo menos um procedimento"})
        buscar_dentista_por_email.assert_not_called()
        atualizar_dentista.assert_not_called()


if __name__ == "__main__":
    unittest.main()
