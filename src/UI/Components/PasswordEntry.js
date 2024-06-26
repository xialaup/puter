import { Component, defineComponent } from "../../util/Component.js";

export default class PasswordEntry extends Component {
    static PROPERTIES = {
        spec: {},
        value: {},
        error: {},
        on_submit: {},
        show_password: {},
    }

    static CSS = /*css*/`
        fieldset {
            display: flex;
            flex-direction: column;
        }
        input {
            flex-grow: 1;
        }

        /* TODO: I'd rather not duplicate this */
        .error {
            display: none;
            color: red;
            border: 1px solid red;
            border-radius: 4px;
            padding: 9px;
            margin-bottom: 15px;
            text-align: center;
            font-size: 13px;
        }
        .error-message {
            display: none;
            color: rgb(215 2 2);
            font-size: 14px;
            margin-top: 10px;
            margin-bottom: 10px;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid rgb(215 2 2);
            text-align: center;
        }
        .password-and-toggle {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .password-and-toggle input {
            flex-grow: 1;
        }


        /* TODO: DRY: This is from style.css */
        input[type=text], input[type=password], input[type=email], select {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
            outline: none;
            -webkit-font-smoothing: antialiased;
            color: #393f46;
            font-size: 14px;
        }

        /* to prevent auto-zoom on input focus in mobile */
        .device-phone input[type=text], .device-phone input[type=password], .device-phone input[type=email], .device-phone select {
            font-size: 17px;
        }

        input[type=text]:focus, input[type=password]:focus, input[type=email]:focus, select:focus {
            border: 2px solid #01a0fd;
            padding: 7px;
        }
    `;

    create_template ({ template }) {
        $(template).html(/*html*/`
            <form>
                <div class="error"></div>
                <div class="password-and-toggle">
                    <input type="password" class="value-input" id="password" placeholder="${i18n('password')}" required>
                    <img
                        id="toggle-show-password"
                        src="${this.get('show_password')
                            ? window.icons["eye-closed.svg"]
                            : window.icons["eye-open.svg"]}"
                        width="20"
                        height="20">
                </div>
            </form>
        `);
    }

    on_focus () {
        $(this.dom_).find('input').focus();
    }

    on_ready ({ listen }) {
        listen('error', (error) => {
            if ( ! error ) return $(this.dom_).find('.error').hide();
            $(this.dom_).find('.error').text(error).show();
        });

        listen('value', (value) => {
            // clear input
            if ( value === undefined ) {
                $(this.dom_).find('input').val('');
            }
        });

        const input = $(this.dom_).find('input');
        input.on('input', () => {
            this.set('value', input.val());
        });

        const on_submit = this.get('on_submit');
        if ( on_submit ) {
            $(this.dom_).find('input').on('keyup', (e) => {
                if ( e.key === 'Enter' ) {
                    on_submit();
                }
            });
        }
        
        $(this.dom_).find("#toggle-show-password").on("click", () => {
            this.set('show_password', !this.get('show_password'));
            const show_password = this.get('show_password');
            // hide/show password and update icon
            $(this.dom_).find("input").attr("type", show_password ? "text" : "password");
            $(this.dom_).find("#toggle-show-password").attr("src", show_password ? window.icons["eye-closed.svg"] : window.icons["eye-open.svg"])
        });
    }
}

defineComponent('c-password-entry', PasswordEntry);
