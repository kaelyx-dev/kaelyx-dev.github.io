export default gtagID => {
    if (!gtagID) return
    if(window.gtag) return
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + gtagID;
    script.async = true;

    document.head.appendChild(script);

    script.onload = () => {
        window.dataLayer = window.dataLayer || [];

        function _gtag (){
            window.dataLayer.push(arguments);
        }
        window.gtag = _gtag;
        window.gtag('js', new Date());
        window.gtag('config', gtagID, {
            'anonymize_ip': true,
            'allow_google_signals': true,
            'allow_ad_personalization_signals': false
        });
    }
}