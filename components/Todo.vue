<template>
  <div class="container mt-5 container-table">
    <b-row class="mb-2">
      <b-col>
        <b-form-input
          id="filter-input"
          v-model="filter"
          type="search"
          placeholder="Search..."
        ></b-form-input>
      </b-col>
      <b-col
        ><div class="text-right">
          <b-button
            class="pt-1 pb-1"
            variant="outline-primary"
            @click=";(showAddAlert = false), $bvModal.show('bv-modal-example')"
            >Add Todo</b-button
          >
        </div>
      </b-col>
    </b-row>
    <b-table
      sticky-header
      bordered
      hover
      :busy="isBusy"
      :filter="filter"
      :items="todos"
      head-variant="dark"
      :fields="fields"
      show-empty
    >
      <template #cell(iscompleted)="row">
        <b-form-checkbox
          :id="'checkbox-' + row.index"
          :name="'name-' + row.index"
          v-model="row.item.iscompleted"
          :value="1"
          :unchecked-value="0"
          @change="complete(row.item)"
        >
        </b-form-checkbox>
      </template>
      <template #cell(name)="row">
        <span :class="[row.item.iscompleted ? 'complete' : '']">{{
          row.item.name
        }}</span>
      </template>
      <template #cell(description)="row">
        <span
          v-if="row.item.description && row.item.description.length > 68"
          :class="[row.item.iscompleted ? 'complete' : '']"
          >{{ row.item.description.substr(0, 70) + '...' }}</span
        >
        <span
          v-if="row.item.description && row.item.description.length < 68"
          :class="[row.item.iscompleted ? 'complete' : '']"
          >{{ row.item.description }}</span
        >
        <span v-if="!row.item.description">N/A</span>
      </template>
      <template #cell(tag)="row">
        <span>
          <b-badge
            pill
            variant="primary"
            :class="[
              'ml-1',
              'badge-size',
              row.item.iscompleted ? 'complete' : '',
            ]"
            v-for="(item, index) in row.item.tag"
            :key="index"
            >{{ item }}</b-badge
          ></span
        >
        <span v-if="!row.item.tag">N/A </span>
      </template>
      <template #cell(actions)="row">
        <b-button
          size="sm"
          variant="outline-success"
          @click="editTodo(row.item, $bvModal)"
          class="mr-1"
          :disabled="row.item.iscompleted ? true : false"
        >
          Edit
        </b-button>
        <b-button
          size="sm"
          variant="outline-danger"
          @click="deleteRecord(row.item)"
          :disabled="row.item.iscompleted ? true : false"
        >
          Delete
        </b-button>
      </template>
    </b-table>
    <div>
      <b-card class="card-box">
        <b-row>
          <b-col>
            <b-form-checkbox
              id="check-todo"
              name="checked-todo"
              v-model="check_all"
              @change="CompleteAll"
            >
              Check All
            </b-form-checkbox>
          </b-col>
          <b-col> Total Todos: {{ totalTodos }} </b-col>
          <b-col> Completed Todos: {{ checkedTodo }} </b-col>
        </b-row>
      </b-card>
    </div>
    <div>
      <b-modal id="bv-modal-example" hide-footer>
        <template #modal-title> Add Todo </template>
        <b-alert
          variant="danger"
          fade
          :show="showAddAlert"
          v-for="(msg, index) in validationMsg"
          :key="index"
        >
          {{ msg }}
        </b-alert>
        <b-form @submit.prevent="submit($bvModal)">
          <div class="d-block">
            <b-form-input
              placeholder="Enter name"
              v-model="name"
              required
            ></b-form-input>
          </div>
          <div class="d-block mt-3">
            <b-form-textarea
              id="textarea"
              v-model="description"
              required
              placeholder="Enter something..."
              rows="2"
            ></b-form-textarea>
          </div>
          <div class="d-block mt-3">
            <b-form-tags input-id="tags-basic" v-model="tag"></b-form-tags>
          </div>
          <b-button class="mt-3" type="submit">Add</b-button>
          <b-button class="mt-3" @click="$bvModal.hide('bv-modal-example')"
            >Close</b-button
          >
        </b-form>
      </b-modal>
    </div>
    <div>
      <b-modal id="bv-modal-edit" hide-footer>
        <template #modal-title> Edit Todo </template>
        <b-alert
          variant="danger"
          fade
          :show="showAlert"
          v-for="(msg, index) in validationError"
          :key="index"
        >
          {{ msg }}
        </b-alert>
        <b-form @submit.prevent="updateTodo($bvModal)">
          <div class="d-block">
            <b-form-input
              placeholder="Enter name"
              v-model="fetchTodo"
              required
            ></b-form-input>
            <div class="d-block mt-3">
              <b-form-textarea
                id="textarea"
                v-model="todo_description"
                required
                placeholder="Enter something..."
                rows="2"
              ></b-form-textarea>
            </div>
            <div class="d-block mt-3">
              <b-form-tags
                input-id="tags-basic"
                v-model="todo_tag"
              ></b-form-tags>
            </div>
          </div>
          <b-button class="mt-3" type="submit">Update</b-button>
          <b-button class="mt-3" @click="$bvModal.hide('bv-modal-edit')"
            >Close</b-button
          >
        </b-form>
      </b-modal>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import Cookies from 'js-cookie'
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      fields: [
        {
          key: 'iscompleted',
          label: '',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Todo',
          sortable: true,
        },
        {
          key: 'description',
          label: 'Description',
          sortable: true,
        },
        {
          key: 'tag',
          label: 'Tag',
          sortable: false,
        },
        {
          label: 'Action',
          key: 'actions',
        },
      ],
      name: '',
      description: '',
      fetchTodo: '',
      tag: [],
      todo_tag: [],
      todo_description: '',
      check_all: false,
      filter: null,
      showAlert: false,
      showAddAlert: false,
      validationMsg: [],
      isBusy: false,
      validationError: [],
    }
  },
  computed: {
    ...mapGetters({
      //  todos: 'todos/todos',
      token: 'auth/getToken',
    }),

    todos() {
      return [...this.$store.state.todos.todos]
    },
    totalTodos() {
      return this.todos.length
    },
    checkedTodo() {
      return this.todos.filter((opt) => {
        return opt.iscompleted == 1
      }).length
    },
  },
  methods: {
    CompleteAll() {
      axios
        .post(
          ' http://127.0.0.1:8000/api/check-all-todos',
          {
            isCheckedAll: this.check_all,
          },
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        )
        .then((resp) => {
          if (resp.data.success) {
            this.getTodos(this.token)
          }
        })
    },
    complete({ id, iscompleted }) {
      axios
        .post(
          ' http://127.0.0.1:8000/api/todo-status/' + id,
          {
            iscompleted: iscompleted,
          },
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        )
        .then((resp) => {
          this.getTodos(this.token)
        })
    },
    deleteRecord({ id }) {
      axios
        .post(
          ' http://127.0.0.1:8000/api/delete/todo',
          { id: id },
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        )
        .then((resp) => {
          if (resp.data.success) {
            this.getTodos(this.token)
          }
        })
    },
    getTodos(payload) {
      this.$store.dispatch('todos/Fetch_Todos', payload)
    },
    submit(modal) {
      this.showAddAlert = false
      this.validationMsg = []
      axios
        .post(
          ' http://127.0.0.1:8000/api/add/todo',
          {
            name: this.name,
            description: this.description,
            tag: this.tag,
          },
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        )
        .then((resp) => {
          this.name = ''
          modal.hide('bv-modal-example')
          this.getTodos(this.token)
        })
        .catch((error) => {
          if (error.response.status === 422) {
            let errors = Object.values(error.response.data.errors)
            errors = errors.flat()
            this.showAddAlert = true
            this.validationMsg = errors
          }
        })
    },
    editTodo({ id }, modal) {
      this.showAlert = false
      this.validationError = []
      if (process.client) {
        const token = Cookies.get('token')
        axios
          .get(' http://127.0.0.1:8000/api/get/todo/' + id, {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          })
          .then((resp) => {
            modal.show('bv-modal-edit')
            this.fetchTodo = resp.data.result.name
            this.todo_description = resp.data.result.description
            this.todo_tag = resp.data.result.tag
            this.todoId = resp.data.result.id
          })
      }
    },
    updateTodo(modal) {
      this.showAlert = false
      this.validationError = []
      if (process.client) {
        axios
          .post(
            ' http://127.0.0.1:8000/api/update/todo/' + this.todoId,
            {
              name: this.fetchTodo,
              description: this.todo_description,
              tag: this.todo_tag,
            },
            {
              headers: {
                Authorization: 'Bearer ' + this.token,
              },
            }
          )
          .then((resp) => {
            modal.hide('bv-modal-edit')
            this.getTodos(this.token)
          })
          .catch((error) => {
            if (error.response.status === 422) {
              let errors = Object.values(error.response.data.errors)
              errors = errors.flat()
              this.showAlert = true
              this.validationError = errors
            }
          })
      }
    },
  },
}
</script>
<style scoped>
@media screen and (min-width: 1260px) {
  .container-table {
    max-width: 90% !important;
  }
}
.complete {
  text-decoration: line-through;
}
.card-box {
  border-right: 0;
  border-left: 0;
}
.badge {
  line-height: 2;
}
.text-right button {
    background-color: #0a91b9;
    color: #fff;
    border-color: #0a91b9;
    -webkit-transition: all 1s ease;
    transition: all 1s ease;
}
.text-right button:hover {
    background-color: transparent;
    color: #0a91b9;
}
</style>
<style>
.modal-header {
    background-color: #0a91b9;
}
.modal-header h5 {
    color: #fff;
}
.modal-header button.close {
    color: #fff;
}
</style>
