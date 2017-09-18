let currentLayout = null

export default function (BaseComponent, components, selector) {
  if (currentLayout instanceof BaseComponent) {
    currentLayout.setComponents(components)
  } else {
    currentLayout = new BaseComponent({selector, components})
    currentLayout._attach()
  }
}
