<template lang='pug'>
  v-container#app(style="max-width: 1200px")
    v-row.mt-2
      div.text-h5(v-text="'My List'")
      v-btn.ml-3.text-caption(
        text color="primary"
        style="text-transform: none"
        v-text="'Add New Task!'"
        @click="openDialog")
    v-row
      //- todo list
      v-col
        v-card.pa-4
          v-card-title(v-text="'To do'")
          v-divider
          v-card.mt-3(v-for="task in tasks" v-if="task.status === 'todo'")
            v-card-text(v-text="task.description")
            v-card-actions
              v-btn.text-caption(text color="primary" v-text="'Done'" @click="setStatus(task.id, 'done')")
              v-spacer
              v-btn.text-caption(icon color="grey" @click="openConfirmDialog(()=>deleteTask(task.id))")
                v-icon mdi-delete

      //- done list
      v-col
        v-card.pa-4
          v-card-title(v-text="'Done'")
          v-divider
          v-card.mt-3(v-for="task in tasks" v-if="task.status === 'done'" elevation="0")
            v-row
              v-col(cols='8')
                v-card-text.grey--text.lighten-5(v-text="task.description")
              v-col(cols='2')
                v-btn.ma-4.grey--text.lighten-5.text-caption(text v-text="'Todo'" height="20px" @click="setStatus(task.id, 'todo')")
              v-col(cols='1')
                v-btn.ma-2.text-caption(icon color="grey" @click="openConfirmDialog(deleteTask(task.id))")
                  v-icon mdi-delete

    //- create new task dialog
    v-dialog(v-model="isOpend" width="400")
      v-card.pa-4
        div(v-text="'Add New Task'")
        v-form
          v-text-field(v-model="formInput.description" label='Description')
          v-select(v-model="formInput.status" :items="['todo', 'done']")
          v-btn(@click="addTask" text v-text="'add'" color="primary")
          v-btn(@click="closeDialog" text  v-text="'cancel'" color="red")
    //- delete confirm
    ComfirmDialog(v-model="confirmDialog.isOpened" @ok="confirmDialog.onOk" @cancel="confirmDialog.onCancel")

</template>

<script lang='ts'>
import { defineComponent, ref, reactive, useFetch } from '@nuxtjs/composition-api'
import { use as useComfirm} from '../util/confirmDialog'
import axios from 'axios'

declare type Status = 'todo' | 'done'
declare interface Task {
  id: any,
  description: string,
  status: Status
}
declare type Tasks = Task[]

export default defineComponent({
  name: 'PagesTodoApp',

  setup() {
    /** control dialogs */
    const isOpend = ref(false)
    const openDialog  = () => {
      isOpend.value = true
    }
    const closeDialog = () => {
      isOpend.value = false
    }
    const { confirmDialog, openConfirmDialog, closeConfirmDialog } = useComfirm()

    /** Input from users */
    const formInput = reactive({
      description: '',
      status: 'todo',
    })

    let tasks = ref<Tasks>([])

    /** get tasks from django rest api */
    const getTasks = () => {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8000/tasks/',
        auth: {
          username: 'admin',
          password: 'admin'
        },
      }).then(response => tasks.value = response.data)
    }

    /** create tasks to django rest api */
    const addTask = () => {
      if(formInput.description) {
        axios({
          method: 'post',
          url: 'http://127.0.0.1:8000/tasks/',
          auth: {
            username: 'admin',
            password: 'admin'
          },
          data: {
            description: formInput.description,
            status: formInput.status
          },
        }).then(response => {
          let newTask: Task = {
            'id': response.data.id,
            'description': formInput.description,
            'status': formInput.status as Status
          }
          tasks.value.push(newTask)
          // form init
          formInput.description = ''
          formInput.status = 'todo'
          closeDialog()
        }).catch(e => {
          console.error(e)
          closeDialog()
        })
      }
    }

    /** change task status  */
    const setStatus = (task_id: string, status: Status) => {
      const task = tasks.value.filter(task => task.id === task_id)[0]
      const description = task.description
      axios({
        method: 'put',
        url: 'http://127.0.0.1:8000/tasks/' + task_id + '/',
        auth: {
          username: 'admin',
          password: 'admin'
        },
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          status: status,
          description: description
        }
      }).then(() => {
        task.status = status
      })
    }

    /** delete task */
    const deleteTask = (task_id: string) => {
      const task = tasks.value.filter(task => task.id === task_id)[0]
      axios({
        method: 'delete',
        url: 'http://127.0.0.1:8000/tasks/' + task_id + '/',
        auth: {
          username: 'admin',
          password: 'admin'
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(() => {
        const index = tasks.value.indexOf(task)
        tasks.value.splice(index, 1)
        closeConfirmDialog()
      })
    }

    /** init */
    useFetch(() => {
      try{
        getTasks()
      } catch(e){
        console.log(e)
      }
    })

    return {
      isOpend,
      openDialog,
      closeDialog,
      confirmDialog,
      openConfirmDialog,
      closeConfirmDialog,
      formInput,
      addTask,
      deleteTask,
      setStatus,
      tasks
    }
  }
})
</script>

<style scoped>
.v-dialog {
  opacity: 1 !important;
  background: #fff;
}
</style>
