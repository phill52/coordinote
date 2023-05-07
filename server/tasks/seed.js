import connection from '../config/mongoConnection.js';
import users from '../data/users.js';
import events from '../data/events.js';

const main = async() => {
    const db = await connection.dbConnection();

    try {
        let confirmation;
        confirmation = await users.createUser("Username1", "uid111111111");
        console.log(confirmation);
        confirmation = await users.createUser("Username2", "uid222222222");
        console.log(confirmation);
        confirmation = await users.createUser("Username3", "uid333333333");
        console.log(confirmation);
        console.log("Created users.");
    } catch(error) {
        console.log(`${error} Users may already exist.`);

    }

    let user1;
    let user2;
    let user3;
    try {
        user1 = await users.getUserByName("Username1");
        user1._id = user1._id.toString();
        console.log(user1);
        user2 = await users.getUserByUID("uid222222222");
        user2._id = user2._id.toString();
        console.log(user2);
        user3 = await users.getUserByName("Username3");
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
                date: "2023-01-01T00:00:00.000Z",
                time: {
                    start: "2023-01-01T00:00:00.000Z",
                    end: "2023-01-01T00:30:00.000Z"
                }
            }],
            "https://coordinote.s3.amazonaws.com/MomsHouse",
            user1.firebaseId);
        event1._id = event1._id.toString();
        console.log(event1);
        event2 = await events.createEvent(
            "Base Event 2",
            "Las Vegas Nevada",
            "Taking a business trip",
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
            "https://coordinote.s3.amazonaws.com/LasVegas",
            user2.firebaseId);
        event2._id = event2._id.toString();
        console.log(event2);
        event3 = await events.createEvent(
            "Base Event 3",
            "Normaltown No",
            "Just a normal event at a normal place during a normal time",
            [{
                date: "2023-01-04T15:00:00.000Z",
                time: {
                    start: "2023-01-04T15:00:00.000Z",
                    end: "2023-01-04T19:00:00.000Z"
                }
            }],
            "https://coordinote.s3.amazonaws.com/Normaltown",
            user3.firebaseId);
        event3._id = event3._id.toString();
        console.log(event3);
        console.log("Created events.");
    } catch(error) {
        console.log(`${error}`);
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
        console.log(`${error}.`);
    }
    try {
        console.log(await events.getAttendees(event1._id));
    } catch (error) {
        console.log(`${error}.`);
    }
    console.log("Seeded database.");
}

main();