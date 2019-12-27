/**
 * storage封装
 * @param {String} way storage类型，localStorage或者sessionStorage
 * @param {String} key 存储的键名
 * @param {String} value 存储的键值
 */

export default storage = {
	set: (way, key, value) => {
		if(way === 'localStorage') {
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			sessionStorage.setItem(key, JSON.stringify(value));
		}
	},
	get: (way, key) => {
		if(way === 'localStorage') {
			return JSON.parse(localStorage.getItem(key));
		} else {
			return JSON.parse(sessionStorage.getItem(key));
		}
	},
	remove: (way, key) {
		if(way === 'localStorage') {
			localStorage.removeItem(key);
		} else {
			sessionStorage.removeItem(key);
		}
	},
	clear: (way, key) => {
		if(way === 'localStorage') {
			localStorage.clear();
		} else {
			sessionStorage.clear();
		}
	}

}














