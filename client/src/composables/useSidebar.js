import { ref, watch } from 'vue'

const STORAGE_KEY = 'inventory-management.sidebar-collapsed'

// Read initial value from localStorage (singleton, runs once at module load)
let initialValue = false
try {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored !== null) {
    initialValue = stored === 'true'
  }
} catch {
  // localStorage unavailable — default to expanded
}

// Module-level singleton ref
const isCollapsed = ref(initialValue)

// Persist changes to localStorage
watch(isCollapsed, (val) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(val))
  } catch {
    // Ignore write failures
  }
})

export function useSidebar() {
  const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value
  }

  return {
    isCollapsed,
    toggleSidebar
  }
}
