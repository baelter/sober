import { router, layout } from '../src'
import Navbar from './components/navbar'
import Main from './components/main'
import About from './components/about'
import Footer from './components/footer'
import DefaultLayout from './layouts/default'

router
  .map('/', () => {
    layout(DefaultLayout, { 'main': Main, 'header': Navbar, 'footer': Footer }, '#app')
  })
  .map('/about', () => {
    layout(DefaultLayout, { 'main': About, 'header': Navbar, 'footer': Footer }, '#app')
  })

export default router
