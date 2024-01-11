<template>
  <div class="pageContainer">
    <header></header>
    <main>
      <ToDoList />
      <TaskBoard />
    </main>
    <footer></footer>
  </div>
</template>

<script setup>
import ToDoList from '@/components/ToDoList.vue'
import TaskBoard from '@/components/TaskBoard.vue'

import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()

taskStore.initializeFromLocalStorage()
</script>

<style scoped>

</style>
