# 💎 UPGEM - Level Up Your Life

A privacy-focused, gamified skill management platform with state-of-the-art security, habit tracking, and modern Material UI design.

> **UPGEM** = **UP**grade + **GEM** - Your personal gem for leveling up skills and habits!

## 🎮 Gamification Features

- **XP System**: Earn experience points for completing habits and practicing skills
- **Leveling**: Progress through levels as you accumulate XP
- **Achievements**: Unlock achievements for reaching milestones
- **Streaks**: Build daily streaks for consistency bonuses
- **Activity Feed**: Track all your progress in real-time

## 🔒 Security Features

- **End-to-End Encryption**: All sensitive data encrypted with ChaCha20-Poly1305 AEAD cipher
- **Zero-Knowledge Architecture**: Master password never leaves encrypted storage
- **Secure Key Derivation**: Argon2id-based key derivation with strong PBKDF2 expansion
- **Local-First Data**: All data stored locally with optional encrypted backups
- **No Telemetry**: Complete privacy - no data collection without explicit consent
- **OWASP Compliance**: Security best practices throughout the codebase

## ✨ Features

### Skill Management
- Unlimited skill tracking with progress visualization
- **Skill Habits**: Add daily actions to each skill for faster leveling
- **Markdown Support**: Rich descriptions with markdown formatting
- Skill categorization and organization
- Performance analytics with XP rewards
- Goal setting mechanisms with milestone tracking

### Habit Tracking
- Daily habit monitoring with XP rewards
- Streak tracking with visual indicators
- Customizable reminder system
- Completion statistics and analytics
- Visual habit progress representation

### Calendar & Milestones
- Activity calendar with heat map visualization
- Milestone tracking and goal visualization
- Monthly activity stats
- Color-coded activity levels

### Customization
- **Theme Options**: Light, Dark, and System themes
- **Accent Colors**: 6 beautiful color palettes
- **Notification Settings**: Configurable alerts and reminders
- **Data Export/Import**: Full backup and restore capabilities

## 🚀 Tech Stack

- **Backend**: Rust with Tauri framework
- **Frontend**: Vue 3 with TypeScript
- **Design**: Material UI inspired with modern aesthetics
- **Database**: Encrypted SQLite with sqlx
- **Encryption**: ChaCha20-Poly1305, Argon2
- **State Management**: Pinia
- **UI Framework**: Responsive, accessible design
- **Platform**: Windows, macOS, Linux

## 📦 Project Structure

```
skill-ed/
├── src-tauri/               # Rust backend
│   ├── main.rs             # Application entry point
│   ├── db/                 # Database models and schema
│   ├── crypto/             # Encryption and key derivation
│   ├── handlers/           # API handlers
│   ├── state/              # Application state management
│   └── error.rs            # Error types
├── src/                    # Vue frontend
│   ├── components/         # Reusable components
│   ├── views/              # Page components
│   ├── stores/             # Pinia stores
│   ├── router/             # Vue Router configuration
│   └── main.ts             # Frontend entry point
├── Cargo.toml              # Rust dependencies
├── package.json            # Node dependencies
└── vite.config.ts          # Vite configuration
```

## 🛠️ Development Setup

### Prerequisites

- Rust 1.70+ ([Install](https://www.rust-lang.org/tools/install))
- Node.js 16+ ([Install](https://nodejs.org/))
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/skill-ed/skill-ed.git
   cd skill-ed
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Build and run in development mode**
   ```bash
   npm run tauri dev
   ```

4. **Build for production**
   ```bash
   npm run tauri build
   ```

## 🔐 Security Considerations

### Password Requirements
- Minimum 12 characters
- Must contain uppercase and lowercase letters
- Must contain numeric characters
- Subject to Argon2 hashing with secure salt

### Data Storage
- All sensitive fields encrypted before storage
- Encryption keys derived from master password
- Zero plaintext storage of personal data
- Secure memory handling with parking_lot

### Best Practices
- Regular security audits recommended
- Keep Rust dependencies updated
- Monitor OWASP Top 10 compliance
- Review encryption parameters for changing standards

## 📋 API Endpoints

### Authentication
- `set_master_password(password: String)` - Set master password with validation
- `verify_master_password(password: String)` - Verify password and authenticate

### Skills
- `create_skill(request: CreateSkillRequest)` - Create new skill
- `get_skills()` - Retrieve all skills
- `update_skill(request: UpdateSkillRequest)` - Update skill details
- `delete_skill(skill_id: String)` - Delete skill
- `get_skill_progress(skill_id: String)` - Get skill progress history

### Habits
- `create_habit(request: CreateHabitRequest)` - Create new habit
- `log_habit_completion(habit_id: String)` - Log habit completion
- `get_habit_streak(habit_id: String)` - Get current streak
- `get_habits()` - Retrieve all habits

## 🎨 UI/UX Features

- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Fast load times and smooth interactions
- **Minimalist Design**: Clean, intuitive interface

## 📊 Database Schema

### Core Tables
- `auth_user` - Authentication credentials
- `skills` - Skill records with encryption
- `skill_progress` - Historical progress tracking
- `habits` - Habit definitions
- `habit_completions` - Completion records
- `milestones` - Goals and milestones
- `settings` - Encrypted application settings
- `exports` - Data export history

## 🚀 Deployment

### GitHub Actions CI/CD
- Automated testing on push
- Cross-platform builds (Windows, macOS, Linux)
- Security vulnerability scanning
- Automated releases

### Build Artifacts
- Windows: `.msi` and portable `.exe`
- macOS: `.dmg` and Apple Silicon support
- Linux: AppImage and deb packages

## 📖 Documentation

### Getting Started
- [Installation Guide](./docs/INSTALLATION.md)
- [User Guide](./docs/USER_GUIDE.md)
- [Security Guide](./docs/SECURITY.md)

### Developer Documentation
- [Architecture](./docs/ARCHITECTURE.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
- [API Documentation](./docs/API.md)

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](./CONTRIBUTING.md) for details on our code of conduct and submission process.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Areas
- Feature implementation
- Bug fixes
- Documentation improvements
- Security audits
- Performance optimization
- Internationalization

## 📄 License

This project is dual-licensed under:
- **MIT License** - See [LICENSE-MIT](./LICENSE-MIT)
- **Apache License 2.0** - See [LICENSE-APACHE](./LICENSE-APACHE)

Choose whichever license works best for your use case.

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core architecture and security foundation
- ✅ Basic skill and habit tracking
- 🔄 Authentication and data encryption

### Phase 2
- Machine learning-powered recommendations
- Advanced analytics and reporting
- Mobile application
- Cloud sync option (opt-in, E2E encrypted)

### Phase 3
- Blockchain-based achievement verification
- Community skill exchange platform
- AI-powered learning paths
- Advanced collaboration features

## 🐛 Known Issues

None currently. Please report issues on [GitHub Issues](https://github.com/skill-ed/skill-ed/issues).

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/skill-ed/skill-ed/issues)
- **Discussions**: [GitHub Discussions](https://github.com/skill-ed/skill-ed/discussions)
- **Email**: support@skill-ed.dev

## 🙏 Acknowledgments

- Rust community for excellent security libraries
- Tauri team for the cross-platform framework
- Vue.js community for reactive components

## ⚖️ Legal

### GDPR Compliance
- No data collection without consent
- Local-only data processing
- User-controlled data management
- Easy data export and deletion

### Ethical AI Development
- Transparent AI/ML use cases
- User opt-in for AI features
- No discriminatory algorithms
- Regular bias audits

---

**Built with 🔒 Security and ❤️ Care**

Last Updated: December 2024
