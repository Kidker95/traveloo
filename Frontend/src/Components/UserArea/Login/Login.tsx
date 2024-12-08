import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CredentialsModel } from "../../../Models/CredentialsModel";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";
import "./Login.css";
import { useTitle } from "../../../Utils/UseTitle";

export function Login(): JSX.Element {
    useTitle("Login | Traveloo");
    const { register, handleSubmit } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    const send = async (credentials: CredentialsModel) => {
        try {
            await userService.login(credentials);
            notify.success("Welcome Back!");
            navigate("/vacations");
        } catch (err: any) {
            notify.error(err);
        }
    };

    return (
        <div className="Login">
            <div className="login-container">
                <h1 className="login-title">Welcome Back!</h1>
                <form onSubmit={handleSubmit(send)}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Please enter a valid email address",
                                },
                            })}
                            minLength={6}
                            maxLength={100}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            className="form-input"
                            {...register("password")}
                            minLength={7}
                            maxLength={200}
                            required
                        />
                    </div>
                    <button type="submit" className="primary-btn">
                        Login
                    </button>
                    <button
                        type="button"
                        className="primary-btn"
                        onClick={() => navigate("/register")}
                    >
                        Not a member yet? Register
                    </button>
                </form>
            </div>
        </div>
    );
}
