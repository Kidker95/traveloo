import { describe, it } from "mocha";
import { expect } from "chai";
import supertest from "supertest";
import { app } from "../src/app";
import path from "path";
import { StatusCode } from "../src/3-models/enums";


describe("Testing A few of the site functionalities", () => {

    let token: string;
    let imagePath: string;


    before(async () => {
        // login as an admin
        const response = await supertest(app.server).post("/api/login")
            .field("email", "admin@traveloo.com")
            .field("password", "1234567");

        // update the token and imagePath variables
        token = response.body;
        imagePath = path.resolve(__dirname, "resources", "perfect-vacation.jpg")
    });

    // getAllVacations
    it("should return a vacations array", async () => {
        const response = await supertest(app.server)
            .get("/api/vacations")
            .set("Authorization", `Bearer ${token}`);
        const vacations = response.body;
        expect(vacations.length).to.be.greaterThanOrEqual(1);
        expect(vacations[0]).to.contain.keys("_id", "destination", "description", "price", "startDate", "endDate", "photoName");
    });

    // addNewVacation
    it("should add a new vacation(admin only)", async () => {
        console.log("Image Path:", imagePath);
        const response = await supertest(app.server)
            .post("/api/vacations")
            .set("Authorization", `Bearer ${token}`)
            .field("destination", "Testing Vacation")
            .field("description", "this is testing adding a vacation via the tests functions")
            .field("startDate", "2025-01-01")
            .field("endDate", "2025-01-10")
            .field("price", 300)
            .attach("photo", imagePath);
        const dbVacation = response.body;
        expect(dbVacation).to.not.be.empty;
        expect(dbVacation).to.contain.keys("_id", "destination", "description", "price", "startDate", "endDate", "likesCount", "photoUrl");
    });

    // deleteVacation
    it("should delete the added vacation (admin only)", async () => {

        const addResponse = await supertest(app.server)
            .post("/api/vacations")
            .set("Authorization", `Bearer ${token}`)
            .field("destination", "Vacation to Delete")
            .field("description", "This vacation will be deleted in the test")
            .field("startDate", "2025-02-01")
            .field("endDate", "2025-02-10")
            .field("price", 500)
            .attach("photo", imagePath);

        const addedVacation = addResponse.body;

        const deleteResponse = await supertest(app.server)
            .delete(`/api/vacations/${addedVacation._id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(deleteResponse.status).to.equal(StatusCode.NoContent);

        // Verify the vacation no longer exists
        const getResponse = await supertest(app.server)
            .get(`/api/vacations/${addedVacation._id}`)
            .set("Authorization", `Bearer ${token}`);
        expect(getResponse.status).to.equal(StatusCode.NotFound);
    });

    // toggleLike
    it("should log in as a user, like a vacation, and than unlike it", async () => {
        // first of all, log in as a user
        const response = await supertest(app.server).post("/api/login")
            .field("email", "user@traveloo.com")
            .field("password", "1234567");

        // update the token 
        token = response.body;

        const vacationId = "6745d3a5b42a769b6ed46858" // example id from the Tokyo, Japan vacation

        // second, post to like the vacation:
        const likeResponse = await supertest(app.server).post("/api/vacations/like/" + vacationId)
            .set("Authorization", `Bearer ${token}`)
        expect(likeResponse.statusCode).to.equal(StatusCode.OK);

        // than, post again to unlike
        const unlikeResponse = await supertest(app.server).post("/api/vacations/like/" + vacationId)
            .set("Authorization", `Bearer ${token}`)
        expect(unlikeResponse.statusCode).to.equal(StatusCode.OK);
    })

    // getLikesCount
    it("should log in as admin, and get the likes count",async ()=>{
        // login as an admin
        const loginResponse = await supertest(app.server).post("/api/login")
            .field("email", "admin@traveloo.com")
            .field("password", "1234567");

        // update the token 
        token = loginResponse.body;
        expect(loginResponse.statusCode).to.equal(StatusCode.OK);
        
        // get the likes count
        const likesCountResponse = await supertest(app.server)
        .get("/api/vacations/likes-count")
        .set("Authorization", `Bearer ${token}`);

        expect(likesCountResponse.body.length).to.be.greaterThanOrEqual(1);
        expect(likesCountResponse.body[0]).to.contain.keys("_id","destination","likesCount");
        expect(likesCountResponse.body[0].likesCount).to.be.a("number");
    })

    // check for wrong credentials on login
    it("should return 401 for invalid login credentials", async () => {
        const response = await supertest(app.server)
            .post("/api/login")
            .field("email", "wrong@traveloo.com")
            .field("password", "wrongpassword");
        expect(response.status).to.equal(StatusCode.Unauthorized);
    });

    // check for restricted routes
    it("should return 401 when accessing protected route without a token", async () => {
        const response = await supertest(app.server)
            .get("/api/vacations/");
        expect(response.status).to.equal(StatusCode.Unauthorized);
    });

    // check admin-only routes for logged in users
    it("should return 403 for a logged in user trying to access admin areas",async()=>{
        // login as a user
        const loginResponse = await supertest(app.server).post("/api/login")
            .field("email", "user@traveloo.com")
            .field("password", "1234567");

        token = loginResponse.body;
        
        const adminOnlyResponse = await supertest(app.server).get("/api/vacations/likes-count")
        .set("Authorization", `Bearer ${token}`)
        expect(adminOnlyResponse.status).to.equal(StatusCode.Forbidden);

    })





})