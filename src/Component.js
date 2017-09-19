import { EventEmitter } from 'events'

function attachEventListener (scope, eventName, handler, capture) {
  scope.addEventListener(eventName, handler, capture)
  return () => {
    scope.removeEventListener(eventName, handler, capture)
  }
}

let componentIndex = 0

class Component extends EventEmitter {
  constructor ({ selector, template, components, element, context }) {
    super()
    this._template = template
    this._selector = selector
    this._id = 'c' + componentIndex++
    this._components = {}
    this._detachers = []
    this._elementType = element || 'div'
    this._context = context
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
    if (typeof Component === 'function') {
      this._components[selector] = new Component({selector: this._componentSelector(selector)})
    } else if (typeof Component === 'object') {
      this._components[selector] = Component
    }
    return this._components[selector]
  }

  _attach (domScope) {
    if (this._parentEl) {
      return
    }
    this.render(true, domScope)
    this.emit('attached')
    this.attached()
    Object.values(this._components).forEach(c => {
      c.emit('attached')
      c.attached()
    })
    return this
  }

  _componentSelector (selector) {
    return '#' + this._id + ' ' + selector
  }

  render (cascade, scope) {
    const html = this._template(this.context())
    const el = document.createElement(this._elementType)
    el.innerHTML = html
    el.id = this._id
    const fragment = document.createDocumentFragment()
    fragment.appendChild(el)
    if (cascade !== false) {
      Object.values(this._components).forEach(c => {
        c.render(true, fragment)
      })
    }
    if (this._parentEl && this._el) {
      this._parentEl.replaceChild(fragment, this._el)
    } else {
      this._parentEl = scope.querySelector(this._selector)
      this._parentEl.appendChild(fragment)
    }
    this._el = el
    return this
  }

  attached () {
    // noop
  }

  context () {
    return this._context || {}
  }

  addComponent (selector, Component) {
    const component = this._createComponent(selector, Component)
    if (component) {
      component.on('destroyed', () => {
        delete this._components[selector]
      })
      component._attach(document)
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
          this.removeComponent(selector)
          this.addComponent(selector, component)
        }
      } else if (typeof component === 'object') {
        // Always replace if an instance is passed
        this.removeComponent(selector)
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
    const detacher = attachEventListener(this._parentEl, eventName, (event) => {
      const possibleTargets = this._parentEl.querySelectorAll(this._componentSelector(selector))
      const target = event.target
      for (let i = 0, l = possibleTargets.length; i < l; i++) {
        let el = target
        const p = possibleTargets[i]
        while (el && el !== this._parentEl) {
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
    if (this._parentEl && this._el) {
      this._parentEl.removeChild(this._el)
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
    this._el = null
    this._parentEl = null
    this.emit('destroyed')
    this.removeAllListeners()
    return this
  }
}

export default Component
