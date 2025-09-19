<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  message: string | null;
  type?: 'success' | 'error' | 'info' | 'warning';
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
});

const statusClass = computed(() => {
  return {
    'status-bar': true,
    [`status-${props.type}`]: true,
    'status-hidden': !props.message,
  };
});
</script>

<template>
  <div :class="statusClass" v-if="message">
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.status-bar {
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  text-align: center;
  transition: all 0.3s ease-in-out;
  width: 100%;
  box-sizing: border-box;
}

.status-hidden {
  opacity: 0;
  height: 0;
  padding: 0;
  margin: 0;
  border: none;
}

.status-info {
  color: #004085;
  background-color: #cce5ff;
  border-color: #b8daff;
}

.status-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.status-warning {
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeeba;
}

.status-error {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}
</style>
