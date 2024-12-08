import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import bali from "../../../Assets/Images/bali.jpg";
import nyc from "../../../Assets/Images/nyc.jpeg";
import swiss from "../../../Assets/Images/swiss.jpeg";
import { AppState } from "../../../Redux/Store";
import { useTitle } from "../../../Utils/UseTitle";
import "./Home.css";

export function Home(): JSX.Element {
    useTitle("Home | Traveloo");
    const user = useSelector((state: AppState) => state.user);
    const navigate = useNavigate();

    return (
        <div className="Home">
            {/* Hero Section */}
            <section className="hero">
                <h1>
                    Welcome to <span className="highlight">Traveloo</span>
                </h1>
                <p>Your gateway to unforgettable vacations.</p>
            </section>

            {/* Featured Vacations */}
            <section className="featured-vacations">
                <h2>Featured Vacations</h2>
                <div className="vacations-grid">
                    {/* Bali Card */}
                    <div className="vacation-card">
                        <img src={bali} alt="Bali" />
                        <div className="vacation-card-content">
                            <h3>Bali Getaway</h3>
                            <p>🌴 Relax in paradise.</p>
                        </div>
                    </div>

                    {/* NYC Card */}
                    <div className="vacation-card">
                        <img src={nyc} alt="New York City" />
                        <div className="vacation-card-content">
                            <h3>New York City Lights</h3>
                            <p>🗽 Experience the big city.</p>
                        </div>
                    </div>

                    {/* Swiss Alps Card */}
                    <div className="vacation-card">
                        <img src={swiss} alt="Swiss Alps" />
                        <div className="vacation-card-content">
                            <h3>Swiss Alps Adventure</h3>
                            <p>⛰️ Adventure awaits.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="why-choose-us">
                <h2>Why Choose Traveloo?</h2>
                <div className="features-grid">
                    <div className="feature">
                        <h3>🌍 Diverse Destinations</h3>
                        <p>Explore vacations around the globe, from beaches to mountains.</p>
                    </div>
                    <div className="feature">
                        <h3>⚡ Real-Time Updates</h3>
                        <p>Stay updated with live changes to your favorite vacations.</p>
                    </div>
                    <div className="feature">
                        <h3>✔️ Easy Booking</h3>
                        <p>Reserve your dream vacation in just a few clicks.</p>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="cta">
                <h2>Start Your Journey Now</h2>
                <div className="cta-buttons">
                    {user ? (
                        <button
                            className="primary-btn"
                            onClick={() => navigate("/vacations")}
                        >
                            Go to All Vacations
                        </button>
                    ) : (
                        <>
                            <button
                                className="primary-btn"
                                onClick={() => navigate("/signup")}
                            >
                                Sign Up
                            </button>
                            <button
                                className="primary-btn"
                                onClick={() => navigate("/login")}
                            >
                                Log In
                            </button>
                        </>
                    )}
                </div>
            </section>

        </div>
    );
}
