# AI Cost and Security Analysis 

## Cost Estimate (1000 requests)
Considering the default model (e.g., gpt-4o-mini):
- **Tokens per request:** ~250 Input / ~60 Output
- **Input Cost (1k reqs):** 250,000 tokens = ~$0.037
- **Output Cost (1k reqs):** 60,000 tokens = ~$0.036
- **Estimated Total Cost per 1,000 transactions:** ~$0.07 USD

## Attack Surface and Prevention
- **Threat:** Massive token consumption via malicious payload (resource exhaustion/financial attack).
- **Implemented Mitigation:** Blocking inputs larger than 500 characters directly in the `TransactionSuggestController` (returning HTTP 400 without triggering the ChatClient).
- **Observability:** Added INFO level log with `tokens_prompt` and `tokens_completion` count per call. The user's original `rawInput` is omitted from this log level to prevent sensitive data leakage.