import template from './Dropdown.hbs';
import './Dropdown.scss';
import { closeProfileSlideOptions, openProfileSlideOptions } from './utils';

const dropdownItems = [{ name: 'Выйти', exit: true }];

/**
 * Раскрывающееся окошко
 */
class Dropdown {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {Object} params - параметры
	 * @param {number} id - идентификатор
	 */
	constructor(parent, { id = 'dropdown' }) {
		this.parent = parent;
		this.isOpen = false;
		this.id = id;
	}

	/**
	 * Получение html компонента
	 */
	getHTML() {
		return template({
			open: this.isOpen ? 'dropdown-open' : '',
			id: this.id,
			items: dropdownItems,
		});
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());

		const dropdown = document.getElementById(this.id);

		dropdown.addEventListener('click', (event) => {
			event.stopPropagation();
		});

		this.parent.addEventListener('click', (event) => {
			event.stopPropagation();

			if (!this.isOpen) {
				dropdown.className = 'dropdown dropdown-open';
				this.isOpen = true;
				this.parent.animate(...openProfileSlideOptions);
			}
		});

		window.addEventListener('click', () => {
			if (this.isOpen) {
				dropdown.className = 'dropdown';
				this.isOpen = false;
				this.parent.animate(...closeProfileSlideOptions);
			}
		});
	}
}

export default Dropdown;
