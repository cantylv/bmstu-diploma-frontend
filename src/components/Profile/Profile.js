import defaultAvatar from '../../assets/default-avatar.png';
import template from './Profile.hbs';
import './Profile.scss';

const user = {
	name: 'Роман',
	cart: {
		total: 300,
	},
};

/**
 * Профиль
 */
class Profile {
	/**
	 * Конструктор класса
	 * @param {Element} parent - родительский элемент
	 */
	constructor(parent) {
		this.parent = parent;
	}

	/**
	 * Получение html компонента
	 */
	getHTML() {
		const avatar = user.avatarUrl ? user.avatarUrl : defaultAvatar;

		return template({ name: user.name, avatarUrl: avatar });
	}

	/**
	 * Рендеринг компонента
	 */
	render() {
		this.parent.insertAdjacentHTML('beforeend', this.getHTML());
	}
}

export default Profile;
