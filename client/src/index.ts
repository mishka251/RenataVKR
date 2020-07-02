import Main from './Main/Main.vue';
import About from "./About/About.vue";
import Calculations from "./Calculations/Calculations.vue";
import Classification from "./Classification/Classification.vue";

require('bootstrap');

console.log("Hello world");
document.addEventListener('DOMContentLoaded', function () {
    const rootSelector = '#vue-root';
    if (window.location.pathname === '/') {
        new About({
            el: rootSelector,
        });
    } else if (window.location.pathname === '/calc/') {
        new Calculations({
            el: rootSelector,
        });
    } else if (window.location.pathname === '/classes/') {
        new Classification({
            el: rootSelector,
        });
    } else {
        new Main({
            el: rootSelector
        });
    }

});