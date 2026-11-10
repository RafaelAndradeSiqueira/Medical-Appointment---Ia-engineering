Construí um agente de IA para marcar consultas médicas.

A parte mais importante do projeto foi decidir onde a IA não entra.

A ideia é simples: o paciente escreve "quero marcar hoje com a Dra Carol" e o agente resolve. Sem formulário nem dropdown de médico.

O jeito ingênuo seria um prompt gigante com a agenda dentro, torcendo para o modelo não inventar horário.

Eu dividi o trabalho num grafo com LangGraph:

→ o LLM lê a mensagem, entende se é agendamento ou cancelamento e extrai os dados. "Dra Carol" vira o ID 3, "hoje" vira data.

→ código comum confere se o horário está livre e grava na agenda. Aqui não tem IA.

→ o LLM volta só no fim, para escrever a resposta para o paciente.

Toda saída do modelo passa por um schema Zod. Se ele esquecer o médico ou inventar um campo, o fluxo cai no caminho de erro e o paciente recebe uma explicação. Na agenda, nada errado entra.

Fiquei com isso: o LLM é ótimo para entender e escrever. Para decidir, regra de negócio continua ganhando.

Fiz o projeto na pós em Engenharia de IA Aplicada com o Erick Wendel. O próximo passo é dar memória para a conversa, para o agente perguntar o que faltou em vez de devolver erro.

Quem já colocou agente em produção: onde vocês traçaram essa linha?

Código no primeiro comentário.

#IA #LangGraph #TypeScript #NodeJS #DevBR

---

PRIMEIRO COMENTÁRIO (cole logo depois de publicar):

Repositório com README, diagrama do grafo e testes E2E: [link do repositório]
