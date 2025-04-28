import HelloWorld from "./helloWorld.vue"
import Icon from "./icon.vue"

const shortCodes = {
    "HELLOWORLD": HelloWorld,
    "ICON": Icon
}

export const getComponent = componentName => {
    return shortCodes[Object.keys(shortCodes).filter(e => e.toUpperCase() == componentName.toUpperCase())[0]]
}