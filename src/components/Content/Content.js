import template from './Content.hbs';
import './Content.scss';

/**
 * Контент
 */
class Content {
	#parent;
	#withoutPadding;

	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {boolean} params.withoutPadding - отключить отступы
	 */
	constructor(parent, { withoutPadding = false } = {}) {
		this.#parent = parent;
		this.#withoutPadding = withoutPadding;
		this.dragTime = 0;
		this.indentLeft = 0;
	}

	/**
	 * Рендеринг компонента
	 */
	async render() {
		this.#parent.insertAdjacentHTML('beforeend', template());
	}
}

export default Content;
