import connection from '../config/mongoConnection.js';
import users from '../data/users.js';
import events from '../data/events.js';

const main = async() => {
    const db = await connection.dbConnection();
    let user1;
    let user2;
    let user3;

    try {
        user1 = await users.createUser("User 1", "uid111111111");
        user2 = await users.createUser("User 2", "uid222222222");
        user3 = await users.createUser("User 3", "uid333333333");
        console.log("Created users.");
    } catch(error) {
        console.log(`${error} Users may already exist.`);
        try {
            user1 = await users.getUserByName("User 1");
            user2 = await users.getUserByName("User 2");
            user3 = await users.getUserByName("User 3");
            console.log("Grabbed users.");
        } catch (error) {
            console.log(`${error}. Problems exist as users could not be found or created.`);
            return;
        }
    }
    console.log(user1);
    console.log(user2);
    console.log(user3);

    let event1;
    let event2;
    let event3;

    try {
        event1 = await events.createEvent(
            "Base Event 1",
            [{
                date: "2023-01-01T00:00:00.000Z",
                time: {
                    start: "2023-01-01T00:00:00.000Z",
                    end: "2023-01-01T00:30:00.000Z"
                }
            }],
            "ur mom's house",
            "Quick trip to mom's!",
            [],
            "https://coordinote.s3.amazonaws.com/MomsHouse",
            user1._id);
        event2 = await events.createEvent(
            "Base Event 2",
            [{
                date: "2023-01-02T00:00:00.000Z",
                time: {
                    start: "2023-01-02T00:00:00.000Z",
                    end: "2023-01-02T23:59:59.999Z"
                }
            },
            {
                date: "2023-01-03T00:00:00.000Z",
                time: {
                    start: "2023-01-03T00:00:00.000Z",
                    end: "2023-01-03T23:59:59.999Z"
                }
            },
            {
                date: "2023-01-04T00:00:00.000Z",
                time: {
                    start: "2023-01-04T00:00:00.000Z",
                    end: "2023-01-04T16:00:00.000Z"
                }
            }],
            "Las Vegas, Nevada",
            "Taking a 'business' trip.",
            [],
            "https://coordinote.s3.amazonaws.com/LasVegas",
            user2._id);
        event3 = await events.createEvent(
            "Base Event 3",
            [{
                date: "2023-01-04T15:00:00.000Z",
                time: {
                    start: "2023-01-04T15:00:00.000Z",
                    end: "2023-01-04T19:00:00.000Z"
                }
            }],
            "Normaltown, No",
            "Just a normal event at a normal place during a normal time...",
            [],
            "https://coordinote.s3.amazonaws.com/Normaltown",
            user3._id);
        console.log("Created events.");
    } catch(error) {
        console.log(`${error}. Events may already exist.`);
    }

    try {
        await events.addAttendee(
            event1._id,
            {
                _id: user2._id,
                availability: [{
                    date: "2023-01-01T00:00:00.000Z",
                    time: {
                        start: "2023-01-01T00:00:00.000Z",
                        end: "2023-01-01T00:30:00.000Z"
                    }
                }]
             });
        await events.addAttendee(
            event1._id,
            {
                _id: user3._id,
                availability: [{
                    date: "2023-01-01T00:00:00.000Z",
                    time: {
                        start: "2023-01-01T00:00:00.000Z",
                        end: "2023-01-01T00:30:00.000Z"
                    }
                }]
            });
        console.log("Added attendees to events.")
    } catch (error) {
        console.log(`${error}.`)
    }

    console.log("Seeded database.");

}

main();
