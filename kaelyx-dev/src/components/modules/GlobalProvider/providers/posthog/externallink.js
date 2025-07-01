export default (posthog, link) => {
    posthog.capture('external_link_clicked', {
        link,
        $current_url: link,
    })
}