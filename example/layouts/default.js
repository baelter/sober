import template from './default.handlebars'
import { Component } from '../../src'

class DefaultLayout extends Component {
  constructor ({selector, components}) {
    super({selector, template, components})
  }
}

export default DefaultLayout
