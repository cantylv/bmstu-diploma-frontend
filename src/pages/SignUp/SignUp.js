import Button from '../../components/Button';
import Input from '../../components/Input';
import Link from '../../components/Link/Link';
import Logo from '../../components/Logo';
import {
	EMAIL_REGEX,
	INVALID_EMAIL_CHAR_REGEX,
	PASSWORD_REGEX,
	INVALID_PASSWORD_CHAR_REGEX,
	NAME_REGEX,
	INVALID_NAME_CHAR_REGEX,
	FIELDS_SIGN_UP,
} from '../../constants';
import api from '../../modules/api';
import { router } from '../../modules/router';
import urls from '../../routes/urls.js';
import template from './SignUp.hbs';

import './SignUp.scss';

/**
 * Страница регистрации.
 */
class SignUp {
	/**
	 * Создает экземпляр страницы.
	 * @param {Element} parent Элемент DOM, в который будет рендериться страница.
	 */
	constructor(parent) {
		this.parent = parent;
		this.isLoading = false;
	}

	/**
	 * Рендер страницы.
	 */
	render() {
		const templateVars = {
			signInUrl: urls.signIn,
		};

		const html = template(templateVars);
		this.parent.insertAdjacentHTML('beforeend', html);

		const logoContainer = document.querySelector('.logo-container-on-sign-up');

		if (logoContainer) {
			new Logo(logoContainer).render();
		}

		const linkBlock = document.getElementById('signup-redirect');
		const link = new Link(linkBlock, { id: 'signin-link', href: urls.signIn, text: 'Войти' });
		link.render();

		// Рендеринг полей формы в цикле
		FIELDS_SIGN_UP.forEach((field) => {
			new Input(this.parent.querySelector(field.selector), {
				id: field.id,
				placeholder: field.placeholder,
				type: field.type,
			}).render();
		});

		new Button(this.parent.querySelector('#sign-up-button-container'), {
			id: 'sign-up-button',
			content: 'Создать аккаунт',
			type: 'submit',
			disabled: true,
			withLoader: true,
			onClick: (e) => {
				e.preventDefault();
				this.handleSubmit();
			},
		}).render();

		this.errorsContainer = this.parent.querySelector('#errors-container');
		this.addFormValidation();
	}

	/**
	 * Валидация полей формы
	 */
	addFormValidation() {
		const emailElement = document.getElementById('email');
		const nameElement = document.getElementById('name');
		const passwordElement = document.getElementById('password');
		const confirmPasswordElement = document.getElementById('confirm-password');

		const emailErrorElement = document.getElementById('email-error');
		const nameErrorElement = document.getElementById('name-error');
		const passwordErrorElement = document.getElementById('password-error');
		const confirmPasswordErrorElement = document.getElementById('confirm-password-error');

		// Флаги начала ввода для каждого поля
		let hasEmailInputStarted = false;
		let hasNameInputStarted = false;
		let hasPasswordInputStarted = false;
		let hasConfirmPasswordInputStarted = false;

		// Состояние валидности каждого поля
		let isEmailValid = false;
		let isNameValid = false;
		let isPasswordValid = false;
		let isPasswordsMatch = false;

		// Функция для валидации email
		const validateEmail = () => {
			const isEmailValid = EMAIL_REGEX.test(emailElement.value);
			const hasInvalidChars = INVALID_EMAIL_CHAR_REGEX.test(emailElement.value);

			if (hasInvalidChars) {
				emailErrorElement.textContent = 'Содержит некорректный символ';
				emailElement.style.borderColor = 'red';
			} else if (emailElement.value) {
				emailErrorElement.textContent = isEmailValid ? '' : 'Неверный формат электронной почты';
				emailElement.style.borderColor = isEmailValid ? 'initial' : 'red';
			} else {
				emailErrorElement.textContent = hasEmailInputStarted ? 'Поле не может быть пустым' : '';
				emailElement.style.borderColor = hasEmailInputStarted ? 'red' : 'initial';
			}

			return emailElement.value && isEmailValid;
		};

		// Функция для валидации имени
		const validateName = () => {
			const isNameValid = NAME_REGEX.test(nameElement.value);
			const hasInvalidChars = INVALID_NAME_CHAR_REGEX.test(nameElement.value);

			if (hasInvalidChars) {
				nameErrorElement.textContent = 'Содержит некорректный символ';
				nameElement.style.borderColor = 'red';
			} else if (nameElement.value) {
				nameErrorElement.textContent = isNameValid ? '' : 'Имя должно начинаться с буквы и быть меньше 19 символов';
				nameElement.style.borderColor = isNameValid ? 'initial' : 'red';
			} else {
				nameErrorElement.textContent = hasNameInputStarted ? 'Поле не может быть пустым' : '';
				nameElement.style.borderColor = hasNameInputStarted ? 'red' : 'initial';
			}

			return nameElement.value && isNameValid;
		};

		// Функция для валидации пароля
		const validatePassword = () => {
			const isPasswordValid = PASSWORD_REGEX.test(passwordElement.value);
			const hasInvalidChars = INVALID_PASSWORD_CHAR_REGEX.test(passwordElement.value);

			if (hasInvalidChars) {
				passwordErrorElement.textContent = 'Содержит некорректный символ';
				passwordElement.style.borderColor = 'red';
			} else if (passwordElement.value) {
				passwordErrorElement.textContent = isPasswordValid
					? ''
					: 'Пароль должен содержать минимум 8 символов, включая число и букву';

				passwordElement.style.borderColor = isPasswordValid ? 'initial' : 'red';
			} else {
				passwordErrorElement.textContent = hasPasswordInputStarted ? 'Поле не может быть пустым' : '';
				passwordElement.style.borderColor = hasPasswordInputStarted ? 'red' : 'initial';
			}

			return passwordElement.value && isPasswordValid;
		};

		// Функция для проверки совпадения паролей
		const validateConfirmPassword = () => {
			const isPasswordsMatch = confirmPasswordElement.value === passwordElement.value;

			if (!isPasswordsMatch) {
				confirmPasswordErrorElement.textContent = 'Пароли не совпадают';
				confirmPasswordElement.style.borderColor = 'red';
			} else if (!confirmPasswordElement.value && hasConfirmPasswordInputStarted) {
				confirmPasswordErrorElement.textContent = 'Поле не может быть пустым';
				confirmPasswordElement.style.borderColor = 'red';
			} else {
				confirmPasswordErrorElement.textContent = '';
				confirmPasswordElement.style.borderColor = 'initial';
			}

			return confirmPasswordElement.value && isPasswordsMatch;
		};

		// Функция для обновления состояния кнопки регистрации
		const updateSignUpButtonState = () => {
			document.getElementById('sign-up-button').disabled = !(
				isNameValid &&
				isEmailValid &&
				isPasswordValid &&
				isPasswordsMatch
			);
		};

		// Слушатели событий для обновления флагов и вызова функций валидации
		emailElement.addEventListener('input', () => {
			hasEmailInputStarted = true;
			isEmailValid = validateEmail();
			updateSignUpButtonState();
		});

		nameElement.addEventListener('input', () => {
			hasNameInputStarted = true;
			isNameValid = validateName();
			updateSignUpButtonState();
		});

		passwordElement.addEventListener('input', () => {
			hasPasswordInputStarted = true;
			isPasswordValid = validatePassword();

			// При каждом изменении пароля, нужно заново проверять его совпадение с подтверждением
			if (hasConfirmPasswordInputStarted) {
				isPasswordsMatch = validateConfirmPassword();
			}

			updateSignUpButtonState();
		});

		confirmPasswordElement.addEventListener('input', () => {
			hasConfirmPasswordInputStarted = true;
			isPasswordsMatch = validateConfirmPassword();
			updateSignUpButtonState();
		});
	}

	/**
	 * Обработка кнопки входа
	 */
	handleSubmit() {
		const signinButton = this.parent.querySelector('#sign-up-button');
		const loaderBlock = signinButton.querySelector('#btn-loader');
		loaderBlock.classList.add('loading');

		// Подготовка данных пользователя
		const userData = {
			email: document.getElementById('email').value,
			name: document.getElementById('name').value,
			password: document.getElementById('password').value,
		};

		api.signup(userData, (data) => {
			localStorage.setItem('user-info', data);
			router.navigate(urls.restaurants);
		});
	}
}

export default SignUp;
