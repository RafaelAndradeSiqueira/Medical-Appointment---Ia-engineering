import { getSystemPrompt, getUserPromptTemplate, MessageSchema } from '../../prompts/v1/messageGenerator.ts';
import { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../graph.ts';
import { AIMessage } from 'langchain';

export function createMessageGeneratorNode(llmClient: OpenRouterService) {
    return async (state: GraphState): Promise<Partial<GraphState>> => {

        try {

            const hasSuccess = state.actionSuccess ? 'success' : 'error';
            const scenario = `${state.intent ?? 'unknown'}_${hasSuccess}`;
            const details = {
                patientName: state.patientName,
                professionalName: state.professionalName,
                professionalId: state.professionalId,
                datetime: state.datetime,
                reason: state.reason,
                actionError: state.actionError,
                appointmentData: state.appointmentData,
            }

            const systemPrompt = getSystemPrompt();
            const userPrompt = getUserPromptTemplate({scenario, details}); 

            const result = await llmClient.generateStructured(systemPrompt, userPrompt, MessageSchema);

            if(result.error) {
                return {
                    ...state,
                    messages: [
                        ...state.messages,
                        new AIMessage(`An error occurred while generating the message: ${result.error}`)
                    ],
                };
            }

            return {
                messages: [
                    ...state.messages,
                    new AIMessage(result?.data?.message)
                ],
            };
        } catch (error) {
            return {
                ...state,
                messages: [
                    ...state.messages,
                    new AIMessage('An error occurred while processing your request.')
                ],
            };
        }
    };
}
