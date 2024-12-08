import "./Page404.css";
import image404 from "../../../Assets/Images/404.jpeg";
import { useNavigate } from "react-router-dom";
import { useTitle } from "../../../Utils/UseTitle";

export function Page404(): JSX.Element {
    useTitle("404 | traveloo");
    const navigate = useNavigate();

    return (
        <div className="Page404">
            <h1 className="title">Oops! Page Not Found</h1>
            <p className="subtitle">The page you are looking for doesn’t exist or has been moved.</p>
            <div className="image-container">
                <img src={image404} alt="404 Not Found" className="image" />
            </div>
            <button className="home-button" onClick={() => navigate("/home")}>
                Back to Home
            </button>
        </div>
    );
}
