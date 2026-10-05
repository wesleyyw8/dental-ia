from datetime import date, datetime
from typing import Any

from app.services.consulta_service import agendar_consulta
from app.services.dentista_service import buscar_dentistas
from app.services.horario_service import buscar_horarios
from app.services.paciente_service import buscar_pacientes
from app.services.procedimento_service import buscar_procedimentos
from app.whatsapp import enviar_mensagem

ETAPA_MENU = "menu_principal"
ETAPA_PROCEDIMENTO = "escolhendo_procedimento"
ETAPA_DENTISTA = "escolhendo_dentista"
ETAPA_DATA = "escolhendo_data"
ETAPA_HORARIO = "escolhendo_horario"
ETAPA_CONFIRMACAO = "confirmando_agendamento"

MENU_PRINCIPAL = """Olá! Como posso ajudar?

1 - Agendar consulta
2 - Remarcar consulta
3 - Cancelar consulta"""

conversas: dict[str, dict[str, Any]] = {}


def processar_mensagem(numero: str, texto: str) -> None:
    mensagem = texto.strip()
    conversa = conversas.get(numero)

    if conversa is None:
        _voltar_ao_menu(numero)
        return

    if mensagem.lower() in {"menu", "cancelar", "sair"}:
        _voltar_ao_menu(numero, "Fluxo cancelado.")
        return

    etapa = conversa.get("etapa")

    if etapa == ETAPA_MENU:
        _processar_menu(numero, mensagem)
    elif etapa == ETAPA_PROCEDIMENTO:
        _processar_procedimento(numero, mensagem, conversa)
    elif etapa == ETAPA_DENTISTA:
        _processar_dentista(numero, mensagem, conversa)
    elif etapa == ETAPA_DATA:
        _processar_data(numero, mensagem, conversa)
    elif etapa == ETAPA_HORARIO:
        _processar_horario(numero, mensagem, conversa)
    elif etapa == ETAPA_CONFIRMACAO:
        _processar_confirmacao(numero, mensagem, conversa)
    else:
        _voltar_ao_menu(numero, "Não consegui continuar o atendimento anterior.")


def _processar_menu(numero: str, mensagem: str) -> None:
    if mensagem == "1":
        _iniciar_agendamento(numero)
        return

    if mensagem in {"2", "3"}:
        _voltar_ao_menu(
            numero,
            "Essa opção ainda não está disponível nesta versão.",
        )
        return

    _voltar_ao_menu(numero, "Opção inválida. Responda com 1, 2 ou 3.")


def _iniciar_agendamento(numero: str) -> None:
    paciente = buscar_pacientes(numero)

    if not paciente:
        _voltar_ao_menu(
            numero,
            "Não encontrei um paciente cadastrado com este número de WhatsApp. "
            "Entre em contato com a clínica para atualizar seu cadastro.",
        )
        return

    procedimentos = buscar_procedimentos()

    if not procedimentos:
        _voltar_ao_menu(
            numero,
            "No momento não há procedimentos disponíveis para agendamento.",
        )
        return

    conversas[numero] = {
        "etapa": ETAPA_PROCEDIMENTO,
        "paciente_id": paciente["id"],
        "opcoes_procedimentos": procedimentos,
    }
    _enviar_lista(
        numero,
        "Qual procedimento você deseja?",
        procedimentos,
        "nome",
    )


def _processar_procedimento(
    numero: str,
    mensagem: str,
    conversa: dict[str, Any],
) -> None:
    procedimentos = conversa["opcoes_procedimentos"]
    procedimento = _selecionar_opcao(mensagem, procedimentos)

    if procedimento is None:
        _enviar_opcao_invalida(numero, procedimentos, "nome")
        return

    dentistas = buscar_dentistas(procedimento["id"])

    if not dentistas:
        _enviar(
            numero,
            "Não há dentistas disponíveis para esse procedimento. "
            "Escolha outro procedimento.",
        )
        _enviar_lista(numero, "Qual procedimento você deseja?", procedimentos, "nome")
        return

    conversa.update(
        {
            "etapa": ETAPA_DENTISTA,
            "procedimento_id": procedimento["id"],
            "procedimento_nome": procedimento["nome"],
            "opcoes_dentistas": dentistas,
        }
    )
    _enviar_lista(numero, "Escolha o dentista:", dentistas, "nome")


def _processar_dentista(
    numero: str,
    mensagem: str,
    conversa: dict[str, Any],
) -> None:
    dentistas = conversa["opcoes_dentistas"]
    dentista = _selecionar_opcao(mensagem, dentistas)

    if dentista is None:
        _enviar_opcao_invalida(numero, dentistas, "nome")
        return

    conversa.update(
        {
            "etapa": ETAPA_DATA,
            "dentista_id": dentista["id"],
            "dentista_nome": dentista["nome"],
        }
    )
    _enviar(
        numero,
        "Para qual data você deseja agendar?\n\n"
        "Digite no formato DD/MM/AAAA.\n"
        "Exemplo: 08/10/2026",
    )


def _processar_data(
    numero: str,
    mensagem: str,
    conversa: dict[str, Any],
) -> None:
    try:
        data_escolhida = datetime.strptime(mensagem, "%d/%m/%Y").date()
    except ValueError:
        _enviar(numero, "Data inválida. Digite no formato DD/MM/AAAA.")
        return

    if data_escolhida < date.today():
        _enviar(numero, "A data não pode estar no passado. Escolha outra data.")
        return

    data_iso = data_escolhida.isoformat()
    resultado = buscar_horarios(
        conversa["dentista_id"],
        conversa["procedimento_id"],
        data_iso,
    )

    if "erro" in resultado:
        _enviar(numero, f"Não foi possível consultar os horários: {resultado['erro']}")
        return

    horarios = resultado.get("horarios_disponiveis", [])

    if not horarios:
        _enviar(
            numero,
            "Não há horários disponíveis nessa data. Digite outra data no formato "
            "DD/MM/AAAA.",
        )
        return

    conversa.update(
        {
            "etapa": ETAPA_HORARIO,
            "data": data_iso,
            "data_formatada": data_escolhida.strftime("%d/%m/%Y"),
            "opcoes_horarios": horarios,
        }
    )
    _enviar_lista(numero, "Escolha um horário:", horarios)


def _processar_horario(
    numero: str,
    mensagem: str,
    conversa: dict[str, Any],
) -> None:
    horarios = conversa["opcoes_horarios"]
    horario = _selecionar_opcao(mensagem, horarios)

    if horario is None:
        _enviar_opcao_invalida(numero, horarios)
        return

    conversa.update(
        {
            "etapa": ETAPA_CONFIRMACAO,
            "horario": horario,
        }
    )
    _enviar(
        numero,
        "Você escolheu:\n\n"
        f"Procedimento: {conversa['procedimento_nome']}\n"
        f"Dentista: {conversa['dentista_nome']}\n"
        f"Data: {conversa['data_formatada']}\n"
        f"Horário: {horario}\n\n"
        "Deseja confirmar?\n\n"
        "1 - Sim\n"
        "2 - Não",
    )


def _processar_confirmacao(
    numero: str,
    mensagem: str,
    conversa: dict[str, Any],
) -> None:
    if mensagem == "2":
        _voltar_ao_menu(numero, "Agendamento cancelado.")
        return

    if mensagem != "1":
        _enviar(numero, "Opção inválida. Responda 1 para confirmar ou 2 para cancelar.")
        return

    resultado = agendar_consulta(
        conversa["paciente_id"],
        conversa["dentista_id"],
        conversa["procedimento_id"],
        conversa["data"],
        conversa["horario"],
    )

    if "erro" in resultado:
        conversa["etapa"] = ETAPA_DATA
        conversa.pop("data", None)
        conversa.pop("data_formatada", None)
        conversa.pop("horario", None)
        conversa.pop("opcoes_horarios", None)
        _enviar(
            numero,
            f"Não foi possível concluir o agendamento: {resultado['erro']}\n\n"
            "Digite uma nova data no formato DD/MM/AAAA.",
        )
        return

    _voltar_ao_menu(numero, "Consulta agendada com sucesso!")


def _selecionar_opcao(mensagem: str, opcoes: list[Any]):
    if not mensagem.isdigit():
        return None

    indice = int(mensagem) - 1

    if indice < 0 or indice >= len(opcoes):
        return None

    return opcoes[indice]


def _enviar_lista(
    numero: str,
    titulo: str,
    opcoes: list[Any],
    campo: str | None = None,
) -> None:
    linhas = [titulo, ""]

    for indice, opcao in enumerate(opcoes, start=1):
        valor = opcao[campo] if campo else opcao
        linhas.append(f"{indice} - {valor}")

    linhas.extend(["", "Digite 'menu' para cancelar e voltar ao início."])
    _enviar(numero, "\n".join(linhas))


def _enviar_opcao_invalida(
    numero: str,
    opcoes: list[Any],
    campo: str | None = None,
) -> None:
    linhas = ["Opção inválida. Escolha uma das opções abaixo:", ""]

    for indice, opcao in enumerate(opcoes, start=1):
        valor = opcao[campo] if campo else opcao
        linhas.append(f"{indice} - {valor}")

    _enviar(numero, "\n".join(linhas))


def _voltar_ao_menu(numero: str, aviso: str | None = None) -> None:
    conversas[numero] = {"etapa": ETAPA_MENU}
    mensagem = f"{aviso}\n\n{MENU_PRINCIPAL}" if aviso else MENU_PRINCIPAL
    _enviar(numero, mensagem)


def _enviar(numero: str, mensagem: str) -> None:
    enviar_mensagem(numero, mensagem)
