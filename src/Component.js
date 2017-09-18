import { EventEmitter } from 'events'

function attachEventListener (scope, eventName, handler, capture) {
  scope.addEventListener(eventName, handler, capture)
  return () => {
    scope.removeEventListener(eventName, handler, capture)
  }
}

let componentIndex = 0

class Component extends EventEmitter {
  constructor ({ selector, template, components, element }) {
    super()
    this._template = template
    this._selector = selector
    this._id = 'c' + componentIndex++
    this._components = {}
    this._detachers = []
    this._elementType = element || 'div'
    if (components) {
      Object.keys(components).forEach((cSelector) => {
        this._createComponent(cSelector, components[cSelector])
      })
    }
  }

  _createComponent (selector, Component) {
    if (Component === null) {
      return
    }
    const scopedSelector = '#' + this._id + ' ' + selector
    if (typeof Component === 'function') {
      this._components[selector] = new Component(scopedSelector)
    } else if (typeof Component === 'object') {
      this._components[selector] = Component
    }
    return this._components[selector]
  }

  _attach () {
    this.render()
    Object.values(this._components).forEach(c => {
      c._attach()
    })
    this.attached()
    this.emit('attached')
    return this
  }

  render () {
    const html = this._template(this.context())
    this.parentEl = this.parentEl || document.querySelector(this._selector)
    if (this.el) {
      this.el.innerHTML = html
    } else {
      this.el = document.createElement(this._elementType)
      this.el.id = this._id
      this.el.innerHTML = html
      this.parentEl.appendChild(this.el)
    }
    this.emit('rendered')
    return this
  }

  attached () {
    // noop
  }

  context () {
    return {}
  }

  addComponent (selector, Component) {
    this.removeComponent(selector)
    const component = this._createComponent(selector, Component)
    if (component) {
      component.on('destroyed', () => {
        delete this._components[selector]
      })
      component._attach()
    }
    return component
  }

  removeComponent (selector) {
    const component = this._components[selector]
    if (component) {
      component.destroy()
    }
    delete this._components[selector]
    return component
  }

  setComponents (components) {
    Object.keys(components).forEach((selector) => {
      const currentComponent = this._components[selector]
      const component = components[selector]
      if (typeof component === 'function') {
        // Do not replace if the same class is passed
        if (!(currentComponent instanceof component)) {
          this.addComponent(selector, component)
        }
      } else if (typeof component === 'object') {
        // Always replace if an instance is passed
        this.addComponent(selector, component)
      }
    })
  }

  /**
   * Add event delegation
   * Returns detach function
   * @param {*} eventName
   * @param {*} selector
   * @param {*} fn
   */
  delegate (eventName, selector, fn) {
    const detacher = attachEventListener(this.el, eventName, (event) => {
      const possibleTargets = this.el.querySelectorAll(selector)
      const target = event.target
      for (let i = 0, l = possibleTargets.length; i < l; i++) {
        let el = target
        const p = possibleTargets[i]
        while (el && el !== this.el) {
          if (el === p) {
            return fn.call(self, event)
          }
          el = el.parentNode
        }
      }
    }, false)
    this._detachers.push(detacher)
    return detacher
  }

  destroy () {
    if (this.parentEl && this.el) {
      this.parentEl.removeChild(this.el)
    }
    this._template = null
    this._context = null
    while (this._detachers.length) {
      this._detachers.pop()()
    }
    Object.keys(this._components).forEach(cSelector => {
      const component = this._components[cSelector]
      delete this._components[cSelector]
      component.destroy()
    })
    this.el = null
    this.parentEl = null
    this.emit('destroyed')
    this.removeAllListeners()
    return this
  }
}

export default Component
