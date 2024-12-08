import { useForm } from "react-hook-form";
import "./AddNewVacation.css";
import { VacationModel } from "../../../Models/VacationModel";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { notify } from "../../../Utils/Notify";
import { vacationService } from "../../../Services/VacationService";

export function AddNewVacation(): JSX.Element {

    const { register, handleSubmit } = useForm<VacationModel>();
    const navigate = useNavigate();
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const send = async (vacation: VacationModel) => {
        try {
            const startDate = new Date(vacation.startDate);
            const endDate = new Date(vacation.endDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to midnight

            if (startDate < today) {
                notify.error("Start date cannot be in the past.");
                return;
            }

            if (endDate < startDate) {
                notify.error("End date cannot be earlier than start date.");
                return;
            }

            // Convert photo from FileList to File
            vacation.photo = (vacation.photo as unknown as FileList)[0];
            await vacationService.addVacation(vacation);
            notify.success("Vacation added successfully!");
            navigate("/vacations");
        } catch (err: any) {
            notify.error(err.message || "Failed to add vacation.");
        }
    };

    // Get today's date in YYYY-MM-DD format for the "min" attribute
    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="AddNewVacation">
            <form onSubmit={handleSubmit(send)} className="grid-container">
    
                <div className="form-header">
                    <h3>Add New Vacation</h3>
                </div>
    
                <div className="text-field">
                    <label>Destination:</label>
                    <input type="text" {...register("destination", { required: true })} minLength={2} maxLength={100} />
                </div>
    
                <div className="text-field">
                    <label>Description:</label>
                    <textarea {...register("description", { required: true })} minLength={10} maxLength={1000}></textarea>
                </div>
    
                <div className="date-fields">
                    <div className="date-field">
                        <label>Start Date:</label>
                        <input type="date" {...register("startDate", { required: true })} min={today} />
                    </div>
                    <div className="date-field">
                        <label>End Date:</label>
                        <input type="date" {...register("endDate", { required: true })} />
                    </div>
                </div>
    
                <div className="text-field">
                    <label>Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        min={0}
                        max={10000}
                        {...register("price", { required: true })}
                    />
                </div>
    
                <div className="text-field">
                    <label>Photo:</label>
                    <input
                        type="file"
                        accept="image/*"
                        {...register("photo", { required: true })}
                        onChange={handleImageChange}
                    />
                </div>
    
                {preview && (
                    <div className="image-preview-container">
                        <img src={preview} alt="Preview" className="image-preview" />
                    </div>
                )}
    
                <div className="form-buttons">
                    <button type="submit" className="upload-button">
                        Add Vacation
                    </button>
                    <button
                        type="reset"
                        className="upload-button"
                        onClick={() => setPreview(null)}
                    >
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );    

}