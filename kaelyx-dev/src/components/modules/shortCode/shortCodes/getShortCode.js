import HelloWorld from "./helloWorld.vue"

const shortCodes = {
    "HELLOWORLD": HelloWorld
}

export const getComponent = componentName => {
    return shortCodes[Object.keys(shortCodes).filter(e => e.toUpperCase() == componentName.toUpperCase())[0]]
}