# Security Policy

## Reporting Security Vulnerabilities

Please **DO NOT** create public GitHub issues for security vulnerabilities. Instead, please email security@skill-ed.dev with:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested remediation (if any)

We will acknowledge receipt within 48 hours and provide a timeline for fix and disclosure.

## Security Standards

Skill-ED is built with security as a first-class citizen:

### Encryption Standards
- **Symmetric**: ChaCha20-Poly1305 AEAD cipher (256-bit keys)
- **Key Derivation**: Argon2id with strong parameters
- **Hashing**: SHA-256 for supplementary operations

### Authentication
- Master password with minimum 12 characters
- Mandatory uppercase, lowercase, and numeric characters
- Argon2 password hashing with per-user salt
- In-memory key storage during sessions

### Data Storage
- SQLite with optional encryption
- All sensitive fields encrypted before database storage
- No plaintext storage of personal data
- Secure memory handling

### OWASP Top 10 Compliance
- A01:2021 - Broken Access Control ✅
- A02:2021 - Cryptographic Failures ✅
- A03:2021 - Injection ✅
- A04:2021 - Insecure Design ✅
- A05:2021 - Security Misconfiguration ✅
- A06:2021 - Vulnerable Components ✅
- A07:2021 - Authentication Failures ✅
- A08:2021 - Software & Data Integrity Failures ✅
- A09:2021 - Logging & Monitoring Failures ✅
- A10:2021 - SSRF ✅

## Security Audit Schedule

- **Automated**: On every commit via GitHub Actions
- **Manual**: Quarterly security audits
- **Dependency**: Weekly dependency vulnerability checks
- **Code Review**: All pull requests reviewed for security

## Dependency Management

- Regular updates to cryptographic libraries
- Automated security scanning with Dependabot
- Zero vulnerable dependencies policy
- Pinned versions for security-critical dependencies

## Bug Bounty

We don't currently have a formal bug bounty program, but we greatly appreciate security researchers who responsibly disclose vulnerabilities.

---

For more information, see our [Security Guide](./docs/SECURITY.md)
