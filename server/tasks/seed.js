import connection from '../config/mongoConnection.js';
import users from '../data/users.js';
import events from '../data/events.js';

const main = async() => {
    const db = await connection.dbConnection();

    try {
        let confirmation;
        confirmation = await users.createUser("daniel", "K1VaGssdYbeeWKmJdslYeh9ckM83");
        console.log(confirmation);
        confirmation = await users.createUser("JeremyKrugman", "Zbl5haQkh1ft1k4J1Si5qvq80IJ3");
        console.log(confirmation);
        confirmation = await users.createUser("paner225", "LMqJQRsTvOOWlWI0ENpgcJ2MoPG2");
        console.log(confirmation);
        console.log("Created users.");
    } catch(error) {
        console.log(`${error} Users may already exist.`);
    }

    let user1;
    let user2;
    let user3;
    try {
        user1 = await users.getUserByName("daniel");
        user1._id = user1._id.toString();
        console.log(user1);
        user2 = await users.getUserByFirebaseId("7Hclg4po6jZ60FRGCt9AhAbB3Z22");
        user2._id = user2._id.toString();
        console.log(user2);
        user3 = await users.getUserByName("paner225");
        user3._id = user3._id.toString();
        console.log(user3);
        console.log("Grabbed users.");
    } catch (error) {
        console.log(`${error}. Problems exist as users could not be found or created.`);
        return;
    }

    let event1;
    let event2;
    let event3;

    try {
        event1 = await events.createEvent(
            "Base Event 1",
            "ur moms house",
            "Quick trip to moms",
            [{
                date: "2024-01-04T15:00:00.000Z",
                time: {
                    start: "2024-01-04T15:00:00.000Z",
                    end: "2024-01-04T19:00:00.000Z"
                }
            }],
            "https://coordinote.s3.amazonaws.com/MomsHouse",
            user1._id);
        event1._id = event1._id.toString();
        console.log(event1);
        event2 = await events.createEvent(
            "Base Event 2",
            "Las Vegas Nevada",
            "Taking a business trip",
            [{
                date: "2024-01-02T00:00:00.000Z",
                time: {
                    start: "2024-01-02T00:00:00.000Z",
                    end: "2024-01-02T23:59:59.999Z"
                }
            },
            {
                date: "2024-01-03T00:00:00.000Z",
                time: {
                    start: "2024-01-03T00:00:00.000Z",
                    end: "2024-01-03T23:59:59.999Z"
                }
            },
            {
                date: "2024-01-04T00:00:00.000Z",
                time: {
                    start: "2024-01-04T00:00:00.000Z",
                    end: "2024-01-04T16:00:00.000Z"
                }
            }],
            "https://coordinote.s3.amazonaws.com/LasVegas",
            user1._id);
        event2._id = event2._id.toString();
        console.log(event2);
        event3 = await events.createEvent(
            "Base Event 3",
            "Normaltown No",
            "Just a normal event at a normal place during a normal time",
            [{
                date: "2024-01-04T15:00:00.000Z",
                time: {
                    start: "2024-01-04T15:00:00.000Z",
                    end: "2024-01-04T19:00:00.000Z"
                }
            }],
            "https://coordinote.s3.amazonaws.com/Normaltown",
            user1._id);
        event3._id = event3._id.toString();
        console.log(event3);
        console.log("Created events.");
    } catch(error) {
        console.log(`${error}`);
    }

    console.log("Seeded database.");
    process.exit(0);
}

main();