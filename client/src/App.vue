<template>
  <div class="app" :class="{ 'sidebar-is-collapsed': isCollapsed }">
    <aside class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
      <!-- Brand block -->
      <div class="sidebar-brand">
        <div class="brand-full">
          <strong class="brand-name">{{ t('nav.companyName') }}</strong>
          <span class="brand-subtitle">{{ t('nav.subtitle') }}</span>
        </div>
        <div class="brand-mono" aria-hidden="true">
          <div class="brand-avatar">{{ t('nav.companyName').charAt(0) }}</div>
        </div>
        <button
          class="sidebar-toggle"
          @click="toggleSidebar"
          :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline v-if="!isCollapsed" points="10,4 6,8 10,12"/>
            <polyline v-else points="6,4 10,8 6,12"/>
          </svg>
        </button>
      </div>
      <div class="sidebar-divider"></div>

      <!-- Primary nav -->
      <nav class="sidebar-nav">
        <router-link to="/" :class="{ active: $route.path === '/' }" class="nav-item">
          <svg class="nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="6" height="6" rx="1"/>
            <rect x="10" y="2" width="6" height="6" rx="1"/>
            <rect x="2" y="10" width="6" height="6" rx="1"/>
            <rect x="10" y="10" width="6" height="6" rx="1"/>
          </svg>
          <span class="nav-label">{{ t('nav.overview') }}</span>
        </router-link>

        <router-link to="/inventory" :class="{ active: $route.path === '/inventory' }" class="nav-item">
          <svg class="nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 5.5L9 2L16 5.5V12.5L9 16L2 12.5V5.5Z"/>
            <path d="M9 2V16"/>
            <path d="M2 5.5L9 9L16 5.5"/>
          </svg>
          <span class="nav-label">{{ t('nav.inventory') }}</span>
        </router-link>

        <router-link to="/orders" :class="{ active: $route.path === '/orders' }" class="nav-item">
          <svg class="nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3H5L6.5 10.5H13.5L15 6H7"/>
            <circle cx="7.5" cy="13.5" r="1"/>
            <circle cx="12.5" cy="13.5" r="1"/>
          </svg>
          <span class="nav-label">{{ t('nav.orders') }}</span>
        </router-link>

        <router-link to="/spending" :class="{ active: $route.path === '/spending' }" class="nav-item">
          <svg class="nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="9" r="7"/>
            <path d="M9 5.5V6.5"/>
            <path d="M9 11.5V12.5"/>
            <path d="M11 7.5C11 6.9 10.1 6.5 9 6.5C7.9 6.5 7 7 7 7.75C7 8.5 7.9 8.75 9 9C10.1 9.25 11 9.5 11 10.25C11 11 10.1 11.5 9 11.5C7.9 11.5 7 11.1 7 10.5"/>
          </svg>
          <span class="nav-label">{{ t('nav.finance') }}</span>
        </router-link>

        <router-link to="/demand" :class="{ active: $route.path === '/demand' }" class="nav-item">
          <svg class="nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="2,13 7,8 10,11 16,5"/>
            <polyline points="12,5 16,5 16,9"/>
          </svg>
          <span class="nav-label">{{ t('nav.demandForecast') }}</span>
        </router-link>

        <router-link to="/reports" :class="{ active: $route.path === '/reports' }" class="nav-item">
          <svg class="nav-icon" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="2" width="12" height="14" rx="1"/>
            <path d="M6 6H12"/>
            <path d="M6 9H12"/>
            <path d="M6 12H9"/>
          </svg>
          <span class="nav-label">Reports</span>
        </router-link>
      </nav>

      <!-- Bottom pinned area -->
      <div class="sidebar-bottom">
        <LanguageSwitcher />
        <ProfileMenu
          @show-profile-details="showProfileDetails = true"
          @show-tasks="showTasks = true"
        />
      </div>
    </aside>

    <div class="main-column">
      <FilterBar />
      <main class="main-content">
        <router-view />
      </main>
    </div>

    <ProfileDetailsModal
      :is-open="showProfileDetails"
      @close="showProfileDetails = false"
    />

    <TasksModal
      :is-open="showTasks"
      :tasks="tasks"
      @close="showTasks = false"
      @add-task="addTask"
      @delete-task="deleteTask"
      @toggle-task="toggleTask"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { api } from './api'
import { useAuth } from './composables/useAuth'
import { useI18n } from './composables/useI18n'
import { useSidebar } from './composables/useSidebar'
import FilterBar from './components/FilterBar.vue'
import ProfileMenu from './components/ProfileMenu.vue'
import ProfileDetailsModal from './components/ProfileDetailsModal.vue'
import TasksModal from './components/TasksModal.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

export default {
  name: 'App',
  components: {
    FilterBar,
    ProfileMenu,
    ProfileDetailsModal,
    TasksModal,
    LanguageSwitcher
  },
  setup() {
    const { currentUser } = useAuth()
    const { t } = useI18n()
    const { isCollapsed, toggleSidebar } = useSidebar()
    const showProfileDetails = ref(false)
    const showTasks = ref(false)
    const apiTasks = ref([])

    // Merge mock tasks from currentUser with API tasks
    const tasks = computed(() => {
      return [...currentUser.value.tasks, ...apiTasks.value]
    })

    const loadTasks = async () => {
      try {
        apiTasks.value = await api.getTasks()
      } catch (err) {
        console.error('Failed to load tasks:', err)
      }
    }

    const addTask = async (taskData) => {
      try {
        const newTask = await api.createTask(taskData)
        // Add new task to the beginning of the array
        apiTasks.value.unshift(newTask)
      } catch (err) {
        console.error('Failed to add task:', err)
      }
    }

    const deleteTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const isMockTask = currentUser.value.tasks.some(t => t.id === taskId)

        if (isMockTask) {
          // Remove from mock tasks
          const index = currentUser.value.tasks.findIndex(t => t.id === taskId)
          if (index !== -1) {
            currentUser.value.tasks.splice(index, 1)
          }
        } else {
          // Remove from API tasks
          await api.deleteTask(taskId)
          apiTasks.value = apiTasks.value.filter(t => t.id !== taskId)
        }
      } catch (err) {
        console.error('Failed to delete task:', err)
      }
    }

    const toggleTask = async (taskId) => {
      try {
        // Check if it's a mock task (from currentUser)
        const mockTask = currentUser.value.tasks.find(t => t.id === taskId)

        if (mockTask) {
          // Toggle mock task status
          mockTask.status = mockTask.status === 'pending' ? 'completed' : 'pending'
        } else {
          // Toggle API task
          const updatedTask = await api.toggleTask(taskId)
          const index = apiTasks.value.findIndex(t => t.id === taskId)
          if (index !== -1) {
            apiTasks.value[index] = updatedTask
          }
        }
      } catch (err) {
        console.error('Failed to toggle task:', err)
      }
    }

    onMounted(loadTasks)

    return {
      t,
      showProfileDetails,
      showTasks,
      tasks,
      addTask,
      deleteTask,
      toggleTask,
      isCollapsed,
      toggleSidebar
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f8fafc;
  color: #1e293b;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ─── Layout ─────────────────────────────────────────────────── */
.app {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
  transition: grid-template-columns 0.2s ease;
}

.app.sidebar-is-collapsed {
  grid-template-columns: 64px 1fr;
}

/* ─── Sidebar ─────────────────────────────────────────────────── */
.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Brand block */
.sidebar-brand {
  padding: 1.25rem 1rem 1rem;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.sidebar-brand .brand-full {
  flex: 1;
  min-width: 0;
}

/* Sidebar toggle button */
.sidebar-toggle {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;
}

.sidebar-toggle:hover {
  border-color: #e2e8f0;
  color: #0f172a;
}

.sidebar-toggle:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.brand-full {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 0.813rem;
  color: #64748b;
  font-weight: 400;
  line-height: 1.4;
}

.brand-mono {
  display: none;
}

.brand-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.025em;
}

.sidebar-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0 1rem;
  flex-shrink: 0;
}

/* Primary nav */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.75rem 0.75rem;
  flex: 1;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border-radius: 6px;
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
  white-space: nowrap;
  overflow: hidden;
}

.nav-item:hover {
  color: #0f172a;
  background: #f1f5f9;
}

.nav-item:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.nav-item.active {
  color: #2563eb;
  background: #eff6ff;
}

.nav-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 3px;
  background: #2563eb;
  border-radius: 0 2px 2px 0;
}

.nav-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

.nav-label {
  flex: 1;
}

/* Bottom pinned area */
.sidebar-bottom {
  margin-top: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
}

/* ─── Main column ─────────────────────────────────────────────── */
.main-column {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.main-content {
  flex: 1;
  padding: 1.5rem 2rem;
  max-width: 1400px;
  width: 100%;
}

/* ─── Global page components ─────────────────────────────────── */
.page-header {
  margin-bottom: 1.5rem;
}

.page-header h2 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.375rem;
  letter-spacing: -0.025em;
}

.page-header p {
  color: #64748b;
  font-size: 0.938rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  padding: 1.25rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.stat-label {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.625rem;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
}

.stat-card.warning .stat-value {
  color: #ea580c;
}

.stat-card.success .stat-value {
  color: #059669;
}

.stat-card.danger .stat-value {
  color: #dc2626;
}

.stat-card.info .stat-value {
  color: #2563eb;
}

.card {
  background: white;
  border-radius: 10px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.25rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid #e2e8f0;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.025em;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
}

th {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-weight: 600;
  color: #475569;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

td {
  padding: 0.5rem 0.75rem;
  border-top: 1px solid #f1f5f9;
  color: #334155;
  font-size: 0.875rem;
}

tbody tr {
  transition: background-color 0.15s ease;
}

tbody tr:hover {
  background: #f8fafc;
}

.badge {
  display: inline-block;
  padding: 0.313rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge.success {
  background: #d1fae5;
  color: #065f46;
}

.badge.warning {
  background: #fed7aa;
  color: #92400e;
}

.badge.danger {
  background: #fecaca;
  color: #991b1b;
}

.badge.info {
  background: #dbeafe;
  color: #1e40af;
}

.badge.increasing {
  background: #d1fae5;
  color: #065f46;
}

.badge.decreasing {
  background: #fecaca;
  color: #991b1b;
}

.badge.stable {
  background: #e0e7ff;
  color: #3730a3;
}

.badge.high {
  background: #fecaca;
  color: #991b1b;
}

.badge.medium {
  background: #fed7aa;
  color: #92400e;
}

.badge.low {
  background: #dbeafe;
  color: #1e40af;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #64748b;
  font-size: 0.938rem;
}

.error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.938rem;
}

/* ─── Collapsed sidebar (manual toggle) ──────────────────────── */
.sidebar-collapsed {
  width: 64px;
}

.sidebar-collapsed .sidebar-brand {
  padding: 1rem 0;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
}

.sidebar-collapsed .brand-full {
  display: none;
}

.sidebar-collapsed .brand-mono {
  display: flex;
  justify-content: center;
}

.sidebar-collapsed .sidebar-divider {
  margin: 0 0.5rem;
}

.sidebar-collapsed .sidebar-nav {
  padding: 0.75rem 0.5rem;
  align-items: center;
}

.sidebar-collapsed .nav-item {
  padding: 0.625rem;
  justify-content: center;
  width: 100%;
}

.sidebar-collapsed .nav-label {
  display: none;
}

.sidebar-collapsed .sidebar-bottom {
  padding: 0.5rem;
  align-items: center;
}

/* ─── Responsive: icon-only rail at ≤ 768px ─────────────────── */
@media (max-width: 768px) {
  .app {
    grid-template-columns: 64px 1fr;
  }

  .sidebar {
    width: 64px;
  }

  .sidebar-brand {
    padding: 1rem 0;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
  }

  .brand-full {
    display: none;
  }

  .brand-mono {
    display: flex;
    justify-content: center;
  }

  .sidebar-divider {
    margin: 0 0.5rem;
  }

  .sidebar-nav {
    padding: 0.75rem 0.5rem;
    align-items: center;
  }

  .nav-item {
    padding: 0.625rem;
    justify-content: center;
    width: 100%;
  }

  .nav-label {
    display: none;
  }

  .sidebar-bottom {
    padding: 0.5rem;
    align-items: center;
  }

  .main-content {
    padding: 1rem 1.25rem;
  }

  /* Hide toggle on narrow viewports — CSS forces rail state already */
  .sidebar-toggle {
    display: none;
  }
}
</style>
