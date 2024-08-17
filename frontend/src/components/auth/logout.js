import {AuthUtils} from "../../utils/auth-utils";
import {AuthService} from "../../services/auth-service";

export class Logout {
    constructor() {
        sessionStorage.clear();
        this.init().then();
    }

    async init() {
        if (AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            await AuthService.logout();
        } else {
            document.location = '#/login'
        }
    }
}