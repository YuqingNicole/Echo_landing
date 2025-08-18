import { useState, useCallback } from 'react';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function useConversation(sceneName = 'agent_chat') {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userMessage: string, variables = {}) => {
    const startTime = Date.now();
    
    console.log('🤖 Starting conversation:', { userMessage: userMessage.substring(0, 100) + '...', sceneName, variables });

    const config = globalThis.ywConfig?.ai_config?.[sceneName];
    if (!config) {
      console.error('❌ API Error - Configuration not found:', sceneName);
      throw new Error(`API Error - Configuration '${sceneName}' not found`);
    }

    setIsLoading(true);

    // Add user message to history
    const newUserMessage: Message = { role: 'user', content: userMessage };
    setConversationHistory(prev => [...prev, newUserMessage]);

    const openai = createOpenAI({
      baseURL: 'https://api.youware.com/public/v1/ai',
      apiKey: 'sk-YOUWARE'
    });

    console.log('🤖 AI API Request:', {
      model: config.model,
      scene: sceneName,
      input: userMessage.substring(0, 100) + '...',
      systemPrompt: config.system_prompt ? config.system_prompt(variables).substring(0, 100) + '...' : '',
      parameters: {
        temperature: config.temperature || 0.8,
        maxTokens: config.maxTokens || 4000
      }
    });

    try {
      const { text } = await generateText({
        model: openai(config.model),
        messages: [
          ...(config.system_prompt ? [{ role: 'system', content: config.system_prompt(variables) }] : []),
          ...conversationHistory, // Include full conversation context
          newUserMessage
        ],
        temperature: config.temperature || 0.8,
        maxTokens: config.maxTokens || 4000
      });

      console.log('✅ AI API Response:', {
        model: config.model,
        scene: sceneName,
        outputLength: text.length,
        responsePreview: text.substring(0, 150) + '...',
        processingTime: `${Date.now() - startTime}ms`
      });

      // Add AI response to history
      const assistantMessage: Message = { role: 'assistant', content: text };
      setConversationHistory(prev => [...prev, assistantMessage]);

      return text;
    } catch (error) {
      console.error('❌ API Error - Conversation failed:', {
        model: config.model,
        scene: sceneName,
        error: (error as Error).message,
        processingTime: `${Date.now() - startTime}ms`
      });
      
      // Remove the user message if there was an error
      setConversationHistory(prev => prev.slice(0, -1));
      
      throw new Error(`API Error - Conversation failed: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  }, [sceneName, conversationHistory]);

  const resetConversation = useCallback(() => {
    setConversationHistory([]);
  }, []);

  return {
    conversationHistory,
    sendMessage,
    resetConversation,
    isLoading
  };
}