function s(query) {
    return document.querySelector(query);
}

export default {
    canvas: s("#canvas"),
    fps_counter: s("#fps_counter"),
    start_dialog: s("#start_dialog"),
    start_menu: s("#start_menu"),
    username_input: s("#username_input"),
    start_button: s("#start_button"),
    invalid_username_message: s(".invalid"),
    connecting_screen: s("#connecting_screen"),

    alert: {
        popup: s("#alert_popup"),
        dialog: s("#alert_dialog"),
        title: s("#alert_title"),
        content: s("#alert_content"),
        button: s("#alert_button"),
    },
}