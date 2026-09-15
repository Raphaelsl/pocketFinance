package com.pocketfinance.backend.exception;

public class ParsingFailedException extends RuntimeException {
    private final String rawInput;

    public ParsingFailedException(String message, String rawInput) {
        super(message);
        this.rawInput = rawInput;
    }

    public String getRawInput() {
        return rawInput;
    }
}