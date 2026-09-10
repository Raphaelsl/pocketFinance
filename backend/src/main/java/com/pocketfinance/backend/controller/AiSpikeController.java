package com.pocketfinance.backend.controller;

import com.pocketfinance.backend.dto.TransactionSuggestionResult;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/spike")
public class AiSpikeController {

    private final ChatClient chatClient;

    public AiSpikeController(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    @PostMapping(value = "/parse", produces = "application/json; charset=utf-8")
    public TransactionSuggestionResult parse(@RequestBody Map<String, String> payload) {
        String input = payload.get("input");
        String currentDate = LocalDate.now().toString();

        String systemPrompt = """
                Você é um assistente financeiro. Extraia os detalhes da transação a partir do texto do usuário.
                Regras obrigatórias de formatação:
                - amount: Valor numérico positivo. Se houver sinal negativo, converta para positivo.
                - type: O tipo da transação, deve ser estritamente "INCOME" ou "EXPENSE" em letras maiúsculas.
                - currency: Se não especificado, o padrão é "BRL".
                - description: Descrição curta e objetiva.
                - occurredAt: Data no formato ISO-8601 (YYYY-MM-DD). A data atual é %s. Resolva referências relativas (como "hoje", "ontem") baseando-se nela.
                - suggestedCategoryName: Categoria sugerida para a transação.
                - confidence: Nível de confiança da extração ("LOW", "MEDIUM", "HIGH").
                """.formatted(currentDate);

        return chatClient.prompt()
                .system(systemPrompt)
                .user(input)
                .call()
                .entity(TransactionSuggestionResult.class);
    }
}