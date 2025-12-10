# Project Structure Overview

## Complete File Listing

### Root Configuration Files
```
Cargo.toml                     - Rust dependencies and project metadata
package.json                   - Node.js dependencies for frontend
vite.config.ts                 - Frontend build configuration
tsconfig.json                  - TypeScript configuration
tsconfig.node.json             - TypeScript config for build tools
.prettierrc                     - Code formatting configuration
.gitignore                      - Git ignore patterns
```

### Documentation Files
```
README.md                       - Main project documentation
SECURITY.md                     - Security policy and best practices
CONTRIBUTING.md                 - Contribution guidelines
PROJECT_SUMMARY.md              - This project summary
```

### Documentation Directory
```
docs/
├── INSTALLATION.md             - Platform-specific installation guide
└── USER_GUIDE.md               - Feature overview and usage instructions
```

### GitHub Configuration
```
.github/
├── copilot-instructions.md     - Copilot workspace instructions
└── workflows/
    ├── ci.yml                  - CI/CD pipeline configuration
    └── release.yml             - Release automation workflow
```

### Frontend Source Code
```
src/
├── main.ts                     - Vue application entry point
├── App.vue                     - Root application component
├── index.html                  - HTML template
├── components/
│   ├── AppHeader.vue           - Top navigation component
│   └── AppSidebar.vue          - Left navigation component
├── views/
│   ├── Login.vue               - Authentication page
│   ├── Dashboard.vue           - Main dashboard view
│   ├── Skills.vue              - Skills management page
│   ├── Habits.vue              - Habits tracking page
│   ├── Calendar.vue            - Milestones and calendar view
│   └── Settings.vue            - Settings and preferences
├── stores/
│   ├── auth.ts                 - Authentication state store
│   └── skill.ts                - Skills management store
└── router/
    └── index.ts                - Vue Router configuration
```

### Backend Source Code
```
src-tauri/
├── main.rs                     - Rust application entry point
├── error.rs                    - Error types and handling
├── state.rs                    - Application state management
│   └── app_state.rs            - State definitions
├── tauri.conf.json             - Tauri application configuration
├── crypto/                     - Encryption and cryptography
│   ├── mod.rs                  - Crypto module exports
│   ├── encryption.rs           - ChaCha20-Poly1305 encryption
│   ├── hashing.rs              - Argon2 password hashing
│   └── key_derivation.rs       - Key derivation functions
├── db/                         - Database layer
│   ├── mod.rs                  - Database initialization
│   ├── models.rs               - Data models
│   └── schema.rs               - Database schema SQL
└── handlers/                   - API endpoint handlers
    ├── mod.rs                  - Handler module exports
    ├── auth.rs                 - Authentication handlers
    ├── skill.rs                - Skill management handlers
    └── habit.rs                - Habit tracking handlers
```

## Directory Tree

```
skill-ed/
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── docs/
│   ├── INSTALLATION.md
│   └── USER_GUIDE.md
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── components/
│   │   ├── AppHeader.vue
│   │   └── AppSidebar.vue
│   ├── views/
│   │   ├── Login.vue
│   │   ├── Dashboard.vue
│   │   ├── Skills.vue
│   │   ├── Habits.vue
│   │   ├── Calendar.vue
│   │   └── Settings.vue
│   ├── stores/
│   │   ├── auth.ts
│   │   └── skill.ts
│   └── router/
│       └── index.ts
├── src-tauri/
│   ├── main.rs
│   ├── error.rs
│   ├── state.rs
│   ├── tauri.conf.json
│   ├── crypto/
│   │   ├── mod.rs
│   │   ├── encryption.rs
│   │   ├── hashing.rs
│   │   └── key_derivation.rs
│   ├── db/
│   │   ├── mod.rs
│   │   ├── models.rs
│   │   └── schema.rs
│   └── handlers/
│       ├── mod.rs
│       ├── auth.rs
│       ├── skill.rs
│       └── habit.rs
├── Cargo.toml
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── index.html
├── .prettierrc
├── .gitignore
├── README.md
├── SECURITY.md
├── CONTRIBUTING.md
└── PROJECT_SUMMARY.md
```

## File Count Summary

- **Total Files**: 44
- **Configuration Files**: 8
- **Documentation Files**: 5
- **Rust Source Files**: 13
- **Vue/TypeScript Files**: 14
- **GitHub Configuration**: 4

## Architecture Overview

### Backend Architecture

```
┌─────────────────────────────────────┐
│      Tauri Application Layer        │
│  (main.rs - Cross-platform Bridge)  │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───v───────────────┐ ┌──v──────────────────┐
│   Crypto Module   │ │  Database Module    │
├───────────────────┤ ├─────────────────────┤
│ • Encryption      │ │ • Models            │
│ • Hashing         │ │ • Schema            │
│ • Key Derivation  │ │ • Initialization    │
└───────────────────┘ └─────────────────────┘
    │
    └──────────────┬──────────────┘
                   │
            ┌──────v───────────┐
            │  Handlers Layer  │
            ├──────────────────┤
            │ • Auth Handlers  │
            │ • Skill Handlers │
            │ • Habit Handlers │
            └──────────────────┘
                   │
            ┌──────v───────────┐
            │ Error Handling   │
            │ & State Mgmt     │
            └──────────────────┘
```

### Frontend Architecture

```
┌──────────────────────────────────────┐
│        Vue 3 Application              │
│     (main.ts Entry Point)             │
└──────────────┬───────────────────────┘
               │
    ┌──────────┴──────────────┐
    │                         │
┌───v──────────────┐   ┌─────v────────────┐
│ Router (Vue      │   │  Pinia Stores    │
│  Router)         │   │  (State Mgmt)    │
├──────────────────┤   ├──────────────────┤
│ • /login         │   │ • Auth Store     │
│ • /              │   │ • Skill Store    │
│ • /skills        │   │ • (Habit Store)  │
│ • /habits        │   │ • (Settings)     │
│ • /calendar      │   │                  │
│ • /settings      │   │                  │
└──────────────────┘   └──────────────────┘
               │              │
               └──────┬───────┘
                      │
        ┌─────────────v────────────┐
        │   Components Layer       │
        ├─────────────────────────┤
        │ • AppHeader             │
        │ • AppSidebar            │
        │ • View Components       │
        │ • Feature Components    │
        └──────────────────────────┘
```

## Development Workflow

### Backend Development Path

```
1. Create handler in src-tauri/handlers/
   ↓
2. Add database model to src-tauri/db/models.rs
   ↓
3. Add schema changes to src-tauri/db/schema.rs
   ↓
4. Implement encryption if needed in crypto/
   ↓
5. Register handler in src-tauri/main.rs
   ↓
6. Add tests to handler or crypto modules
   ↓
7. Run: cargo test
```

### Frontend Development Path

```
1. Create component in src/components/ or src/views/
   ↓
2. Define types in component
   ↓
3. Create/update store in src/stores/ if needed
   ↓
4. Add routing in src/router/index.ts if new page
   ↓
5. Update App.vue if layout changes
   ↓
6. Run: npm run build
   ↓
7. Test in: npm run tauri dev
```

### Security-Critical Path

```
For any security changes:
1. Document in SECURITY.md
2. Add comprehensive tests
3. Run: cargo audit
4. Request security review
5. Update CHANGELOG
6. Tag release with security notice
```

## Key Design Patterns

### Rust Backend

- **Module Organization**: Logical separation (crypto, db, handlers)
- **Error Handling**: `Result<T>` type with custom error types
- **State Management**: Thread-safe with `parking_lot::Mutex`
- **Type Safety**: Compile-time guarantees with strong typing

### Vue Frontend

- **Composition API**: Modern Vue 3 patterns with `<script setup>`
- **State Management**: Centralized Pinia stores
- **Routing**: Layout protection with auth guards
- **Reactivity**: Vue's reactive system for UI updates

## Dependencies Overview

### Critical Rust Dependencies

```
- tauri: Cross-platform desktop framework
- sqlx: Async SQL toolkit
- chacha20poly1305: AEAD encryption
- argon2: Password hashing
- serde: Serialization framework
- tokio: Async runtime
- parking_lot: Synchronization primitives
```

### Critical Node Dependencies

```
- vue: Reactive UI framework
- @tauri-apps/api: Tauri bridge
- pinia: State management
- vue-router: Client-side routing
- typescript: Type safety
```

## Next Development Priorities

1. **Backend Integration**: Complete API endpoint implementations
2. **Database Operations**: Implement CRUD operations for all models
3. **Encryption Integration**: Wire encryption into database operations
4. **Frontend API Calls**: Connect Vue components to backend
5. **Testing**: Add unit and integration tests
6. **Performance**: Optimize database queries and rendering

---

This structure provides a solid foundation for building a secure, maintainable skill tracking application!
