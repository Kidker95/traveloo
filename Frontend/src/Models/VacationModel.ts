export class VacationModel {
    public _id: string;
    public destination: string;
    public description: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public photo: string | File;
    public photoUrl: string;
    public likesCount: number;
}