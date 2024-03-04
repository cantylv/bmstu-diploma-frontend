import cartIcon from '../../assets/cart.svg';
import { router } from '../../modules/router';
import { urls } from '../../routes/index.js';
import Button from '../Button';
import Input from '../Input';
import Logo from '../Logo/Logo';
import notificationApi from '../Notification/Notification';
import Profile from '../Profile';
import template from './Header.hbs';
import './Header.scss';

const user = {
	name: 'Роман',
	cart: {
		total: 300,
	},
	address: 'ул.Тверская, д.2',
};

/**
 * Шапка
 */
class Header {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.parent = parent;
	}

	/**
	 * Получение html компонента
	 */
	getHTML() {
		return template({ user: { address: user?.address } });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());

		const logoBlock = document.getElementById('logoContainer');
		const logo = new Logo(logoBlock);
		logo.render();

		/**
		 * Обработка нажатия на лого
		 */
		logoBlock.addEventListener('click', () => {
			router.navigate(urls.restaurants);
		});

		const searchBlock = document.getElementById('searchInput');
		const searchInput = new Input(searchBlock, {
			id: 'restaurants-search',
			placeholder: 'Рестораны, еда',
			button: 'Найти',
		});

		searchInput.render();

		if (user?.cart && user.cart.total > 0) {
			const cartBlock = document.getElementById('cart');
			const cartButton = new Button(cartBlock, {
				id: 'cart-button',
				content: `${user.cart.total} ₽`,
				icon: cartIcon,
			});

			cartButton.render();
		}

		const profileBlock = document.getElementById('profile-block');

		if (user) {
			const profile = new Profile(profileBlock);
			profile.render();
		} else {
			const loginButton = new Button(profileBlock, { id: 'header-login-button', content: 'Войти' });
			loginButton.render();
		}

		const headerElement = document.getElementById('header');

		window.addEventListener('scroll', () => {
			if (window.scrollY > 26) {
				headerElement.className = 'sticky';
			} else {
				headerElement.className = '';
			}
		});

		// EXPERIMENTAL
		const testButton = new Button(searchBlock, {
			id: 'test',
			content: 'notify',
			onClick: () => notificationApi.open({ duration: 0, title: 'Ошибка сервера', description: 'Lorem ipsum' }),
		});

		testButton.render();
	}
}

export default Header;
