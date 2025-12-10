# Contributing to Skill-ED

Thank you for your interest in contributing to Skill-ED! We welcome contributions from everyone.

## Code of Conduct

This project adheres to the Contributor Covenant. By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce
- Provide specific examples to demonstrate the steps
- Describe the observed behavior and what's expected
- Include screenshots or logs if applicable
- Include your environment (OS, Rust version, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- List examples where this enhancement would be beneficial
- Explain why this enhancement would be useful

### Pull Requests

- Fill in the required PR template
- Follow the Rust and Vue style guides
- Include appropriate test cases
- Document new features
- Update the README if needed

## Development Setup

### Prerequisites
- Rust 1.70+
- Node.js 16+
- Git

### Setup Steps

```bash
# Clone repository
git clone https://github.com/skill-ed/skill-ed.git
cd skill-ed

# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Run tests
cargo test
npm run test
```

## Coding Standards

### Rust
- Use `cargo fmt` for formatting
- Use `cargo clippy` for linting
- Write tests for new functionality
- Document public APIs with doc comments
- Follow the Rust API Guidelines

### Vue/TypeScript
- Use `prettier` for formatting
- Run ESLint for linting
- Follow Vue 3 Composition API patterns
- Use TypeScript for type safety
- Write clear component documentation

### Commit Messages
- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Testing

### Running Tests

```bash
# Rust tests
cargo test

# Frontend tests (once added)
npm run test
```

### Test Coverage

We aim for high test coverage:
- Backend: Minimum 80% coverage
- Frontend: Minimum 60% coverage
- Security-critical code: 100% coverage

## Documentation

When contributing new features:
1. Update relevant README sections
2. Add code comments for complex logic
3. Create or update documentation files in `docs/`
4. Include example usage where applicable

## Security Considerations

When contributing code:
1. Never commit secrets or private keys
2. Review cryptographic implementations carefully
3. Update dependencies responsibly
4. Report security issues privately (see SECURITY.md)

## Community

- GitHub Issues for bug reports and feature requests
- GitHub Discussions for general questions
- Email: contributors@skill-ed.dev

## License

By contributing to Skill-ED, you agree that your contributions will be licensed under its MIT/Apache 2.0 licenses.

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- GitHub contributor page
- Release notes

Thank you for contributing to Skill-ED! 🎉
