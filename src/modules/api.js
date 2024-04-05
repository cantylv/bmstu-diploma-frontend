import Notification from '../components/Notification/Notification';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, YANDEX_API_KEY } from '../constants';
import ajax from './ajax';

/**
 * Класс, содержащий запросы
 */
class Api {
	#url;

	/**
	 * Конструктор класса
	 */
	constructor() {
		this.#url = '/api';
	}

	/**
	 * Метод для получения списка ресторанов
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getRestaurants(callback) {
		const data = await ajax.get(`${this.#url}/restaurants`);

		callback(data);
	}

	/**
	 * Метод для получения информации о пользователе
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getUserInfo(callback) {
		const data = await ajax.get(`${this.#url}/user`, { showNotifyError: false });

		callback(data);
	}

	/**
	 * Метод для авторизации пользователя
	 * @param {object} body - объект, посылаемый в запросе
	 * @param {string} body.email - почта пользователя
	 * @param {string} body.password - пароль пользователя
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async login(body, callback) {
		const { data, error } = await ajax.post(`${this.#url}/signin`, body);

		if (data && !error) {
			Notification.open({
				duration: 3,
				title: SUCCESS_MESSAGES.login.title,
				description: SUCCESS_MESSAGES.login.description,
				type: 'success',
			});

			callback(data);
			return;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.LOGIN,
			description: error || ERROR_MESSAGES.SERVER_RESPONSE,
			type: 'error',
		});
	}

	/**
	 * Метод для регистрации пользователя
	 * @param {object} body - объект, посылаемый в запросе
	 * @param {string} body.email - почта пользователя
	 * @param {string} body.password - пароль пользователя
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async signup(body, callback) {
		const { data, error } = await ajax.post(`${this.#url}/signup`, body);

		if (data && !error) {
			Notification.open({
				duration: 3,
				title: SUCCESS_MESSAGES.signup.title,
				description: SUCCESS_MESSAGES.signup.description,
				type: 'success',
			});

			callback(data);
			return;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.SIGNUP,
			description: error || ERROR_MESSAGES.SERVER_RESPONSE,
			type: 'error',
		});
	}

	/**
	 * Метод для выхода пользователя
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async signout(callback) {
		const { data, error } = await ajax.post(`${this.#url}/signout`);

		if (error || !data) {
			Notification.open({
				duration: 3,
				title: ERROR_MESSAGES.SIGNOUT,
				description: error || ERROR_MESSAGES.SERVER_RESPONSE,
				type: 'error',
			});

			return;
		}

		Notification.open({
			duration: 3,
			title: SUCCESS_MESSAGES.signout.title,
			description: SUCCESS_MESSAGES.signout.description,
			type: 'success',
		});

		callback();
	}

	/**
	 * Метод для получения саджестов
	 * @param {object} text - слово, по которому создаются саджесты
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async getSujests(text, callback) {
		const { results } = await ajax.get(
			`https://suggest-maps.yandex.ru/v1/suggest?text=${text}&bbox=37.39,55.57~37.84,55.9&strict_bounds=1&apikey=${YANDEX_API_KEY}&lang=ru`,
		);

		callback(results);
	}

	/**
	 * Метод для добавления адреса
	 * @param {object} body - объект, посылаемый в запросе
	 * @param {string} body.address - адрес пользователя
	 * @param {void} callback - функция-коллбэк, вызываемая после выполенения запроса
	 */
	async saveAddress(body, callback) {
		const { data, error } = await ajax.post(`${this.#url}/address`, body);

		if (data && !error) {
			Notification.open({
				duration: 3,
				title: SUCCESS_MESSAGES.address.title,
				description: SUCCESS_MESSAGES.address.description,
				type: 'success',
			});

			callback(data);
			return;
		}

		Notification.open({
			duration: 3,
			title: ERROR_MESSAGES.ADDRESS,
			description: error || ERROR_MESSAGES.SERVER_RESPONSE,
			type: 'error',
		});
	}
}

export default new Api();
