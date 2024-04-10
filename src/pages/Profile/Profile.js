import Button from '../../components/Button/Button';
import FileUpload from '../../components/FileUpload/FileUpload';
import Input from '../../components/Input';
import { FIELDS_PROFILE_FORM } from '../../constants';
import api from '../../modules/api';
import template from './Profile.hbs';
import './Profile.scss';

/**
 * Страница профиля
 */
class Profile {
	#parent;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.#parent = parent;
		this.file = '';
		this.name = '';
		this.email = '';
		this.phone = '';
	}

	/**
	 *
	 */
	handleSubmit() {
		const loaderBlock = this.#parent.querySelector('#btn-loader');
		loaderBlock.classList.add('loading');

		const formData = new FormData();
		formData.append('img', this.file);
		formData.append('name', this.name);
		formData.append('email', this.email);
		formData.append('phone', this.phone);

		api.updateUserData(formData, (data) => {
			localStorage.setItem('user-info', JSON.stringify(data));

			const profile = document.querySelector('.header__profile-image');
			profile.src = data.img_url;
		});
	}

	/**
	 * Отрисовка профиля
	 * @param {Array} data - информация о пользователе
	 */
	renderData(data) {
		this.file = data.img_src;
		this.name = data.name;
		this.email = data.email;
		this.phone = data.phone;

		this.#parent.innerHTML = template();

		const profileImage = this.#parent.querySelector('.profile__image');
		const fileUpload = new FileUpload(profileImage, {
			handleFile: (file) => {
				this.file = file;

				const submitButton = this.#parent.querySelector('#profile-submit');
				submitButton.disabled = false;
			},
			file: data?.img_url,
		});

		fileUpload.render();

		const profileInfo = this.#parent.querySelector('.profile__info');

		FIELDS_PROFILE_FORM.forEach((field) => {
			const input = new Input(profileInfo, {
				id: field.id,
				placeholder: field.placeholder,
				value: data[field.name],
				style: 'dynamic',
				onChange: (event) => {
					this[field.name] = event.target.value;

					const submitButton = this.#parent.querySelector('#profile-submit');
					submitButton.disabled = false;
				},
			});

			input.render();
		});

		const submitButton = new Button(profileInfo, {
			id: 'profile-submit',
			content: 'Сохранить',
			withLoader: true,
			disabled: true,
			onClick: () => {
				this.handleSubmit();
			},
		});

		submitButton.render();
	}

	/**
	 * Получение данных о пользователе
	 */
	getData() {
		api.getUserInfo(this.renderData.bind(this));
	}

	/**
	 * Рендеринг страницы
	 */
	render() {
		this.getData();
	}
}

export default Profile;
