import { defineStore } from 'pinia'

export const useTaskStore = defineStore({
  id: 'taskStore',

  state: () => ({
    tasks: [],
    statuses: ['Открыт', 'В работе', 'Закрыт'],
    currentId: 0,
    selectedTaskId: null 
  }),

  getters: {
    taskCount: (state) => state.tasks.length,
    taskOpennedCount: (state) => state.tasks.filter((task) => task.status === 'Открыт').length,
    taskWorksCount: (state) => state.tasks.filter((task) => task.status === 'В работе').length,
    taskClosedCount: (state) => state.tasks.filter((task) => task.status === 'Закрыт').length,

    sortedTasks: (state) => {
      return state.tasks.slice().sort((a, b) => {
        const statusOrder = {
          Открыт: 1,
          'В работе': 2,
          Закрыт: 3
        }

        return statusOrder[a.status] - statusOrder[b.status]
      })
    },

    getStatusById: (state) => (taskId) => {
      const task = state.tasks.find((task) => task.id === taskId)
      return task ? task.status : null
    },

    getTitleById: (state) => (taskId) => {
        const task = state.tasks.find((task) => task.id === taskId)
        return task ? task.title : null
      }
  },

  actions: {
    addTask(value) {
      this.currentId++
      this.tasks.push({ ...value, id: this.currentId })
      this.saveToLocalStorage()
    },

    deleteTask(taskId) {
      this.tasks = this.tasks.filter((task) => task.id !== taskId)
      this.saveToLocalStorage()
    },

    saveToLocalStorage() {
      localStorage.setItem('myTasksData', JSON.stringify(this.tasks))
      localStorage.setItem('myTasksCurrentId', JSON.stringify(this.currentId))
    },

    initializeFromLocalStorage() {
      const storedData = localStorage.getItem('myTasksData')
      const storedCurrentId = localStorage.getItem('myTasksCurrentId')
      if (storedData && storedCurrentId) {
        this.tasks = JSON.parse(storedData)
        this.currentId = JSON.parse(storedCurrentId)
      }
    },

    updateTask(taskId, newStatus, newTitle) {
      const taskIndex = this.tasks.findIndex((task) => task.id === taskId)
      if (taskIndex !== -1) {
        if (newStatus){
            this.tasks[taskIndex].status = newStatus
        }
        if (newTitle){
            this.tasks[taskIndex].title = newTitle
        }
        this.saveToLocalStorage()
      }
    }
  }
})
