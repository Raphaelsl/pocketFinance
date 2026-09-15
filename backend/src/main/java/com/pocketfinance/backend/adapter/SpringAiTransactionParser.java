package com.pocketfinance.backend.adapter;

import com.pocketfinance.backend.dto.TransactionSuggestionResult;
import com.pocketfinance.backend.port.TransactionParserPort;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class SpringAiTransactionParser implements TransactionParserPort {

    private static final String SYSTEM_PROMPT = """
            Você é um assistente financeiro. Extraia os detalhes da transação a partir do texto do usuário.
            Regras obrigatórias de formatação:
            - amount: Valor numérico positivo. Se houver sinal negativo, converta para positivo.
            - type: O tipo da transação, deve ser estritamente "INCOME" ou "EXPENSE" em letras maiúsculas.
            - currency: Se não especificado, o padrão é "BRL".
            - description: Descrição curta e objetiva.
            - occurredAt: Data no formato ISO-8601 (YYYY-MM-DD). A data atual é %s. Resolva referências relativas (como "hoje", "ontem") baseando-se nela.
            - suggestedCategoryName: Categoria sugerida para a transação.
            - confidence: Nível de confiança da extração ("LOW", "MEDIUM", "HIGH").
            """;

    private final ChatClient chatClient;

    public SpringAiTransactionParser(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    @Override
    public TransactionSuggestionResult parse(String input) {
        String currentDate = LocalDate.now().toString();
        String promptWithDate = String.format(SYSTEM_PROMPT, currentDate);

        return chatClient.prompt()
                .system(promptWithDate)
                .user(input)
                .call()
                .entity(TransactionSuggestionResult.class);
    }
}