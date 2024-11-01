import selector from "./selector.js";

//ran on page load
export default function init() {
    function resize_canvas() {
        selector.canvas.width = window.innerWidth;
        selector.canvas.height = window.innerHeight;
    }

    resize_canvas();
    window.onresize = function () {
        resize_canvas();
    }


}