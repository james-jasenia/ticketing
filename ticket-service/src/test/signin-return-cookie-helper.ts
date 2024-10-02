import jwt from 'jsonwebtoken';

async function signUpReturnCookie(
    id = '1234567890',
    email = 'test@test.com'
) {
    const payload = {
        id,
        email
    }

    // Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session object { jwt: MY_JWT }
    const session = { jwt: token };

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    // Return a string thats the cookie with the encoded data
    return [`session=${base64}`];
}

export default signUpReturnCookie;