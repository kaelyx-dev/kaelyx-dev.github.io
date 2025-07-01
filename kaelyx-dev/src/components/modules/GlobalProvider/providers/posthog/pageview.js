export default (posthog, path, title) => {
    posthog.capture('$pageview', {
        $current_url: window.location.host + "/#" + path,
        $host       : window.location.host,
        $pathname   : path  || "Unknown", 
        $title      : title || "Unknown"
    })
}