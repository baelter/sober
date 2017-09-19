import { Component, router } from '../../src'
import template from './navbar.handlebars'

class Navbar extends Component {
  constructor ({selector}) {
    super({
      selector,
      template
    })
  }

  context () {
    let page = window.location.pathname.substr(1)
    return { navItems: [
      { title: 'Sober', href: '/', classes: /^\/?$/.test(page) ? 'active' : '' },
      { title: 'About', href: 'about', classes: /^\/?about$/.test(page) ? 'active' : '' }
    ] }
  }

  attached () {
    router.on('change', params => {
      this.render()
    })
    router.updatePageLinks()
  }
}

export default Navbar
