<template>
  <aside class="app-sidebar">
    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item">
        <span class="nav-icon">📊</span>
        <span class="nav-label">Dashboard</span>
      </router-link>
      <router-link to="/skills" class="nav-item">
        <span class="nav-icon">🎯</span>
        <span class="nav-label">Skills</span>
      </router-link>
      <router-link to="/habits" class="nav-item">
        <span class="nav-icon">✅</span>
        <span class="nav-label">Habits</span>
      </router-link>
      <router-link to="/calendar" class="nav-item">
        <span class="nav-icon">📅</span>
        <span class="nav-label">Calendar</span>
      </router-link>
      <router-link to="/settings" class="nav-item">
        <span class="nav-icon">⚙️</span>
        <span class="nav-label">Settings</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app-sidebar {
  width: 240px;
  background-color: var(--surface);
  border-right: 1px solid var(--border-color);
  padding: 16px 0;
  overflow-y: auto;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.nav-item:hover {
  background-color: var(--border-color);
  color: var(--text-primary);
}

.nav-item.router-link-active {
  background-color: var(--primary-color);
  color: white;
}

.nav-icon {
  font-size: 20px;
  width: 24px;
  text-align: center;
}

.nav-label {
  font-weight: 500;
}

@media (max-width: 768px) {
  .app-sidebar {
    display: none;
  }
}
</style>
