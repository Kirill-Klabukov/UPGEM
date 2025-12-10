# Skill-ED User Guide

Welcome to Skill-ED! This guide will help you get the most out of our secure skill and habit tracking application.

## Getting Started

### First Launch

1. **Set Your Master Password**
   - Create a strong, memorable password (minimum 12 characters)
   - Include uppercase, lowercase, and numeric characters
   - This password encrypts all your data locally
   - You cannot recover data without this password!

2. **Explore the Dashboard**
   - View your overall progress
   - See your current statistics
   - Access quick actions

## Main Features

### Dashboard

The dashboard provides a quick overview of your progress:

- **Skills Tracked**: Total number of skills you're managing
- **Daily Habits**: Number of active daily habits
- **Day Streak**: Current consecutive days of habit completion
- **Hours Practiced**: Total time invested across all skills

### Skills Management

#### Creating a Skill

1. Navigate to **Skills** → Click **+ Add Skill**
2. Enter skill details:
   - **Name**: Unique skill name (e.g., "Python Programming")
   - **Category**: Skill category (e.g., "Programming")
   - **Description**: Optional details about your goals
3. Click **Add Skill**

#### Tracking Progress

For each skill, track:
- **Proficiency Level** (0-100%): Your current mastery level
- **Total Hours**: Hours spent practicing
- **Notes**: Encrypted personal notes about your progress

#### Skill Categories

Suggested categories:
- **Technical**: Programming, software design, data science
- **Languages**: Foreign languages, linguistics
- **Creative**: Art, music, writing, design
- **Professional**: Leadership, communication, project management
- **Physical**: Sports, fitness, martial arts
- **Academic**: Mathematics, science, history

### Habits Tracking

#### Creating a Habit

1. Navigate to **Habits** → Click **+ Add Habit**
2. Configure habit:
   - **Name**: What habit to track (e.g., "Morning Exercise")
   - **Frequency**: Daily, Weekly, or Monthly
   - **Description**: Optional motivation or details
3. Click **Create Habit**

#### Logging Completions

1. Go to **Habits** page
2. Find your habit card
3. Click **✓ Complete** to log today's completion
4. System automatically updates your streak

#### Streak System

- **Current Streak**: Days in a row you've completed the habit
- **Best Streak**: Your longest streak ever
- **Completion**: System calculates based on habit frequency
- **Visual Feedback**: See progress at a glance

### Calendar & Milestones

#### Setting Milestones

1. Navigate to **Calendar**
2. Click **+ New Milestone**
3. Set milestone details:
   - **Title**: What you're aiming for
   - **Target Date**: When you want to achieve it
   - **Associated Skill**: Link to a skill (optional)
   - **Description**: Detailed goal description

#### Viewing Progress

- **Color-Coded Calendar**: Visual representation of activity
- **Milestone Timeline**: See all your goals and deadlines
- **Completion Tracking**: Mark milestones as complete

### Settings

#### Privacy & Security

- **Change Master Password**: Update your password anytime
- **Encryption Status**: View encryption details
- **Data Encryption**: Confirm end-to-end encryption is active

#### Data Management

- **Export Data**: Download your data as JSON, CSV, or PDF
- **Create Backup**: Generate encrypted backup files
- **Restore from Backup**: Recover from previous backups
- **Data Privacy**: Review what data is stored

#### Preferences

- **Theme**: Choose between dark and light mode
- **Language**: Select your preferred language
- **Auto-lock**: Set timeout for automatic logout
- **Notifications**: Configure reminder settings

## Tips & Best Practices

### Setting Effective Goals

1. **Be Specific**: "Learn Python" → "Complete 30 Python courses"
2. **Make Goals Measurable**: Track hours, modules, or milestones
3. **Set Realistic Timelines**: Break long goals into phases
4. **Review Regularly**: Adjust goals based on progress

### Building Consistent Habits

1. **Start Small**: Begin with manageable daily commitments
2. **Track Everything**: Log every completion for momentum
3. **Use Streaks**: Leverage the psychological power of streaks
4. **Reward Milestones**: Celebrate achievements at target points

### Effective Skill Tracking

1. **Log Practice Time**: Record hours spent on each skill
2. **Update Proficiency**: Honestly assess your level regularly
3. **Add Notes**: Document what you've learned
4. **Set Milestones**: Break skills into concrete achievements

### Organization Tips

1. **Meaningful Categories**: Group related skills logically
2. **Consistent Naming**: Use clear, searchable skill names
3. **Regular Reviews**: Weekly review of progress and goals
4. **Archive Old Data**: Export and backup completed goals

## Privacy & Security

### Your Data is Safe

- **Local Storage**: All data stored on your device
- **Strong Encryption**: ChaCha20-Poly1305 encryption
- **No Telemetry**: Zero data collection or tracking
- **Open Source**: Code auditable by the community

### Password Security

- **Minimum Requirements**: 12+ characters with mixed case and numbers
- **Argon2 Hashing**: Military-grade password hashing
- **No Recovery**: Lost passwords cannot be recovered
- **Unique Passwords**: Don't reuse passwords from other apps

### Backup Security

- **Encrypted Backups**: All backups are encrypted
- **Local Backups**: Stored on your computer
- **Regular Backups**: Automatic daily backups available
- **Easy Restore**: Restore from any previous backup

## Troubleshooting

### Forgot Master Password
Unfortunately, if you forget your master password, your data cannot be recovered. This is by design for security.

**Prevention**: Write down your password or use a password manager.

### Lost Data
1. Check if you have a recent backup
2. Use **Settings → Data Management → Restore from Backup**
3. Select your most recent backup file

### Sync Issues
Skill-ED works offline-first. Changes sync automatically when connectivity returns.

### Performance Issues
1. Archive old completed skills
2. Export data regularly
3. Clear old habit records
4. Close other applications

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Dashboard | `Ctrl+1` / `Cmd+1` |
| Skills | `Ctrl+2` / `Cmd+2` |
| Habits | `Ctrl+3` / `Cmd+3` |
| Calendar | `Ctrl+4` / `Cmd+4` |
| Settings | `Ctrl+,` / `Cmd+,` |
| New Item | `Ctrl+N` / `Cmd+N` |
| Search | `Ctrl+F` / `Cmd+F` |
| Lock App | `Ctrl+L` / `Cmd+L` |

## Export & Import

### Exporting Data

1. **Settings → Data Management**
2. Click **Export Data**
3. Choose format:
   - **JSON**: Complete data with all metadata
   - **CSV**: Skills and habits in spreadsheet format
   - **PDF**: Formatted report with visualizations

### Importing Data

Currently, imports are not supported to maintain data integrity. 

**Workaround**: 
- Maintain separate JSON exports
- Create new skills/habits and manually reference exported data

## Advanced Features (Coming Soon)

- **Machine Learning Recommendations**: AI-powered skill suggestions
- **Learning Paths**: Structured learning journey recommendations
- **Community Sharing**: Benchmark against skill standards
- **Mobile App**: Native iOS/Android applications
- **Cloud Sync**: Optional encrypted cloud backup

## Getting Help

- **FAQ**: Check our [FAQ](./FAQ.md)
- **Issues**: [GitHub Issues](https://github.com/skill-ed/skill-ed/issues)
- **Discussions**: [GitHub Discussions](https://github.com/skill-ed/skill-ed/discussions)
- **Email**: support@skill-ed.dev

## Feature Requests

Have an idea for Skill-ED? We'd love to hear it!

1. Check [GitHub Issues](https://github.com/skill-ed/skill-ed/issues)
2. Create a new issue with your request
3. Include use cases and benefits
4. Vote on existing features you support

## Feedback

Your feedback helps us improve! Share:
- Bug reports and issues
- Feature requests and suggestions
- UX improvements
- Documentation updates

---

**Happy Learning and Building Habits!** 🎉

For technical documentation, see [README.md](../README.md)
