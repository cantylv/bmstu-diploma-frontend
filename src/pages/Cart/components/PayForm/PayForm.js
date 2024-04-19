import Button from '../../../../components/Button';
import Input from '../../../../components/Input/Input';
import { FIELDS_ADRESS_FORM } from '../../../../constants';
import { validateApartNumber, validateEntranceNumber, validateFloorNumber } from '../../../../helpers/validation'; ///////////////
import api from '../../../../modules/api';
import { router } from '../../../../modules/router';
import urls from '../../../../routes/urls';
import { localStorageHelper } from '../../../../utils';
import template from './PayForm.hbs';
import './PayForm.scss';

/**
 * Форма оплаты
 */
class PayForm {
	#parent;

	/**
	 * Создает экземпляр
	 * @param {HTMLDivElement} parent - родительский элемент
	 * @param {object} data - информация о корзине
	 */
	constructor(parent, data) {
		const extraAddressParts = data?.extra_address?.split(', ');

		this.#parent = parent;
		this.data = data;
		this.main = data.address || '';
		this.apart = extraAddressParts?.[0] || '';
		this.entrance = extraAddressParts?.[1] || '';
		this.floor = extraAddressParts?.[2] || '';
	}

	/**
	 *
	 */
	async handleSubmit() {
		const loaderBlock = this.#parent.querySelector('.btn__loader');
		loaderBlock.classList.add('btn__loader--loading');

		const mainInput = this.#parent.querySelector('#main-address');

		const data = await api.updateAddress({
			address: mainInput.value || this.main,
			extra_address: `${this.apart}, ${this.entrance}, ${this.floor}`,
		});

		if (!data.detail) {
			await api.checkout();

			const cart = document.getElementById('cart-button');
			const sum = cart.querySelector('span');

			sum.innerHTML = '';
			cart.className = 'btn btn--secondary size-xs';

			router.navigate(urls.restaurants);
		}
	}

	/**
	 * Рендер страницы
	 */
	render() {
		const user = localStorageHelper.getItem('user-info');

		if (user.address) {
			this.main = user.address;
		}

		this.#parent.insertAdjacentHTML('beforeend', template(this.data));
		const form = this.#parent.querySelector('.pay-form');
		const addressBlock = form.querySelector('.pay-form__inputs');

		FIELDS_ADRESS_FORM.forEach((field) => {
			new Input(addressBlock, {
				id: field.id,
				placeholder: field.placeholder,
				style: field.style,
				value: this[field.name],
				onChange: (event) => {
					this[field.name] = event.target.value;
				},
				disabled: field.name === 'main',
			}).render();
		});

		const mainInput = this.#parent.querySelector('#main-address-container');

		mainInput.onclick = () => {
			router.navigate(urls.address);
		};

		const checkoutButton = new Button(form, {
			id: 'pay-form-button',
			content: 'Оплатить',
			disabled: true,
			withLoader: true,
			onClick: () => {
				this.handleSubmit();
			},
		});

		checkoutButton.render();
		const submit = this.#parent.querySelector('#pay-form-button');

		const apartInput = document.getElementById('apart-address');
		apartInput.addEventListener('input', () => {
			const isApartValid = validateApartNumber(apartInput.value);
			this.isApartValid = isApartValid;
			submit.disabled = !this.isApartValid || !this.isEntranceValid || !this.isFloorValid;
		});

		const entranceInput = document.getElementById('entrance-address');
		entranceInput.addEventListener('input', () => {
			const isEntranceValid = validateEntranceNumber(entranceInput.value);
			this.isEntranceValid = isEntranceValid;
			submit.disabled = !this.isApartValid || !this.isEntranceValid || !this.isFloorValid;
		});

		const floorInput = document.getElementById('floor-address');
		floorInput.addEventListener('input', () => {
			const isFloorValid = validateFloorNumber(floorInput.value);
			this.isFloorValid = isFloorValid;
			submit.disabled = !this.isApartValid || !this.isEntranceValid || !this.isFloorValid;
		});
	}
}

export default PayForm;
