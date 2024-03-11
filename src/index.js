import '@fontsource/roboto';
import '@fontsource/montserrat';
import Layout from './components/Layout';
import { router } from './modules/router';
import NotFoundPage from './pages/NotFound/NotFound';
import { routes } from './routes';
import urls from './routes/urls.js';
import './global.scss';

const root = document.getElementById('root');
const layout = new Layout(root);
layout.render();

router.addRoutes(routes);

let initialPath;

if (window.location.pathname === urls.base) {
	initialPath = urls.restaurants;
} else {
	initialPath = window.location.pathname;
}

router.navigate(initialPath);

if (Object.values(urls).indexOf(window.location.pathname) === -1) {
	const notFoundPage = new NotFoundPage();
	notFoundPage.render();
}
