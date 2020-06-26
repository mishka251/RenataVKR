import Main from './Main/Main.vue';
import About from "./About/About.vue";

console.log("Hello world");
document.addEventListener('DOMContentLoaded', function () {
    const rootSelector = '#vue-root';
    if (window.location.pathname === '/') {
        new About({
            el: rootSelector,
        });
    } else {
        new Main({
            el: rootSelector
        });
    }

});