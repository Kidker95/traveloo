import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AppState } from "../../../Redux/Store";
import { authUtil } from "../../../Utils/AuthUtil";
import { notify } from "../../../Utils/Notify";
import { Home } from "../../PagesArea/Home/Home";
import { ManagerPage } from "../../PagesArea/ManagerPage/ManagerPage";
import { Login } from "../../UserArea/Login/Login";
import { Register } from "../../UserArea/Register/Register";
import { AddNewVacation } from "../../VacationsArea/AddNewVacation/AddNewVacation";
import { EditVacation } from "../../VacationsArea/EditVacation/EditVacation";
import { VacationCard } from "../../VacationsArea/VacationCard/VacationCard";
import { Page404 } from "../Page404/Page404";

export function Routing(): JSX.Element {
    const navigate = useNavigate();
    const user = useSelector((state: AppState) => state.user);

    useEffect(() => {
        const currentPath = window.location.pathname;
    
        // Allow routes that are accessible to everyone
        if (["/home", "/", "/login", "/register", "/*"].includes(currentPath)) {
            return;
        }
    
        if (!authUtil.checkLoggedIn()) {
            notify.error("You need to be logged in to access this page.");
            navigate("/login");
            return;
        }
    
        if (user && currentPath.startsWith("/manager")) {
            if (!authUtil.checkIsAdmin(user.role)) {
                notify.error("You do not have permission to access this page.");
                navigate("/home");
            }
        }
    }, [navigate, user]);
    

    return (
        <div className="Routing">
            <Routes>
                {/* General Routes */}
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Page404 />} />

                {/* User Routes */}
                <Route path="/vacations" element={<VacationCard />} />

                {/* Admin Routes */}
                <Route path="/manager" element={<ManagerPage />} />
                <Route path="/vacations/new" element={<AddNewVacation />} />
                <Route path="/vacations/edit/:_id" element={<EditVacation />} />
            </Routes>
        </div>
    );
}
