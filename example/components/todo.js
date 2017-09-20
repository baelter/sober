import { Component } from '../../src'
import template from './todo.handlebars'
import state from '../state'

class TODO extends Component {
  constructor ({selector}) {
    super({selector, template})
  }

  context () {
    return {
      todos: state.get('todos')
    }
  }

  attached () {
    let i = 1

    this.delegate('submit', '.todo', event => {
      event.preventDefault()
      const data = new FormData(event.target)
      const todos = this.context().todos
        .concat({ what: data.get('what'), done: false, id: i++, classes: '' })
      state.save('todos', todos)
    })

    this.delegate('click', '[name="done"]', event => {
      const checked = event.target.checked
      const id = parseInt(event.target.dataset.id)
      const todos = this.context().todos.map(todo => {
        if (todo.id === id) {
          todo.done = checked
        }
        return todo
      })
      state.save('todos', todos)
    })

    this.listen('change::todos', state, () => {
      this.render()
    })
  }
}

export default TODO
