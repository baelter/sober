import { EventEmitter } from 'events'

class StateAtom extends EventEmitter {
  constructor (initialState) {
    super()
    this.state = initialState
  }

  save (namespace, data) {
    this.state[namespace] = data
    this.emit('change::' + namespace)
  }

  get (namespace) {
    return JSON.parse(JSON.stringify(this.state[namespace]))
  }
}

export default StateAtom
