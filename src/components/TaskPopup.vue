<template>
  <div class="popup__overlay" @click="emit('close')"></div>
  <div class="popup">
    <div class="popup__container">
      <div class="popup__header">
        <div class="popup__title">Изменение задачи</div>
        <img src="/sprite/svg/popup-cross.svg" class="popup__svg" @click="emit('close')" />
      </div>
      <div class="popup__main">
        <div class="popup__mainInputWrapper">
          <input
            v-model="inputValue"
            class="popup__mainInput"
            placeholder="Текст задачи, который можно изменить"
          />
        </div>
        <hr />
        <div class="popup__mainStatusesWrapper">
          <div v-if="status === 'Открыт'" class="popup__mainStatus" @click="changeStatus('В работе')">В работу</div>
          <div v-if="status === 'В работе'" class="popup__mainStatus" @click="changeStatus('Открыт')">Отложить</div>
          <div v-if="status === 'Закрыт'" class="popup__mainStatus" @click="changeStatus('Открыт')">Переоткрыть</div>
          <div v-if="status === 'Открыт' || status === 'В работе'" class="popup__mainStatus" @click="changeStatus('Закрыт')">
            Закрыть
          </div>
        </div>
      </div>
      <div class="popup__footer">
        <div class="popup__accept" @click="taskStore.updateTask(taskStore.selectedTaskId, status, inputValue); emit('close')">Применить</div>
        <div class="popup__delete" @click="taskStore.deleteTask(taskStore.selectedTaskId); emit('close')">Удалить задачу</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTaskStore } from '@/stores/taskStore'

import { ref } from 'vue'

const emit = defineEmits(['close'])

const taskStore = useTaskStore()

const activeTask = taskStore.tasks.filter((task) => task.id === taskStore.selectedTaskId)[0]

const inputValue = ref(activeTask.title)
const status = ref(activeTask.status)

function changeStatus(newStatus) {
  status.value = newStatus
}
</script>

<style lang="scss">
.popup__overlay {
  position: fixed;
  z-index: 50;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Чтобы верстка сзади попапа размылась */
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  display: flex;
  position: fixed;
  z-index: 100;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 16px;
  background: $primary-white;
  animation: fadeIn 0.5s ease;
}

.popup__container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 272px;
  padding: 24px;
}

.popup__header {
  display: flex;
  justify-content: space-between;
}

.popup__title {
  color: $primary-black;
  font-family: Montserrat;
  font-size: 18px;
  line-height: 26px;
}

.popup__svg {
  &:hover {
    cursor: pointer;
  }
}

.popup__main {
  display: flex;
  flex-direction: column;
  gap: 16px;

  & hr {
    fill: $primary-soft-gray;
  }
}

.popup__mainInputWrapper {
  border-radius: 24px;
  border: 1px solid $primary-light-gray;
}

.popup__mainInput {
  width: 100%;
  padding: 16px 0 16px 16px;
  border-radius: 24px;
  border: $full-transparent;
  outline: none;

  &::placeholder {
    color: $primary-black;
    font-family: PT Sans Caption;
    font-size: 12px;

    line-height: 20px;
    transition: opacity 0.3s ease-out;

    user-select: none;
  }

  &:focus::placeholder {
    opacity: 0;
  }
}

.popup__mainStatusesWrapper {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.popup__mainStatus {
  display: flex;
  padding: 5px 16px;
  align-items: center;
  border-radius: 39px;
  background: $primary-light-gray;

  color: $primary-black;
  font-family: PT Sans Caption;
  font-size: 12px;
  line-height: 20px;

  &:hover {
    cursor: pointer;
  }
}

.popup__footer {
  display: flex;
  justify-content: space-between;
}

.popup__accept {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 50px;
  background: $primary-orange;

  color: $primary-white;
  font-family: PT Sans Caption;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;

  &:hover {
    cursor: pointer;
  }
}

.popup__delete {
  display: flex;
  padding: 12px 16px;
  border-radius: 50px;
  border: 2px solid $primary-orange;

  color: $primary-orange;
  font-family: PT Sans Caption;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;

  &:hover {
    cursor: pointer;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>