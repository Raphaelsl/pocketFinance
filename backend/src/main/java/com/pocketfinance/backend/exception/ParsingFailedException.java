package com.pocketfinance.backend.exception;

public class ParsingFailedException extends RuntimeException {

    public ParsingFailedException(String message) {
        super(message);
    }

    public ParsingFailedException(String message, Throwable cause) {
        super(message, cause);
    }
}