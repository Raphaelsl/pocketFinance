package com.pocketfinance.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/spike")
public class AiSpikeController {

    private static final Logger logger = LoggerFactory.getLogger(AiSpikeController.class);
    private final ChatClient chatClient;

    public AiSpikeController(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @PostMapping("/parse")
    public String parse(@RequestBody Map<String, String> request) {
        String input = request.get("input");

        long startTime = System.currentTimeMillis();
        ChatResponse response = chatClient.prompt()
                .user(input)
                .call()
                .chatResponse();
        long latency = System.currentTimeMillis() - startTime;

        String output = response.getResults().get(0).getOutput().getText();

        logger.info("Spike Latency: {} ms", latency);
        logger.info("Spike Response Metadata: {}", response.getMetadata());

        return output;
    }
}