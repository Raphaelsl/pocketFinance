package com.pocketfinance.backend.adapter;

import com.pocketfinance.backend.dto.TransactionSuggestionResult;
import com.pocketfinance.backend.exception.ParsingFailedException; // Certifique-se de ter esta exceção criada
import com.pocketfinance.backend.port.TransactionParserPort;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.metadata.Usage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.LocalDate;

@Component
public class SpringAiTransactionParser implements TransactionParserPort {

    private static final Logger log = LoggerFactory.getLogger(SpringAiTransactionParser.class);

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
    private final BeanOutputConverter<TransactionSuggestionResult> converter;
    private final Clock clock;

    public SpringAiTransactionParser(ChatClient.Builder chatClientBuilder, Clock clock) {
        this.chatClient = chatClientBuilder.build();
        this.converter = new BeanOutputConverter<>(TransactionSuggestionResult.class);
        this.clock = clock;
    }

    @Override
    public TransactionSuggestionResult parse(String input) {
        String currentDate = LocalDate.now(clock).toString();

        String promptWithDateAndFormat = String.format(SYSTEM_PROMPT, currentDate) + "\n" + converter.getFormat();

        ChatResponse response = chatClient.prompt()
                .system(promptWithDateAndFormat)
                .user(input)
                .call()
                .chatResponse();

        if (response != null && response.getMetadata() != null && response.getMetadata().getUsage() != null) {
            Usage usage = response.getMetadata().getUsage();
            log.info("AI suggest | tokens_prompt={} tokens_completion={} model={}",
                    usage.getPromptTokens(),
                    usage.getCompletionTokens(),
                    response.getMetadata().getModel());
        }


        if (response == null || response.getResult() == null || response.getResult().getOutput() == null) {
            throw new ParsingFailedException("Resposta nula da LLM");
        }

        String content = response.getResult().getOutput().getText();
        if (content == null || content.trim().isEmpty()) {
            throw new ParsingFailedException("A LLM retornou um conteúdo vazio");
        }


        try {
            return converter.convert(content);
        } catch (Exception e) {

            log.error("Erro ao converter resposta da LLM. Motivo técnico: {}", e.getMessage());
            throw new ParsingFailedException("O formato retornado pela IA é inválido ou incompatível");
        }
    }
}