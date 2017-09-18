let currentLayout = null

export default function (BaseComponent, components, selector) {
  if (currentLayout instanceof BaseComponent) {
    currentLayout.setComponents(components)
  } else {
    if (currentLayout) {
      currentLayout.destroy()
    }
    currentLayout = new BaseComponent({selector, components})
    currentLayout._attach()
  }
}
