import connection from '../config/mongoConnection.js';
import users from '../data/users.js';
import events from '../data/events.js';

const main = async() => {
    const db = await connection.dbConnection();
    let user1;
    let user2;
    let event1;
    let event2;
    try {
        user1 = await users.createUser("testUser", "testUid");
        user2 = await users.createUser("testUser2", "testUid2");
        event1 = await events.createEvent("testEvent", user1._id);
        event1 = await events.addAttendee(event1._id, user2._id);
        console.log("Seeded database.");
    } catch(error) {
        console.log(error);
        console.log('Error seeding database.');
    }
}

main();
