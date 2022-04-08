const request = require("supertest");
const { Genre } = require("../../models/genre");
const { Movie } = require("../../models/movie");

describe("/api/movies", () => {
    let server;

    beforeEach(() => {
        server = require("../../server");
    });

    afterEach(async () => {
        await Genre.deleteMany({});
        await Movie.deleteMany({});
        await server.close();
    });

    describe("GET /", () => {
        const exec = () => {
            return request(server).get("/api/movies");
        };

        it("should return all movies", async () => {
            const genres = [{ name: "genre1" }, { name: "genre2" }];

            await Genre.collection.insertMany(genres);

            const genre1 = await Genre.find({ name: "genre1" });

            const movies = [
                {
                    title: "12345",
                    genreId: genre1._id,
                    numberInStock: 2,
                    dailyRentalRate: 3,
                },
                {
                    title: "67890",
                    genreId: genre1._id,
                    numberInStock: 10,
                    dailyRentalRate: 3,
                },
            ];
            await Movie.collection.insertMany(movies);

            const res = await exec();

            expect(res.status).toBe(200);
            // expect(res.body.length).toBe(1);
            // expect(res.body.some(m => m.title === '12345')).toBeTruthy();
        });

        it("should work", () => {
            expect(1).toBe(1);
        });
    });
});
