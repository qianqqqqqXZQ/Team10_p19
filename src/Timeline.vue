<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Phase } from './content';

const props = defineProps<{ phases: Phase[] }>();
const selected = ref(0);
const current = computed(() => props.phases[selected.value]);
const day = 86400000;
const first = Date.parse('2026-10-01');
const total = (Date.parse('2027-05-01') - first) / day;
const months = [ ['Oct', 31], ['Nov', 30], ['Dec', 31], ['Jan', 31], ['Feb', 28], ['Mar', 31], ['Apr', 30] ] as const;
const barStyle = (phase: Phase) => ({ left: `${((Date.parse(phase.start) - first) / day / total) * 100}%`, width: `${Math.max(0.8, ((Date.parse(phase.end) - Date.parse(phase.start)) / day + 1) / total * 100)}%` });
</script>

<template>
  <div class="timeline-shell">
    <div class="timeline-topline"><span class="panel-label"><span class="status-dot"></span> Project schedule</span><span class="timeline-years">OCT 2026 — APR 2027</span></div>
    <div class="gantt" aria-label="Project phases from October 2026 to April 2027">
      <div class="gantt-heading"><span>Planned phase</span><div class="month-scale"><span v-for="month in months" :key="month[0]" :style="{ flex: month[1] }">{{ month[0] }}<small v-if="month[0] === 'Oct'">2026</small><small v-if="month[0] === 'Jan'">2027</small></span></div></div>
      <button v-for="(phase, index) in phases" :key="phase.id" class="gantt-row" :class="{ selected: selected === index }" :aria-pressed="selected === index" @click="selected = index">
        <span class="phase-label"><span class="phase-number">{{ String(index + 1).padStart(2, '0') }}</span>{{ phase.title }}</span>
        <span class="phase-track"><span v-for="(_, i) in months.slice(0, 6)" :key="i" class="grid-line" :style="{ left: `${months.slice(0, i + 1).reduce((sum, m) => sum + m[1], 0) / total * 100}%` }"></span><span class="phase-bar" :class="phase.kind" :style="barStyle(phase)"></span></span>
        <span class="mobile-phase-date">{{ phase.date }} <span aria-hidden="true">↗</span></span>
      </button>
    </div>
    <div class="mobile-phases" aria-label="Project phases by date">
      <details v-for="(phase, index) in phases" :key="phase.id" :data-kind="phase.kind">
        <summary><span class="phase-number">{{ String(index + 1).padStart(2, '0') }}</span><div><strong>{{ phase.title }}</strong><small>{{ phase.date }}</small></div><span class="expand-indicator" aria-hidden="true">+</span></summary>
        <div class="phase-detail">
          <p v-if="phase.kind === 'light'" class="workload-note">At most one small asynchronous task per member per week, adjusted to availability. No critical integration, required training runs, or participant trials.</p>
          <ul><li v-for="task in phase.tasks" :key="task" v-html="task"></li></ul>
        </div>
      </details>
    </div>
    <div class="timeline-legend"><span><i class="legend-active"></i>Concentrated development</span><span><i class="legend-review"></i>Document review</span><span><i class="legend-light"></i>Low workload</span></div>
    <div class="phase-detail desktop-phase-detail" aria-live="polite" aria-atomic="true">
      <div class="phase-detail-heading"><span class="eyebrow">PHASE {{ String(selected + 1).padStart(2, '0') }}</span><span class="phase-date">{{ current.date }}</span></div>
      <h3>{{ current.title }}</h3>
      <p v-if="current.kind === 'light'" class="workload-note">At most one small asynchronous task per member per week, adjusted to availability. No critical integration, required training runs, or participant trials.</p>
      <ul><li v-for="task in current.tasks" :key="task" v-html="task"></li></ul>
    </div>
  </div>
</template>
