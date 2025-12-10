# Skill-ED Installation Guide

## System Requirements

### Minimum
- **OS**: Windows 10+, macOS 10.13+, or Ubuntu 18.04+
- **RAM**: 512 MB
- **Storage**: 100 MB available space
- **Processor**: Dual-core 1.5 GHz or better

### Recommended
- **OS**: Windows 11, macOS 12+, or Ubuntu 20.04+
- **RAM**: 2 GB or more
- **Storage**: SSD with 500 MB available space
- **Processor**: Quad-core 2.0 GHz or better

## Installation Methods

### Windows

#### Option 1: Installer (.msi)
1. Download the latest `.msi` file from [Releases](https://github.com/skill-ed/skill-ed/releases)
2. Double-click the installer
3. Follow the installation wizard
4. Launch Skill-ED from Start Menu

#### Option 2: Portable Executable
1. Download the portable `.exe` from Releases
2. Place the file in your desired location
3. Double-click to run (no installation needed)

### macOS

#### Option 1: Disk Image (.dmg)
1. Download the latest `.dmg` file from Releases
2. Open the DMG file
3. Drag Skill-ED to Applications folder
4. Launch from Applications

#### Option 2: Homebrew (Coming Soon)
```bash
brew install skill-ed
```

### Linux

#### AppImage
1. Download the AppImage from Releases
2. Make it executable:
   ```bash
   chmod +x skill-ed-*.AppImage
   ```
3. Run the application:
   ```bash
   ./skill-ed-*.AppImage
   ```

#### Ubuntu/Debian (.deb)
```bash
sudo apt install ./skill-ed_*.deb
skill-ed
```

## Building from Source

### Prerequisites

**All Platforms:**
- Rust 1.70+ ([Install](https://www.rust-lang.org/tools/install))
- Node.js 16+ ([Install](https://nodejs.org/))
- Git

**Windows Additional:**
- Visual Studio Build Tools (or full Visual Studio)
- Windows 10 SDK

**macOS Additional:**
- Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

**Linux Additional:**
- GCC/Clang
- GTK 3.0+ development files

```bash
# Ubuntu/Debian
sudo apt-get install build-essential libssl-dev libgtk-3-dev

# Fedora
sudo dnf install gcc openssl-devel gtk3-devel

# Arch
sudo pacman -S base-devel gtk3 openssl
```

### Build Steps

1. **Clone Repository**
   ```bash
   git clone https://github.com/skill-ed/skill-ed.git
   cd skill-ed
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Development Mode**
   ```bash
   npm run tauri dev
   ```

4. **Production Build**
   ```bash
   npm run tauri build
   ```

   The built application will be in `src-tauri/target/release/`

## First Launch Configuration

### Initial Setup
1. **Set Master Password**
   - Create a strong master password (minimum 12 characters)
   - Must include uppercase, lowercase, and numbers
   - This encrypts all your data locally

2. **Verify Installation**
   - Open Settings → Privacy & Security
   - Confirm encryption is enabled
   - Check for "Zero-knowledge encryption"

### Initial Data
- Application data stored in:
  - **Windows**: `C:\Users\[YourUser]\AppData\Local\skill-ed\`
  - **macOS**: `~/Library/Application Support/skill-ed/`
  - **Linux**: `~/.local/share/skill-ed/` or `$XDG_DATA_HOME/skill-ed/`

## Configuration

### Data Storage
All data is stored locally. No cloud sync by default (opt-in available).

**Database Location:**
- `skill-ed.db` in the app data directory
- Encrypted with your master password

### Themes
- **Dark Mode**: Automatic detection or manual toggle
- **Custom Colors**: Coming in future versions

## Troubleshooting

### Application Won't Start
1. Check system requirements
2. Verify .NET Framework (Windows only) is installed
3. Disable antivirus temporarily to test
4. Check logs in app data directory

### Database Errors
1. Ensure sufficient disk space
2. Verify disk isn't full or corrupted
3. Check file permissions on app data directory
4. Delete `.db-wal` and `.db-shm` files to reset

### High CPU/Memory Usage
1. Close other applications
2. Reduce number of tracked skills/habits
3. Export and archive old data
4. Check for background processes

### Performance Issues
1. Update to latest version
2. Clear browser cache (if applicable)
3. Disable unnecessary animations
4. Check available disk space

## Uninstallation

### Windows
- Use Settings → Apps → Apps & features
- Search for "Skill-ED" and click Uninstall
- Or run the uninstaller from Add/Remove Programs

### macOS
1. Open Finder → Applications
2. Find Skill-ED
3. Drag to Trash or right-click → Move to Trash

### Linux (AppImage)
- Simply delete the AppImage file

### Linux (Debian)
```bash
sudo apt remove skill-ed
```

## Updating

### Automatic Updates
- Application checks for updates on launch
- Download and install when prompted

### Manual Update
1. Download latest version from [Releases](https://github.com/skill-ed/skill-ed/releases)
2. Follow installation steps for your OS
3. Data is preserved from previous installation

## Advanced Configuration

### Command Line Arguments
```bash
skill-ed --help  # Show available arguments
```

### Environment Variables
```bash
SKILL_ED_DATA_DIR=/custom/path  # Custom data directory
RUST_LOG=debug                   # Enable debug logging
```

### Configuration Files
Create `config.toml` in app data directory:

```toml
[ui]
theme = "dark"  # or "light"
language = "en"

[database]
auto_backup = true
backup_interval_hours = 24

[encryption]
auto_lock_minutes = 30
```

## Data Backup

### Manual Backup
1. Go to Settings → Data Management
2. Click "Create Backup"
3. Choose backup location
4. Backup is encrypted and can be restored anytime

### Automatic Backup
- Enable in Settings → Preferences
- Backups created daily by default
- Stored in app data directory

### Restore from Backup
1. Go to Settings → Data Management
2. Click "Restore from Backup"
3. Select backup file
4. Confirm restoration

## Data Export

Export your data for external use:

1. Go to Settings → Data Management
2. Select export format (JSON, CSV, or PDF)
3. Choose export location
4. Data is encrypted during export

Supported formats:
- **JSON**: Full data with metadata
- **CSV**: Skills and habits in spreadsheet format
- **PDF**: Formatted report with charts

## Getting Help

- **Documentation**: Check [README.md](../README.md)
- **Issues**: [GitHub Issues](https://github.com/skill-ed/skill-ed/issues)
- **Discussions**: [GitHub Discussions](https://github.com/skill-ed/skill-ed/discussions)
- **Email**: support@skill-ed.dev

## Next Steps

1. Read [User Guide](./USER_GUIDE.md) for feature overview
2. Check [Security Guide](./SECURITY.md) for privacy info
3. Explore Settings for customization options
4. Start tracking your first skill!

---

For more information, see [README.md](../README.md)
