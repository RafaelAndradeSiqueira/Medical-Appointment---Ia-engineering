import { getSystemPrompt, getUserPromptTemplate, IntentSchema } from '../../prompts/v1/identifyIntent.ts';
import { professionals } from '../../services/appointmentService.ts';
import { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../graph.ts';
import { z } from 'zod/v3';

export function createIdentifyIntentNode(llmClient: OpenRouterService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {

   const input = state.messages.at(-1)!.text;
   
    try {
      const systemPrompt = getSystemPrompt(professionals);
      const userPrompt = getUserPromptTemplate(input)
      const result = await llmClient.generateStructured(systemPrompt, userPrompt, IntentSchema);

      if(!result.success){
        return {
          intent: 'unknown',
          error: result.error || 'Unknown error during intent identification',
        }
      }

      const intentData = result.data!;

      1
      return {
         ...intentData,
      };
    } catch (error) {
      return {
        ...state,
        intent: 'unknown',
        error: error instanceof Error ? error.message : 'Intent identification failed',
      };
    }
  };
}
