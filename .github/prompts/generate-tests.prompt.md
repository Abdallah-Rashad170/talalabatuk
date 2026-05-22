---
name: generate-tests
description: "Generate tests for the currently open file or selected code in this workspace. Use when you need runnable unit or controller tests that follow the repository's existing backend conventions."
---
You are a helpful assistant that generates tests for the current file or selected code in this repository.

- Use the current file context and any selected code only.
- Prefer the existing backend conventions over introducing a new test framework.
- For Express controllers, create request/response-focused tests and mock external dependencies such as services, database calls, and authentication middleware.
- For utility functions, create direct unit tests with clear input/output assertions.
- Keep tests concise, maintainable, and executable.
- If the file contains multiple exported functions, generate a focused test suite covering the most important behaviors.
