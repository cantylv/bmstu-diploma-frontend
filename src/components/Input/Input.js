import Button from '../Button';
import template from './Input.hbs';
import './Input.scss';

/**
 * Инпут
 */
class Input {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {Object} id - идентификатор элемента
	 * @param {Object} params - параметры инпута
	 * @param {string} placeholder - текстовая подсказка внутри поля
	 * @param {string} type - тип инпута
	 * @param {string | undefined} button - название кнопки
	 */
	constructor(parent, { id, placeholder, type = 'text', button }) {
		this.parent = parent;
		this.placeholder = placeholder;
		this.button = button;
		this.type = type;
		this.id = id;
		this.isVisible = false;
	}

	/**
	 * Получение html компонента
	 */

	getHTML() {
		return template({
			placeholder: this.placeholder,
			button: this.button,
			type: this.type,
			isPassword: this.type === 'password',
			id: this.id,
		});
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());

		if (this.button) {
			const buttonBlock = document.getElementById('search-button');
			const searchButton = new Button(buttonBlock, { id: 'header-search-button', content: 'Найти' });
			searchButton.render();
		}

		if (this.type !== 'password') return;

		const eyeButton = document.getElementById('btn-eye');
		const password = document.getElementById(this.id);

		eyeButton.addEventListener('click', () => {
			this.isVisible = !this.isVisible;

			if (this.isVisible) {
				eyeButton.className = 'visible';
				password.type = 'text';
			} else {
				eyeButton.className = 'hidden';
				password.type = 'password';
			}
		});
	}
}

export default Input;
