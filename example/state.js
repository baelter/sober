import StateAtom from '../src/state'
const state = new StateAtom({
  todos: [{ what: 'Initial todo', done: false, id: 0 }]
})
export default state
