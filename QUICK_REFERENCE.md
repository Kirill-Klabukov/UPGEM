# Skill-ED Quick Reference

## Common Commands

### Development
```bash
# Install dependencies
npm install

# Run development server
npm run tauri dev

# Type check
npm run type-check

# Build frontend
npm run build

# Format code
cargo fmt
prettier --write .

# Lint code
cargo clippy
```

### Testing
```bash
# Run Rust tests
cargo test

# Run with logging
RUST_LOG=debug cargo test

# Run specific test
cargo test test_name

# Test coverage
cargo tarpaulin --out Html
```

### Building
```bash
# Development build
npm run tauri dev

# Production build
npm run tauri build

# Build for specific target
cargo build --target x86_64-unknown-linux-gnu --release
```

### Database
```bash
# View schema
# See: src-tauri/db/schema.rs

# Initialize database
# Automatic on first app launch

# Export data
# Use Settings → Data Management → Export
```

## Project Files Quick Reference

### Where to Add...

| What | Where | Example |
|------|-------|---------|
| New API endpoint | `src-tauri/handlers/` | `src-tauri/handlers/skill.rs` |
| Database model | `src-tauri/db/models.rs` | `Skill struct` |
| Database table | `src-tauri/db/schema.rs` | `CREATE TABLE skills` |
| Encryption logic | `src-tauri/crypto/` | `encryption.rs` |
| New page | `src/views/` | `src/views/NewPage.vue` |
| Component | `src/components/` | `src/components/SkillCard.vue` |
| State store | `src/stores/` | `src/stores/habit.ts` |
| Route | `src/router/index.ts` | New route definition |
| Styling | Component `<style>` | BEM naming convention |
| Tests | Same directory as code | `encryption.rs` with `#[cfg(test)]` |
| Docs | `docs/` | `docs/NEW_FEATURE.md` |

## Debugging Tips

### Rust Backend
```bash
# Enable debug logging
RUST_LOG=debug cargo test

# Check for panics
RUST_BACKTRACE=full cargo run

# Profile performance
cargo flamegraph

# Check memory safety
cargo miri test
```

### Vue Frontend
```bash
# Check for TypeScript errors
npm run type-check

# Debug in browser
# Press F12 in dev mode

# Check component props
# Use Vue DevTools extension

# Profile rendering
# Chrome DevTools Performance tab
```

### Database
```bash
# Query database directly
sqlite3 ~/.local/share/skill-ed/skill-ed.db

# View schema
.tables
.schema skill_table_name

# Export/backup
sqlite3 skill-ed.db .dump > backup.sql
```

## Security Checklist

Before committing security-related code:

- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Encryption used for sensitive data
- [ ] Error messages don't leak info
- [ ] Tests cover edge cases
- [ ] Dependencies audited
- [ ] Comments explain security decisions

## Performance Optimization

### Database
```rust
// ✅ Good: Use indexes
CREATE INDEX idx_habit_id ON habit_completions(habit_id);

// ❌ Bad: Unoptimized queries
SELECT * FROM large_table; // No indexes or filters
```

### Frontend
```vue
<!-- ✅ Good: Lazy load images -->
<img v-lazy="imageUrl" />

<!-- ❌ Bad: Load all images upfront -->
<img :src="imageUrl" />
```

## Code Style Guide

### Rust
```rust
// Module organization
mod crypto;
pub use crypto::{encrypt_data, decrypt_data};

// Error handling
pub fn operation() -> Result<Data> {
    let data = risky_operation()
        .map_err(|e| CustomError::message(e))?;
    Ok(data)
}

// Comments for public APIs
/// Encrypts data using ChaCha20-Poly1305
/// # Arguments
/// * `key` - 256-bit encryption key
pub fn encrypt_data(key: &[u8; 32]) -> Result<Vec<u8>> {
    // implementation
}
```

### TypeScript/Vue
```typescript
// Define interfaces
interface Skill {
  id: string;
  name: string;
  category: string;
}

// Use composition API
const { skills, loading } = useSkills();

// Strong typing
const handleUpdate = (skill: Skill): void => {
  // implementation
};
```

### CSS
```css
/* BEM naming convention */
.component-name { }
.component-name__element { }
.component-name--modifier { }

/* Use CSS variables */
background-color: var(--primary-color);
color: var(--text-primary);
```

## File Size Limits

- **Single file**: < 500 lines (split if larger)
- **Module**: < 1000 lines total
- **Component**: < 300 lines
- **Store**: < 200 lines
- **Documentation**: Clear and concise

## Naming Conventions

### Rust
```rust
// Functions: snake_case
fn create_skill(name: String) { }

// Types/Structs: PascalCase
struct SkillProgress { }

// Constants: SCREAMING_SNAKE_CASE
const MAX_SKILL_NAME_LENGTH: usize = 100;
```

### TypeScript/Vue
```typescript
// Components: PascalCase
export default MyComponent;

// Functions: camelCase
const handleClick = () => { };

// Constants: SCREAMING_SNAKE_CASE
const API_VERSION = "v1";
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m "Add amazing feature"

# Push to fork
git push origin feature/amazing-feature

# Create Pull Request on GitHub

# After review and approval
git merge feature/amazing-feature
```

## Commit Message Format

```
type(scope): subject

body (optional)

footer (optional - issue references)

Examples:
feat(skills): add skill categorization
fix(crypto): fix nonce generation bug
docs(readme): update installation guide
test(handlers): add auth handler tests
chore(deps): update tauri to 1.5
```

## Documentation Template

```markdown
# Feature Name

## Description
Brief overview of the feature.

## Usage
```rust
// Code example
```

## Security Considerations
Any security aspects to note.

## Testing
How to test this feature.

## Related Issues
Issue links (e.g., #123)
```

## Useful Resources

### Cryptography
- [RFC 7539 - ChaCha20-Poly1305](https://tools.ietf.org/html/rfc7539)
- [Argon2 Documentation](https://github.com/P-H-C/phc-winner-argon2)

### Frameworks
- [Tauri Docs](https://tauri.app/)
- [Vue 3 Guide](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)

### Tools
- [Rust Book](https://doc.rust-lang.org/book/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SQLx Documentation](https://github.com/launchbadge/sqlx)

## Troubleshooting Quick Answers

### Build fails with crypto errors
→ Make sure you have latest Rust: `rustup update`

### TypeScript errors
→ Run `npm run type-check` to see all errors

### Database locked
→ Check for multiple instances running

### UI not updating
→ Verify component is using reactive state with Pinia

### Encryption test fails
→ Check key and nonce sizes are correct (32, 12 bytes)

---

For detailed documentation, see:
- [README.md](./README.md) - Full project documentation
- [SECURITY.md](./SECURITY.md) - Security guidelines
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guide
