import api from '../../modules/api';
import urls from '../../routes/urls';
import { localStorageHelper } from '../../utils';
import AddressSujests from '../AddressSujests/AddressSujests';
import Map from '../Map';
import Modal from '../Modal/Modal';
import template from './AddressForm.hbs';
import './AddressForm.scss';

/**
 * Форма добавления адреса
 */
class AddressForm {
	coords;

	/**
	 * Конструктор класса
	 */
	constructor() {}

	/**
	 * Рендеринг компонента
	 */
	async render() {
		const user = localStorageHelper.getItem('user-info');

		const modal = new Modal({
			content: template(),
			className: 'address-modal',
			url: urls.address,
			initiatorId: 'address',
		});

		modal.render();

		const modalContent = document.getElementById('modal-content');

		const mapContainer = modalContent.querySelector('#address-map-container');
		const map = new Map(mapContainer, { fullPage: false, startX: 6000, startY: 6500 });
		map.render();

		if (user?.address) {
			api.geoCoder(user.address, map.goToPoint.bind(map));
		}

		const sujestsElement = new AddressSujests(modalContent.querySelector('#sujests-container'), {
			closeModal: () => {
				modal.close();
			},
			goToPoint: (coords) => {
				map.goToPoint(coords);
			},
		});

		sujestsElement.render();
	}
}

export default AddressForm;
