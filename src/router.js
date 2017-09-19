import Navigo from 'navigo'
import EventEmitter from 'events'

const router = new Navigo(null, false)
const events = new EventEmitter()
router.hooks({
  after (params) {
    events.emit('change', params)
    router.updatePageLinks()
  }
})

export default {
  map (...args) {
    router.on(...args)
    return this
  },
  on (...args) {
    events.on(...args)
    return this
  },
  navigate (...args) {
    router.navigate(...args)
    return this
  },
  resolve (...args) {
    router.resolve(...args)
    return this
  },
  updatePageLinks (...args) {
    router.updatePageLinks(...args)
    return this
  }
}
