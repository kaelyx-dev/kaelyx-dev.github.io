import getSprite from '#icons-sprite'

// prepended to <body> as plain HTML, so Vue never hydrates it and it stays out of the JS payload
export default defineNitroPlugin((nitroApp) => {
    nitroApp.hooks.hook('render:html', async (html) => {
        const sprite = await getSprite()
        if (sprite) html.bodyPrepend.unshift(sprite)
    })
})
