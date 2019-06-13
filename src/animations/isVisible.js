export default function isVisible(element) {
    const innerHeight = window.innerHeight;

    const elStartY = element.getBoundingClientRect().top;
    const elEndY = element.getBoundingClientRect().top + element.getBoundingClientRect().height;

    const elIsBeforeViewport= elEndY < 0;
    const elIsAfterViewport= elStartY > innerHeight;

    return !elIsBeforeViewport && !elIsAfterViewport;
}