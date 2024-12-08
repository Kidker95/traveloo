import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { IconButton, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Role } from "../../../Models/Enums";
import { LikeModel } from "../../../Models/LikeModel";
import { VacationModel } from "../../../Models/VacationModel";
import { AppState } from "../../../Redux/Store";
import { vacationAction } from "../../../Redux/VacationSlice";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { useTitle } from "../../../Utils/UseTitle";
import "./VacationCard.css";

export function VacationCard(): JSX.Element {
    useTitle("Vacations | Traveloo");

    const dispatch = useDispatch();
    const user = useSelector((state: AppState) => state.user);
    const vacations = useSelector((state: AppState) => state.vacation);
    const [likedToggle, setLikedToggle] = useState(false);
    const [notStartedToggle, setNotStartedToggle] = useState(false);
    const [ongoingToggle, setOngoingToggle] = useState(false);
    const [likedVacations, setLikedVacations] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    // helper function to sort the vacation by start date
    const sortVacationsByStartDate = (vacations: VacationModel[]) =>  vacations.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allVacations = await vacationService.getAllVacations();
                
                // Sort vacations by start date
                const sortedVacations = sortVacationsByStartDate(allVacations);
                dispatch(vacationAction.initVacation(sortedVacations));
    
                if (user && user._id) {
                    const liked = await vacationService.getLikedVacations(user);
                    setLikedVacations(liked.map((v) => v._id));
                }
            } catch (err) {
                notify.error(err);
            }
        };
    
        fetchData();
    }, [dispatch, user?._id]);
    

    // ------------------------ Toggles -----------------------

    const handleToggleLiked = async () => {
        try {
            if (!likedToggle) {
                const likedVacations = await vacationService.getLikedVacations(user);
                const sortedLikedVacations = sortVacationsByStartDate(likedVacations);
                dispatch(vacationAction.initVacation(sortedLikedVacations));
            } else {
                const allVacations = await vacationService.getAllVacations();
                const sortedAllVacations = sortVacationsByStartDate(allVacations);
                dispatch(vacationAction.initVacation(sortedAllVacations));
            }
            setLikedToggle(!likedToggle);
        } catch (err: any) {
            console.log(err);
            notify.error(err.message);
        }
    };
    
    const handleToggleNotStarted = async () => {
        try {
            if (!notStartedToggle) {
                const notStartedVacations = await vacationService.getVacationsNotStarted();
                const sortedNotStartedVacations = sortVacationsByStartDate(notStartedVacations);
                dispatch(vacationAction.initVacation(sortedNotStartedVacations));
                setOngoingToggle(false); // Ensure ongoing is disabled
            } else {
                const allVacations = await vacationService.getAllVacations();
                const sortedAllVacations = sortVacationsByStartDate(allVacations);
                dispatch(vacationAction.initVacation(sortedAllVacations));
            }
            setNotStartedToggle(!notStartedToggle);
        } catch (err: any) {
            console.log(err);
            notify.error(err.message);
        }
    };
    
    const handleToggleOngoing = async () => {
        try {
            if (!ongoingToggle) {
                const ongoingVacations = await vacationService.getVacationsOngoing();
                const sortedOngoingVacations = sortVacationsByStartDate(ongoingVacations);
                dispatch(vacationAction.initVacation(sortedOngoingVacations));
                setNotStartedToggle(false); // Ensure not started is disabled
            } else {
                const allVacations = await vacationService.getAllVacations();
                const sortedAllVacations = sortVacationsByStartDate(allVacations);
                dispatch(vacationAction.initVacation(sortedAllVacations));
            }
            setOngoingToggle(!ongoingToggle);
        } catch (err: any) {
            console.log(err);
            notify.error(err.message);
        }
    };    

    // ------------------------ CRUD (and like) ------------------------

    const handleEdit = (vacation: VacationModel) => navigate("/vacations/edit/" + vacation._id);

    const handleDelete = async (vacation: VacationModel) => {
        try {
            const sure = await notify.confirm(`Are you sure you want to delete the vacation to ${vacation.destination}?`);
            if (!sure) return;
            await vacationService.deleteVacation(vacation._id);
            notify.success("Vacation deleted!");
            // Remove from global state
            dispatch(vacationAction.deleteVacation(vacation._id));
        } catch (err: any) {
            notify.error(err || "Can't delete vacation");
        }
    };

    const handleLike = async (vacation: VacationModel) => {
        try {
            if (!user || !user._id) {
                notify.error("You need to log in to like a vacation.");
                return;
            }

            const like: LikeModel = {
                userId: user._id,
                vacationId: vacation._id,
            };

            await vacationService.toggleLike(like);

            // Optimistically update the liked vacations state locally
            setLikedVacations((prev) =>
                prev.includes(vacation._id)
                    ? prev.filter((id) => id !== vacation._id) // Unlike
                    : [...prev, vacation._id] // Like
            );

            // Update Redux state for likes count
            const updatedLikesCount =
                vacations.find((v) => v._id === vacation._id)?.likesCount || 0;
            dispatch(
                vacationAction.toggleLikeVacation({
                    vacationId: vacation._id,
                    likesCount: vacation.likesCount + (likedVacations.includes(vacation._id) ? -1 : 1), // Adjust the count
                })
            );
        } catch (err: any) {
            notify.error(err.message || "Failed to toggle like");
        }
    };

    const vacationsPerPage = 9;
    const totalPages = Math.ceil(vacations.length / vacationsPerPage);
    const displayedVacations = vacations.slice(
        (currentPage - 1) * vacationsPerPage,
        currentPage * vacationsPerPage
    );
   

    return (
        <div className="VacationCard">
            {user && user.role === Role.Admin && (
                <div className="admin-controls">
                    <button className="btn primary" onClick={() => navigate("/vacations/new")}>
                        Add Vacation
                    </button>
                </div>
            )}
    
            <div className="toggle-buttons">
                {user && user.role !== Role.Admin && (
                    <button className={`btn ${likedToggle ? "primary" : "outline"}`} onClick={handleToggleLiked}>
                        {likedToggle ? "Show All Vacations" : "Liked Vacations"}
                    </button>
                )}
                <button className={`btn ${notStartedToggle ? "primary" : "outline"}`} onClick={handleToggleNotStarted}>
                    {notStartedToggle ? "Show All Vacations" : "Not Started Vacations"}
                </button>
                <button className={`btn ${ongoingToggle ? "primary" : "outline"}`} onClick={handleToggleOngoing}>
                    {ongoingToggle ? "Show All Vacations" : "Ongoing Vacations"}
                </button>
            </div>
    
            {vacations.length === 0 ? (
                <p>No vacations match your criteria.</p>
            ) : (
                <>
                    <div className="vacation-grid">
                        {displayedVacations.map((vacation) => (
                            <div key={vacation._id} className="vacation-card">
                                <img src={vacation.photoUrl} alt={vacation.destination} className="vacation-image" />
                                <div className="vacation-content">
                                    <h3 className="vacation-destination">{vacation.destination}</h3>
                                    <div className="vacation-date">
                                        <EventIcon className="vacation-date-icon" />
                                        <span>
                                            {vacation.startDate} - {vacation.endDate}
                                        </span>
                                    </div>
                                    <p className="vacation-description">{vacation.description}</p>
                                    <p className="vacation-price">
                                        <strong>Price:</strong> ${vacation.price}
                                    </p>
                                    <p className="vacation-likes">Likes: {vacation.likesCount || 0}</p>
                                    <div className="actions">
                                        {user && user.role === Role.Admin && (
                                            <>
                                                <IconButton className="icon-btn" onClick={() => handleEdit(vacation)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton className="icon-btn delete" onClick={() => handleDelete(vacation)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </>
                                        )}
                                        {user && user.role !== Role.Admin && (
                                            <IconButton className="icon-btn" onClick={() => handleLike(vacation)}>
                                                {likedVacations.includes(vacation._id) ? (
                                                    <FavoriteIcon />
                                                ) : (
                                                    <FavoriteBorderIcon />
                                                )}
                                            </IconButton>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pagination-container">
                        <Pagination count={totalPages} page={currentPage} onChange={(_, page) => setCurrentPage(page)} color="primary" />
                    </div>
                </>
            )}
        </div>
    );
    
    
}
