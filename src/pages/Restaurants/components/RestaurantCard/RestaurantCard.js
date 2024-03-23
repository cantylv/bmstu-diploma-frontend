import { router } from '../../../../modules/router';
import urls from '../../../../routes/urls';
import template from './RestaurantCard.hbs';
import './RestaurantCard.scss';

/**
 * Карточка ресторана
 */
class RestaurantCard {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 * @param {object} params - параметры компонента
	 * @param {number} params.id - идентификатор ресторана
	 * @param {string} params.img_url - URL изображения
	 * @param {string} params.name - название ресторана (заголовок карточки)
	 * @param {string} params.description - описание ресторана
	 * @param {string} params.rating - рейтинг ресторана
	 */
	constructor(parent, { id, img_url, name, description, rating }) {
		this.parent = parent;
		this.id = id;
		this.image = img_url;
		this.name = name;
		this.description = description;
		this.rating = rating;
	}

	/**
	 * Получение html компонента
	 * @returns {HTMLDivElement} - html
	 */
	getHTML() {
		return template({
			id: this.id,
			image: this.image,
			title: this.name,
			subtitle: this.description,
			rating: this.rating,
		});
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());
		const restaurantCard = document.getElementById(`restaurant-${this.id}`);

		restaurantCard.onclick = () => {
			router.navigate(`${urls.restaurants}/${this.id}`, { pageTitle: this.name });
		};
	}
}

export default RestaurantCard;
