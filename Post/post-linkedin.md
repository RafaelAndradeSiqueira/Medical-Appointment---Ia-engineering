Escrevi "gostaria de agendar uma consulta na data de hoje com a Dra Carol" e voltou isto:

"Olá, Rafael de Andrade! Sua consulta com a Dra. Carol Gomes em 10 de novembro de 2026 foi confirmada com sucesso."

Não preenchi formulário nem escolhi médico em dropdown. Também não digitei data em formato nenhum.

Esse é um dos projetos que fiz na pós em Engenharia de IA Aplicada com o Erick Wendel. É um agente de agendamento médico feito com LangGraph, e a parte que mais me ensinou foi decidir onde a IA NÃO entra.

O fluxo é um grafo com 4 nós:

1. identifyIntent: o LLM lê a mensagem, decide se a pessoa quer agendar, cancelar ou se é outro assunto, e extrai nome, profissional, data e motivo. "Dra Carol" vira o ID 3, "hoje" vira data ISO.
2. schedule / cancel: código comum, sem LLM. Verifica se o horário está livre e grava na agenda.
3. message: o LLM volta só pra escrever a resposta pro paciente.

Toda saída do modelo passa por um schema Zod. Se ele inventar um campo ou esquecer o médico, o grafo vai pro caminho de erro e o paciente recebe uma explicação, sem nada errado gravado na agenda.

Antes eu teria jogado tudo num prompt gigante e torcido pra dar certo. Separar "entender" de "executar" deixou o agente bem mais previsível, e muito mais fácil de testar. Os testes E2E chamam o modelo de verdade, sem mock.

Stack: Node 24 com TypeScript nativo, LangGraph, LangChain, OpenRouter, Fastify e Zod. Usei o LangGraph Studio pra visualizar o grafo (print abaixo) e o LangSmith pro tracing.

Próximo passo é dar memória pra conversa, pra quando faltar um dado ele perguntar e continuar de onde parou em vez de devolver erro.

Código no GitHub: [link do repositório]

#LangGraph #IA #TypeScript #NodeJS
