import { Component } from '../../src'
import template from './main.handlebars'

class Main extends Component {
  constructor ({selector}) {
    super({selector, template})
  }

  context () {
    return {
      title: 'Sober',
      text: 'This is an example page'
    }
  }
}

export default Main
