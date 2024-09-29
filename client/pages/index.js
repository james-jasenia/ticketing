import buildClient from "../api/build-client";

function LandingPage({ data }) {
    console.log(data);

    return data.currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>;
}

// Most of the time, this will run on the server. The only time it will run on the client is if you are navigating directly to the page from within the app.
// - An example of this is if you successfully log in, and then navigate directly to the landing page.

// If you put const { data } = await axios.get('/api/users/currentuser'), it will map to localhost inside the container, not on the host.
// - It is not going via ingress-nginx, but via the service.
// - In addition, we need to pass along the headers, so we can get the cookie.

LandingPage.getInitialProps = async (context) => {
    try {
        const { data } = await buildClient(context).get("/api/users/currentuser");
        console.log(data);
        return { data };
    } catch (err) {
        return {};
    }
};

export default LandingPage;
