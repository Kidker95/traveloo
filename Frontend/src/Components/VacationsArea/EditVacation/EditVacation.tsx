import { useNavigate, useParams } from "react-router-dom";
import "./EditVacation.css";
import { useForm } from "react-hook-form";
import { VacationModel } from "../../../Models/VacationModel";
import { useState, useEffect } from "react";
import { notify } from "../../../Utils/Notify";
import { vacationService } from "../../../Services/VacationService";
import { photoUtil } from "../../../Utils/PhotoUtil";

export function EditVacation(): JSX.Element {
    const params = useParams();
    const _id = params._id;

    const { register, handleSubmit, setValue } = useForm<VacationModel>();
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState<string>(null);

    useEffect(() => {
        vacationService.getOneVacation(_id)
            .then(v => {
                setValue("destination", v.destination);
                setValue("description", v.description);
                setValue("startDate", v.startDate);
                setValue("endDate", v.endDate);
                setValue("price", v.price);
                setImagePreview(v.photoUrl);
            })
            .catch(err => notify.error(err));
    }, [_id, setValue]);

    async function onSubmit(vacation: VacationModel) {
        try {
            vacation._id = _id;
            vacation.photo = (vacation.photo as unknown as FileList)[0];

            if (vacation.photo && !photoUtil.isPhotoFileType(vacation.photo?.name)) {
                notify.error("Illegal image file type.");
                return;
            }

            await vacationService.updateVacation(vacation);
            notify.success("Vacation has been updated");

            navigate(`/vacations`);
        } catch (err: any) {
            notify.error(err);
        }
    }

    const today = new Date().toISOString().split("T")[0]; // For today's date in YYYY-MM-DD format

    return (
        <div className="EditVacation">
            <form onSubmit={handleSubmit(onSubmit)} className="grid-container">
                <div className="form-header">
                    <h3>Edit Vacation</h3>
                </div>
                <div className="text-field">
                    <label htmlFor="destination">Destination:</label>
                    <input
                        id="destination"
                        type="text"
                        placeholder="Destination"
                        {...register("destination")}
                        required
                        minLength={2}
                        maxLength={100}
                    />
                </div>

                <div className="text-field">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        placeholder="Description"
                        {...register("description")}
                        required
                        minLength={10}
                        maxLength={1000}
                    />
                </div>

                <div className="date-fields">
                    <div className="date-field">
                        <label htmlFor="startDate">Start Date:</label>
                        <input
                            id="startDate"
                            type="date"
                            {...register("startDate")}
                            min={today}
                        />
                    </div>

                    <div className="date-field">
                        <label htmlFor="endDate">End Date:</label>
                        <input
                            id="endDate"
                            type="date"
                            {...register("endDate")}
                        />
                    </div>
                </div>

                <div className="text-field">
                    <label htmlFor="price">Price:</label>
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        min={0}
                        max={10000}
                        {...register("price")}
                    />
                </div>

                <div className="text-field">
                    <label htmlFor="photo">Photo:</label>
                    <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        {...register("photo")}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                setImagePreview(URL.createObjectURL(file));
                            }
                        }}
                    />
                </div>

                {imagePreview && (
                    <div className="image-preview-container">
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                    </div>
                )}

                <div className="form-buttons">
                    <button type="submit" className="upload-button">Update Vacation</button>
                    <button type="reset" onClick={() => setImagePreview(null)} className="upload-button">Clear</button>
                </div>
            </form>
        </div>
    );

}