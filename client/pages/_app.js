import 'bootstrap/dist/css/bootstrap.min.css';
import buildClient from '../api/build-client';
import HeaderComponent from '../components/header';
function AppComponent({ Component, pageProps, currentUser }) {
  return (
    <div>
      <HeaderComponent currentUser={currentUser} />
      <Component {...pageProps} currentUser={currentUser} />
    </div>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return { pageProps, ...data };
};

export default AppComponent;