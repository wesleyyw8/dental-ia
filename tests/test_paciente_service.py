import unittest
from unittest.mock import patch

from app.services.paciente_service import editar_paciente, excluir_paciente_por_id


class PacienteServiceTestCase(unittest.TestCase):
    @patch("app.services.paciente_service.atualizar_paciente")
    @patch("app.services.paciente_service.buscar_paciente_por_email")
    @patch("app.services.paciente_service.buscar_paciente_por_telefone")
    def test_edita_paciente_quando_dados_sao_unicos(
        self,
        buscar_paciente_por_telefone,
        buscar_paciente_por_email,
        atualizar_paciente,
    ):
        buscar_paciente_por_telefone.return_value = None
        buscar_paciente_por_email.return_value = None
        atualizar_paciente.return_value = {
            "id": 3,
            "nome": "Maria Oliveira",
            "telefone": "5511999990000",
            "email": "maria@email.com",
        }

        resultado = editar_paciente(
            3,
            "Maria Oliveira",
            "11999990000",
            "maria@email.com",
        )

        self.assertEqual(resultado["id"], 3)
        buscar_paciente_por_telefone.assert_called_once_with(
            "11999990000", ignorar_id=3
        )
        buscar_paciente_por_email.assert_called_once_with(
            "maria@email.com", ignorar_id=3
        )
        atualizar_paciente.assert_called_once()

    @patch("app.services.paciente_service.excluir_paciente")
    @patch("app.services.paciente_service.paciente_possui_consultas")
    def test_impede_exclusao_quando_paciente_possui_consultas(
        self, paciente_possui_consultas, excluir_paciente
    ):
        paciente_possui_consultas.return_value = True

        resultado = excluir_paciente_por_id(3)

        self.assertEqual(
            resultado,
            {
                "erro": (
                    "Este paciente possui consultas vinculadas. Confirme a "
                    "exclusão das consultas para continuar"
                )
            },
        )
        excluir_paciente.assert_not_called()

    @patch("app.services.paciente_service.excluir_paciente")
    @patch("app.services.paciente_service.paciente_possui_consultas")
    def test_exclui_paciente_sem_consultas(
        self, paciente_possui_consultas, excluir_paciente
    ):
        paciente_possui_consultas.return_value = False
        excluir_paciente.return_value = {"id": 3, "consultas_excluidas": 0}

        resultado = excluir_paciente_por_id(3)

        self.assertEqual(
            resultado,
            {
                "mensagem": "Paciente excluído com sucesso",
                "paciente_id": 3,
                "consultas_excluidas": 0,
            },
        )
        excluir_paciente.assert_called_once_with(3, excluir_consultas=False)

    @patch("app.services.paciente_service.excluir_paciente")
    @patch("app.services.paciente_service.paciente_possui_consultas")
    def test_exclui_paciente_e_consultas_quando_confirmado(
        self, paciente_possui_consultas, excluir_paciente
    ):
        paciente_possui_consultas.return_value = True
        excluir_paciente.return_value = {"id": 3, "consultas_excluidas": 4}

        resultado = excluir_paciente_por_id(3, excluir_consultas=True)

        self.assertEqual(resultado["consultas_excluidas"], 4)
        excluir_paciente.assert_called_once_with(3, excluir_consultas=True)


if __name__ == "__main__":
    unittest.main()
