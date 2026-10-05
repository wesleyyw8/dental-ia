import unittest
from unittest.mock import patch

from app.services.whatsapp_ura_service import (
    ETAPA_MENU,
    ETAPA_PROCEDIMENTO,
    conversas,
    processar_mensagem,
)


class WhatsAppUraServiceTest(unittest.TestCase):
    def setUp(self):
        conversas.clear()
        self.numero = "5511999990000"

    @patch("app.services.whatsapp_ura_service.enviar_mensagem")
    def test_primeira_mensagem_exibe_menu_principal(self, enviar_mensagem):
        processar_mensagem(self.numero, "Olá")

        resposta = enviar_mensagem.call_args.args[1]
        self.assertIn("1 - Agendar consulta", resposta)
        self.assertIn("2 - Remarcar consulta", resposta)
        self.assertIn("3 - Cancelar consulta", resposta)
        self.assertEqual(conversas[self.numero]["etapa"], ETAPA_MENU)

    @patch("app.services.whatsapp_ura_service.enviar_mensagem")
    @patch("app.services.whatsapp_ura_service.agendar_consulta")
    @patch("app.services.whatsapp_ura_service.buscar_horarios")
    @patch("app.services.whatsapp_ura_service.buscar_dentistas")
    @patch("app.services.whatsapp_ura_service.buscar_procedimentos")
    @patch("app.services.whatsapp_ura_service.buscar_pacientes")
    def test_fluxo_completo_converte_opcoes_para_ids_reais(
        self,
        buscar_pacientes,
        buscar_procedimentos,
        buscar_dentistas,
        buscar_horarios,
        agendar_consulta,
        enviar_mensagem,
    ):
        buscar_pacientes.return_value = {"id": 20, "nome": "Maria"}
        buscar_procedimentos.return_value = [
            {"id": 1, "nome": "Avaliação"},
            {"id": 5, "nome": "Instalação de aparelho"},
        ]
        buscar_dentistas.return_value = [
            {"id": 9, "nome": "Dra. Maria"},
        ]
        buscar_horarios.return_value = {"horarios_disponiveis": ["14:00", "14:30"]}
        agendar_consulta.return_value = {"id": 77}

        processar_mensagem(self.numero, "Olá")
        processar_mensagem(self.numero, "1")
        processar_mensagem(self.numero, "2")
        processar_mensagem(self.numero, "1")
        processar_mensagem(self.numero, "31/12/2099")
        processar_mensagem(self.numero, "2")
        processar_mensagem(self.numero, "1")

        buscar_dentistas.assert_called_once_with(5)
        buscar_horarios.assert_called_once_with(9, 5, "2099-12-31")
        agendar_consulta.assert_called_once_with(
            20,
            9,
            5,
            "2099-12-31",
            "14:30",
        )
        self.assertEqual(conversas[self.numero]["etapa"], ETAPA_MENU)
        mensagens = [chamada.args[1] for chamada in enviar_mensagem.call_args_list]
        self.assertTrue(
            any("Procedimento: Instalação de aparelho" in texto for texto in mensagens)
        )
        self.assertTrue(
            any("Consulta agendada com sucesso" in texto for texto in mensagens)
        )

    @patch("app.services.whatsapp_ura_service.buscar_dentistas")
    @patch("app.services.whatsapp_ura_service.buscar_procedimentos")
    @patch("app.services.whatsapp_ura_service.buscar_pacientes")
    @patch("app.services.whatsapp_ura_service.enviar_mensagem")
    def test_opcao_de_procedimento_invalida_mantem_etapa(
        self,
        enviar_mensagem,
        buscar_pacientes,
        buscar_procedimentos,
        buscar_dentistas,
    ):
        buscar_pacientes.return_value = {"id": 20}
        buscar_procedimentos.return_value = [{"id": 3, "nome": "Clareamento"}]

        processar_mensagem(self.numero, "Oi")
        processar_mensagem(self.numero, "1")
        processar_mensagem(self.numero, "9")

        buscar_dentistas.assert_not_called()
        self.assertEqual(conversas[self.numero]["etapa"], ETAPA_PROCEDIMENTO)
        self.assertIn("Opção inválida", enviar_mensagem.call_args.args[1])

    @patch("app.services.whatsapp_ura_service.buscar_pacientes", return_value=None)
    @patch("app.services.whatsapp_ura_service.enviar_mensagem")
    def test_impede_agendamento_sem_paciente_cadastrado(
        self,
        enviar_mensagem,
        buscar_pacientes,
    ):
        processar_mensagem(self.numero, "Oi")
        processar_mensagem(self.numero, "1")

        buscar_pacientes.assert_called_once_with(self.numero)
        self.assertIn("Não encontrei um paciente", enviar_mensagem.call_args.args[1])
        self.assertEqual(conversas[self.numero]["etapa"], ETAPA_MENU)


if __name__ == "__main__":
    unittest.main()
