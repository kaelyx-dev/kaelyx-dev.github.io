import head from '#themes-head'

export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:html', (html) => {
        html.head.unshift(head)
    })
})
