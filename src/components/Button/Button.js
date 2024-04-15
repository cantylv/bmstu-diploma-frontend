import Loader from '../Loader';
import template from './Button.hbs';
import './Button.scss';

/**
 * Кнопка
 */
class Button {
	#parent;
	#content;
	#type;
	#onClick;
	#disabled;
	#icon;
	#withLoader;
	#size;
	#style;
	#id;
	#additionalClass;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры кнопки
	 * @param {string} params.id - идентификатор элемента
	 * @param {string} params.content - текст внутри кнопки
	 * @param {'primary' | 'secondary' | 'clear'} params.style - стиль кнопки
	 * @param {'submit' | 'button'} params.type - тип элемента
	 * @param {boolean} params.disabled - блокировка кнопки
	 * @param {boolean} params.withLoader - лоадер
	 * @param {Function} params.onClick - событие при клике
	 * @param {string | undefined} params.icon - иконка
	 * @param {'xs' | 's'} params.size - размер кнопки
	 * @param {string} params.additionalClass - дополнительные классы для стилизации
	 */
	constructor(
		parent,
		{
			id,
			content = '',
			type = 'button',
			disabled = false,
			onClick,
			icon,
			style = 'primary',
			withLoader = false,
			size = 'xs',
			additionalClass = '',
		},
	) {
		this.#parent = parent;
		this.#content = content;
		this.#type = type;
		this.#onClick = onClick;
		this.#disabled = disabled;
		this.#icon = icon;
		this.#withLoader = withLoader;
		this.#style = style;
		this.#id = id;
		this.#size = size;
		this.#additionalClass = additionalClass;
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLElement} html
	 */
	getHTML() {
		const combinedClasses = `btn-${this.#style} size-${this.#size} ${this.#additionalClass}`.trim();
		return template({
			id: this.#id,
			content: this.#content,
			class: combinedClasses,
			icon: this.#icon,
			loader: this.#withLoader,
			type: this.#type,
			attribute: this.#disabled ? 'disabled' : '',
		});
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.#parent.insertAdjacentHTML('beforeend', this.getHTML());

		const currentButton = this.#parent.querySelector(`#${this.#id}`);

		currentButton.onclick = this.#onClick;

		if (this.#withLoader) {
			const loaderBlock = currentButton.querySelector('#btn-loader');
			const loader = new Loader(loaderBlock, { size: 's', style: 'secondary' });
			loader.render();
		}
	}
}

export default Button;
