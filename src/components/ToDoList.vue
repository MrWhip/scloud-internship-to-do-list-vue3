<template>
  <TaskPopup v-if="isPopupVisible" @close="hidePopup"/>
  <div class="todolist">
    <div class="container">
      <div class="todolist__title">ToDo List Scloud</div>
      <div class="taskBar__wrapper">
        <div class="taskBar__upperCard">
          <div class="taskBar__title">Текущие задачи</div>
          <div class="currentTasks__statusesWrapper">
            <div
              v-for="{ title, iconLink, count } in countBlock"
              :key="title"
              class="currentTasks__status"
            >
              <img class="currentTasks__statusSvg" :src="iconLink" />
              <div class="currentTasks__statusText">
                {{ title }}{{ title !== 'В работе' ? 'о' : '' }} - {{ count }}
              </div>
            </div>
          </div>
        </div>
        <div class="taskBar__upperCard">
          <div class="taskBar__title">Добавить задачу</div>
          <div class="addTask__addWrapper">
            <div v-if="isWindowNarrow" class="addTask__addButton" @click="addTask">
              Добавить задачу
            </div>
            <img v-else class="addTask__addButtonSvg" src="/sprite/svg/plus.svg" @click="addTask" />
            <div class="addTask__inputWrapper">
              <input
                v-model="inputValue"
                class="addTask__input"
                placeholder="Текст"
                @keyup.enter="addTask"
              />
              <img class="addTask__inputSvg" src="/sprite/svg/cross.svg" @click="clearInput" />
            </div>
          </div>
        </div>
      </div>
      <div class="taskList">
        <div class="taskList__wrapper">
          <div class="taskList__titlesWrapper">
            <div class="taskList__title taskList__firstColumn">Задачи</div>
            <div class="taskList__title taskList__secondColumn">Статус</div>
          </div>
          <div v-for="{ id, title, status } in showTaskMassive" :key="id" class="taskList__task">
            <div class="taskList__row">
              <div class="taskList__firstColumn">
                <div class="taskList__taskTitle">{{ title }}</div>
              </div>
              <div class="taskList__secondColumn">
                <div class="taskList__taskStatus" @click="showPopup(id)">
                  {{ status }}
                </div>
              </div>
            </div>
            <hr />
          </div>
        </div>
      </div>
      <transition name="more">
        <div v-if="getShowMoreTasksButton" class="taskList__moreTransition" @click="showAllTasks">
          <div class="taskList__moreWrapper">
            <div class="taskList__moreText">
              {{ showAllTasksStatus ? 'Скрыть' : 'Показать еще' }}
            </div>
            <img
              :class="{ taskList__moreSvgTransform: showAllTasksStatus }"
              src="/sprite/svg/chevron-down.svg"
            />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import TaskPopup from '@/components/TaskPopup.vue'

import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

const isPopupVisible = ref(false)

const taskStore = useTaskStore()

const inputValue = ref('')

const showAllTasksStatus = ref(false)

const isWindowNarrow = ref(window.innerWidth <= 640)

const getTasksCount = computed(() => taskStore.taskCount)
const getTasksOpennedCount = computed(() => taskStore.taskOpennedCount)
const getTasksWorksCount = computed(() => taskStore.taskWorksCount)
const getTasksClosedCount = computed(() => taskStore.taskClosedCount)
const getShowMoreTasksButton = computed(() => getTasksCount.value > 5)

watch([getShowMoreTasksButton], () => {
  showAllTasksStatus.value = false
})

const showTaskMassive = computed(() =>
  showAllTasksStatus.value ? taskStore.sortedTasks : taskStore.sortedTasks.slice(0, 5)
)

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const countBlock = ref([
  {
    title: 'Открыт',
    iconLink: '/sprite/svg/info-blue.svg',
    count: getTasksOpennedCount
  },
  {
    title: 'В работе',
    iconLink: '/sprite/svg/info-orange.svg',
    count: getTasksWorksCount
  },
  {
    title: 'Закрыт',
    iconLink: '/sprite/svg/info-green.svg',
    count: getTasksClosedCount
  }
])

function clearInput() {
  inputValue.value = ''
}

function addTask() {
  // Если input пустой, то ничего не делаем
  if (inputValue.value.trim() === '') {
    return
  }

  taskStore.addTask({
    title: inputValue.value,
    status: 'Открыт'
  })

  clearInput()
}

function showAllTasks() {
  showAllTasksStatus.value = !showAllTasksStatus.value
}

function handleResize() {
  isWindowNarrow.value = window.innerWidth <= 640
}

function showPopup(id) {
  taskStore.selectedTaskId = id
  isPopupVisible.value = true
  disableScroll()
}

function hidePopup() {
  isPopupVisible.value = false
  enableScroll()
}

function disableScroll() {
  document.body.style.overflow = 'hidden';
}

function enableScroll() {
  document.body.style.overflow = 'auto';
}
</script>

<style lang="scss">
.todolist {
  background: $primary-light-gray;

  padding-bottom: 60px;
}

.todolist__title {
  width: 100%;
  margin-bottom: 48px;

  color: $primary-black;

  font-family: 'Montserrat';
  font-size: 32px;
  line-height: 40px;
}

.taskBar__wrapper {
  display: flex;
  width: 100%;
  margin: 0 auto 60px auto;
  gap: 26px;
}

.taskBar__upperCard {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 40px 24px;

  border-radius: 48px;
  background: $primary-white;
}

.taskBar__title {
  margin-bottom: 24px;
  color: $primary-black;
  font-family: PT Sans Caption;
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
}

.currentTasks__status {
  display: flex;
  padding: 12px 24px;
  justify-content: center;
  align-items: center;

  border-radius: 50px;
  border: 1px solid $primary-soft-gray;
  background: $primary-white;

  &:last-child {
    margin-right: 0;
  }
}

.currentTasks__statusesWrapper {
  display: flex;
  justify-content: space-between; // По макету gap 28px, но в таком случае при двузначном количестве задач верстка поедет
}

.currentTasks__statusSvg {
  margin-right: 8px;
}

.currentTasks__statusText {
  color: $primary-black;
  font-family: PT Sans Caption;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
}

.addTask__addWrapper {
  display: flex;
  justify-content: center;
}

.addTask__addButtonSvg {
  margin-right: 15px;

  &:hover {
    cursor: pointer;
  }
}

.addTask__inputWrapper {
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 100px;
  border: 1px solid $primary-soft-gray;
  background: $primary-white;

  &:hover .addTask__inputSvg {
    opacity: 1;
  }
}

.addTask__inputSvg {
  margin-right: 16px;
  opacity: 0;
  transition: opacity 0.3s ease-out;

  &:hover {
    cursor: pointer;
  }
}

.addTask__addButton {
  display: flex;
  padding: 8px 24px;
  justify-content: center;
  align-items: center;
  align-self: stretch;

  border-radius: 50px;
  background: $primary-orange;

  color: $primary-white;
  text-align: center;
  font-family: PT Sans Caption;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
}

.addTask__input {
  width: 100%;
  padding-left: 16px;
  border: $full-transparent;
  border-top-left-radius: 100px;
  border-bottom-left-radius: 100px;
  outline: none;

  &::placeholder {
    color: $primary-black;
    font-family: PT Sans;
    font-size: 14px;
    line-height: 24px;
    transition: opacity 0.3s ease-out;

    user-select: none;
  }

  &:focus + .addTask__inputSvg {
    opacity: 1;
  }

  &:focus::placeholder {
    opacity: 0;
  }
}

.taskList {
  width: 100%;
  margin: 0 auto;

  border-radius: 48px;
  background: $primary-white;
}

.taskList__wrapper {
  display: flex;
  flex-direction: column;
  padding: 40px;
}

.taskList__titlesWrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.taskList__title {
  color: $primary-black;
  font-family: PT Sans Caption;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
  margin-bottom: 24px;
}

.taskList__firstColumn {
  width: 100%;
}

.taskList__secondColumn {
  display: flex;
  justify-content: center;
  width: 106px;
}

.taskList__row {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}

.taskList__task {
  hr {
    background: $primary-soft-gray;
    margin-bottom: 10px;
    border-width: 0 0 1px 0;
  }

  &:last-child {
    hr {
      display: none;
    }

    .taskList__row {
      margin: 0;
    }
  }
}

.taskList__taskTitle {
  width: 100%;
  color: $primary-black;
  font-family: PT Sans Caption;
  font-size: 16px;
  line-height: 24px;
}

.taskList__taskStatus {
  display: flex;
  min-width: 60px;
  padding: 5px 16px;
  justify-content: center;
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

.taskList__deleteButton {
  &:hover {
    cursor: pointer;
  }
}

.taskList__moreTransition {
  display: inline-flex;
  padding: 12px 32px;
  margin-top: 40px;

  border-radius: 50px;
  border: 2px solid $primary-orange;
  background: $primary-white;

  &:hover {
    cursor: pointer;
  }
}

.taskList__moreWrapper {
  display: flex;
  flex-direction: row;
  gap: 8px;
}

.taskList__moreText {
  color: $primary-orange;
  text-align: center;
  font-family: PT Sans Caption;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;

  &_active {
    display: none;
  }
}

.taskList__moreSvgTransform {
  transform: rotate(180deg);
}

@media (max-width: $laptop) {
  .currentTasks__status {
    padding: 12px;
  }

  .addTask__inputSvg {
    opacity: 1;
  }
}

@media (max-width: $tablet) {
  .taskBar__wrapper {
    flex-direction: column;
    gap: 0;
    margin: 0;
  }

  .todolist__title {
    margin-bottom: 40px;
    font-size: 24px;
    line-height: 32px;
  }

  .taskBar__title {
    font-size: 18px;
    line-height: 26px;
  }

  .taskBar__upperCard {
    width: auto;
    margin-bottom: 60px;

    border-radius: 32px;
  }

  .currentTasks__status {
    padding: 12px 32px;
  }

  .taskList__moreTransition {
    margin-top: 32px;
  }
}

@media (max-width: $phone) {
  .todolist__title {
    margin-bottom: 32px;
    font-size: 20px;
    line-height: 28px;
  }

  .currentTasks__statusesWrapper {
    justify-content: unset;
    flex-direction: column;
    gap: 16px;
  }

  .taskBar__upperCard {
    padding: 24px;
  }

  .taskList__moreTransition {
    margin-top: 24px;
    display: flex;
    justify-content: center;
  }

  .addTask__inputWrapper {
    margin-bottom: 24px;
  }

  .addTask__inputSvg {
    padding: 14px 0;
  }

  .addTask__addButtonSvg {
    display: none;
  }

  .addTask__addWrapper {
    flex-direction: column-reverse;
  }

  .taskList {
    border-radius: 0;
    background: unset;
  }

  .taskList__title {
    margin-bottom: 32px;
    &:last-child {
      display: none;
    }
  }

  .taskList__wrapper {
    padding: 0;
  }

  .taskList__task {
    margin-bottom: 24px;
    border-radius: 32px;
    background: $primary-white;

    hr {
      display: none;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .taskList__taskTitle {
    font-weight: 700;
  }

  .taskList__row {
    margin: 0;
    padding: 24px;
    gap: 20px;

    align-items: center;
    flex-direction: column;
  }

  .taskList__secondColumn {
    width: 100%;
    display: block;
  }

  .taskList__taskStatus {
    background: unset;
    padding: 12px 0;
    border-radius: 50px;
    border: 2px solid $primary-orange;

    color: $primary-orange;
    font-size: 14px;
    font-weight: 700;
    line-height: 24px;
  }

  .taskList__deleteButton {
    display: none;
  }
}
</style>