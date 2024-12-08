import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../../Models/UserModel";
import { AppState } from "../../../Redux/Store";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";
import "./Header.css";
import planeGif from "../../../Assets/Images/plane.webp"

export function Header(): JSX.Element {
    const user = useSelector<AppState, UserModel | null>((state) => state.user);
    const navigate = useNavigate();

    const logout = () => {
        userService.logout();
        notify.success("Goodbye!");
        navigate("/home");
    };

    return (
        <header className="Header">
            {/* Logo */}
            <div className="logo">
                <h1 onClick={() => navigate("/home")}>Traveloo</h1>
                <span className="logo-icon"><img src={planeGif}/></span>
            </div>

            {/* Menu */}
            <nav className="navigation">
                <Button onClick={() => navigate("/home")}>Home</Button>
                {user && <Button onClick={() => navigate("/vacations")}>Vacations</Button>}
                {user?.role === "Admin" && (
                    <Button onClick={() => navigate("/manager")}>Manager Page</Button>
                )}
                {user ? (
                    <>
                        <span className="greeting">Hello, {user.firstName}!</span>
                        <Button onClick={logout}>Log Out</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => navigate("/login")}>Login</Button>
                        <Button onClick={() => navigate("/register")}>Register</Button>
                    </>
                )}
            </nav>
        </header>
    );
}
