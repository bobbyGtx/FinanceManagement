import {ValidateUtils} from "../../utils/validate-utils";
import {AuthService} from "../../services/auth-service";
import {AuthUtils} from "../../utils/auth-utils";


export class Login {
    constructor() {
        this.fields = [
            {
                name: 'email', //используем для передачи формы
                id: 'email',//id элемента формы
                element: null,
                validation: {regex: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu},
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                validation: {regex: /.{8,}/},
                valid: false,
            },
            {
                name: 'rememberMe',
                id: 'remember-me',
                element: null,
                valid: true,
            }
        ];
        this.findElements();
        this.btnLoginElement.addEventListener("click", this.loginAction.bind(this));
    }

    findElements() {
        this.fields = ValidateUtils.findElements(this.fields);
        this.loginErrorMsgElement = document.getElementById("login-error-msg");
        this.btnLoginElement = document.getElementById("btn-login");
    }

    async loginAction() {
        this.loginErrorMsgElement.classList.add("d-none");

        if (!ValidateUtils.validateForm(this.fields)) {
            return
        }
        const requestData = {}
        this.fields.forEach(field => {
            if(field.element.type === 'checkbox'){
                requestData[field.name]=field.element.checked;
                this.rememberMe=field.element.checked;
            }else{
                requestData[field.name] = field.element.value;
            }
        });

        const result = await AuthService.login(requestData);
        if (result.error) {
            this.loginErrorMsgElement.innerText = result.errorMessage;
            this.loginErrorMsgElement.classList.remove("d-none");
            return
        }
        AuthUtils.setAuthInfoLogin(result.response.tokens.accessToken, result.response.tokens.refreshToken, result.response.user,this.rememberMe);

        return document.location='#/';
    }
}