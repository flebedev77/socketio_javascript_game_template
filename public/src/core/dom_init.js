import selector from "../front_end/selector.js";
import reset from "../managers/reset_manager.js";
import globals from "./globals.js";

export default function dom_init() {
    selector.alert.dialog.style.display = "none";
    selector.alert.button.addEventListener("click", () => {
        selector.alert.popup.classList.add("shrinking");
        setTimeout(() => {
            selector.alert.dialog.style.display = "none";
            selector.alert.popup.classList.remove("shrinking");
        }, 500)
    })

    selector.start_button.addEventListener("click", () => {
        selector.start_menu.classList.add("shrinking");
        setTimeout(() => {
            selector.start_dialog.style.display = "none";
            selector.start_menu.classList.remove("shrinking");
            globals.start_callback();
        }, 500)
    })


    selector.invalid_username_message.style.display = "none";
    selector.connecting_screen.style.display = "none";
}