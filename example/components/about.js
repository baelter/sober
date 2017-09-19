import { Component } from '../../src'
import template from './main.handlebars'

class About extends Component {
  constructor ({selector}) {
    super({selector, template})
  }

  context () {
    return {
      title: 'About',
      text: 'This is another example page'
    }
  }
}

export default About
