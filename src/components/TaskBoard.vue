<template>
  <div class="taskBoard">
    <div class="container">
      <div class="taskBoard__title">Доска задач</div>
      <div class="taskBoard__table">
        <div v-for="status in getStatuses" :key="status" class="taskBoard__tableColumn">
          <div class="taskBoard__tableColumnTitle">
            {{ status }}{{ status !== 'В работе' ? 'о' : '' }}
          </div>
          <div
            class="taskBoard__tableColumnTasks"
            @drop.prevent="onDrop($event, status)"
            @dragover.prevent
            @dragenter.prevent
          >
            <div
              v-for="task in getTasks.filter((task) => task.status === status)"
              :key="task.title"
              draggable="true"
              class="taskBoard__Task"
              @dragstart="
                onDragStart($event, task);
                $event.stopPropagation()
              "
            >
              {{ task.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const taskStore = useTaskStore()

const getTasks = computed(() => taskStore.tasks)
const getStatuses = computed(() => taskStore.statuses)

function onDragStart(event, item) {
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.setData('itemId', item.id.toString())
}

function onDrop(event, status) {
  const itemId = parseInt(event.dataTransfer.getData('itemId'))
  taskStore.updateTask(itemId, status)
}
</script>

<style lang="scss">
.taskBoard {
  padding: 60px 0;
}

.taskBoard__title {
  margin-bottom: 48px;

  color: $primary-black;

  font-family: Montserrat;
  font-size: 32px;
  line-height: 40px;
}

.taskBoard {
  margin: 0 auto;
}

.taskBoard__table {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.taskBoard__tableColumn {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-right: 16px;

  &:last-child {
    margin-right: 0;
  }
}

.taskBoard__tableColumnTitle {
  display: flex;
  padding: 5px 24px;
  margin: 0 auto 40px 0;
  justify-content: center;
  align-items: center;

  border-radius: 39px;
  background: $primary-light-gray;

  color: $primary-black;
  text-align: center;
  font-family: PT Sans Caption;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
}

.taskBoard__tableColumnTasks {
  padding: 16px;
  min-height: 280px;
  padding: 16px;

  border-radius: 24px;
  background: $primary-light-gray-transparent;
}

.taskBoard__Task {
  padding: 24px 32px;

  border-radius: 24px;
  border: 2px solid $primary-soft-gray;
  background: $primary-white;

  color: $primary-black;

  font-family: PT Sans Caption;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;

  &:hover {
    cursor: pointer;
  }
}

@media (max-width: $tablet) {
  .taskBoard {
    display: none;
  }
}
</style>