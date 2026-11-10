import {ChatOpenAI} from "@langchain/openai";
import { config, type ModelConfig } from "../config.ts";
import {z} from "zod/v3";
import { createAgent, HumanMessage, providerStrategy, SystemMessage } from "langchain";


export class OpenRouterService {
    private config: ModelConfig;
    private llmClient: ChatOpenAI;

    constructor(configOverrides?: ModelConfig) {
        this.config = configOverrides || config;
        this.llmClient = new ChatOpenAI({
            apiKey: this.config.apiKey,
            model: this.config.models[0],
            temperature: this.config.temperature,
            configuration: {
                baseURL: 'https://openrouter.ai/api/v1',
                defaultHeaders: {
                    'HTTP-Referer': this.config.httpReferer,
                    'X-Title': this.config.xTitle,
                },
            },
            modelKwargs: {
                models: this.config.models,
                provider: this.config.provider,
            },
        });
    }

    async generateStructured<T>(
        systemPrompt: string,
        userPrompt: string,
        schema: z.ZodSchema<T>,
    ){
        try{
            const agent = createAgent({
                model: this.llmClient,
                tools: [],
                responseFormat: providerStrategy(schema),
            });
            const messages = [
                new SystemMessage({ content: systemPrompt }),
                new HumanMessage({ content: userPrompt }),
            ]

            const data = await agent.invoke({messages});
            
            return {
                success: true,
                data: data.structuredResponse,
            }
        } catch (error) {
            
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            }
    }
}
}


