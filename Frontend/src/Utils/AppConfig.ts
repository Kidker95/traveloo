

class AppConfig {

    private readonly baseUrl = process.env.REACT_APP_BASE_URL;
    public readonly vacationsUrl = this.baseUrl + "api/vacations/"; //getAllVacations
	public readonly likedVacationsUrl = this.vacationsUrl + "liked/"; //getLikedVacations
	public readonly likeVacationUrl = this.vacationsUrl + "like/"; //Like a vacation
	public readonly vacationsCsvUrl = this.vacationsUrl + "likes-csv/"; //Get .csv file for likes
	public readonly vacationsLikesCountUrl = this.vacationsUrl + "likes-count/"; // Get likes for chart
	public readonly vacationsNotStartedUrl = this.vacationsUrl + "not-started/"; 
	public readonly vacationsOngoingUrl = this.vacationsUrl + "ongoing/";

    public readonly registerUrl = this.baseUrl + "api/register/";
    public readonly loginUrl = this.baseUrl + "api/login";
    public readonly usersUrl = this.baseUrl + "api/users/"; //getAllUsers
    public readonly isEmailTakenUrl = this.usersUrl + "email-taken/:email" //check if email is taken in register
}

export const appConfig = new AppConfig();
