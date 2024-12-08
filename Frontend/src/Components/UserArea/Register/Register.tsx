import { useForm } from "react-hook-form";
import "./Register.css";
import { UserModel } from "../../../Models/UserModel";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../Utils/Notify";
import { userService } from "../../../Services/UserService";
import { Role } from "../../../Models/Enums";

export function Register(): JSX.Element {
    const { register, handleSubmit } = useForm<UserModel>();
    const navigate = useNavigate();

    const send = async (user: UserModel) => {
        try {
            user.role = Role.User; // Default role
            await userService.register(user);

            notify.success(`Welcome ${user.firstName}!`);
            navigate("/vacations");
        } catch (err: any) {
            if (err.response?.data === "Email is already taken.") {
                notify.error("The email address is already taken. Please use a different email.");
            } else {
                notify.error("Something went wrong. Check your inputs or try again later.");
            }
        }
    };

    return (
        <div className="Register">
            <div className="register-container">
                <h1 className="register-title">Join Traveloo</h1>
                <form onSubmit={handleSubmit(send)}>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            className="form-input"
                            {...register("firstName")}
                            minLength={2}
                            maxLength={50}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            className="form-input"
                            {...register("lastName")}
                            minLength={2}
                            maxLength={50}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-input"
                            {...register("email")}
                            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                            minLength={2}
                            maxLength={50}
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
                    <button type="submit" className="primary-btn">Register</button>
                    <button
                        type="button"
                        className="primary-btn"
                        onClick={() => navigate("/login")}
                    >
                        Already a member? Log in
                    </button>
                </form>
            </div>
        </div>
    );
}
