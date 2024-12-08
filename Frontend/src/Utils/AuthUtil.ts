import { jwtDecode } from "jwt-decode";
import { Role } from "../Models/Enums";

class AuthUtil {
    checkLoggedIn(): boolean {
        const token = sessionStorage.getItem("token");
        return !!token;
    }

    checkIsAdmin(role: Role | undefined): boolean {
        return role === Role.Admin;
    }

    getUserRole(): Role | null {
        const token = sessionStorage.getItem("token");
        if (!token) return null;
        try {
            const decodedToken: { role: Role } = jwtDecode(token);
            return decodedToken.role;
        } catch (err) {
            return null;
        }
    }
}

export const authUtil = new AuthUtil();
