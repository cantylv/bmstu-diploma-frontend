import ajax from '../../modules/ajax';
import urls from '../../modules/urls';
import template from './Restaurants.hbs';
import RestaurantCard from './components/RestaurantCard';
import './Restaurants.scss';

/**
 * Страница со списком ресторанов
 */
class Restaurants {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.parent = parent;
	}

	/**
	 * Отрисовка карточек ресторанов
	 */
	renderData(items) {
		const restaurantsElement = document.getElementById('restaurants');

		if (!items) {
			restaurantsElement.innerText = 'Нет доступных ресторанов';
		}

		items.forEach((item) => {
			const restaurantCard = new RestaurantCard(restaurantsElement, item);
			restaurantCard.render();
		});
	}

	/**
	 * Получение данных о ресторанах
	 */
	getData() {
		ajax.get(urls.getRestaurants(), (data) => {
			this.renderData(data);
		});
	}

	/**
	 * Рендеринг страницы
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', template());
		this.getData();
	}
}

export default Restaurants;
