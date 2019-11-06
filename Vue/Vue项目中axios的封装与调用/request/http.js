/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */

import axios from 'axios';
import router from '../router';
import { Toast } from 'mint-ui';
import store from '../store/index' // 注意路径

/** 
 * 提示函数，默认显示1.5秒后关闭
 */
const tip = (massage, duration, position) => {
	Toast({
		message,
		duration: duration || 1500,
		position: position || 'middle'
	})
}

/** 
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    router.replace({
        path: '/gmall/g5012/login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    });
}


/** 
 * 请求失败后的错误统一处理 
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
    // 状态码判断
    switch (status) {
        // 401: 未登录状态，跳转登录页
        case 401:
            toLogin();
            break;
        // 403 token过期，清除token并跳转登录页
        case 403:
            tip('登录过期，请重新登录');
            localStorage.removeItem('token');
            store.commit('loginSuccess', null);
            setTimeout(() => {
                toLogin();
            }, 1000);
            break;
        // 404请求不存在
        case 404:
            tip('请求的资源不存在'); 
            break;
        default:
            console.log(other);   
	}
}


// 创建axios实例
var instance = axios.create({timeout: 1000 * 12});

// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

/** 
 * 请求拦截器 
 * 每次请求前，如果存在token则在请求头中携带token
 */ 
instance.interceptors.request.use(
    config => {
        // 登录流程控制中，根据本地是否存在token判断用户的登录情况
        // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
        // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
        // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
        const token = store.state.userInfo.token;
        token && (config.headers.Authorization = token);        
        return config;
    },
    error => Promise.error(error))

// 响应拦截器
instance.interceptors.response.use(    
    // 请求成功
    res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),    
    // 请求失败
    error => {
        const { response } = error;
        if (response) {
            // 请求已发出，但是不在2xx的范围 
            errorHandle(response.status, response.data.message);
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
            if (!window.navigator.onLine) {
               store.commit('changeNetwork', false);
            } else {
                return Promise.reject(error);
            }
        }
    });

export default instance;










































………………………………………………………………………………………………

// 请求超时时间
axios.defaults.timeout = 5000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

// 请求拦截器
axios.interceptors.request.use(
	config => {
		// 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
		// 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
		const token = store.state.userInfo.token;
		token && (config.headers.Authorization = token);
		return config;
	},
	error => {
		return Promise.error(error);
	})

// 响应拦截器
axios.interceptors.response.use(
	response => {
		if (response.status === 200) {
			return Promise.resolve(response);
		} else {
			return Promise.reject(response);
		}
	},
	// 服务器状态码不是200的情况    
	error => {
		if (error.response.status) {
			switch (error.response.status) {
				// 401: 未登录                
				// 未登录则跳转登录页面，并携带当前页面的路径                
				// 在登录成功后返回当前页面，这一步需要在登录页操作。                
				case 401:
					router.replace({
						path: '/gmall/g5012/login',
						query: {
							redirect: router.currentRoute.fullPath
						}
					});
					break;
					// 403 token过期                
					// 登录过期对用户进行提示                
					// 清除本地token和清空vuex中token对象                
					// 跳转登录页面                
				case 403:
					Toast({
						message: '登录过期，请重新登录',
						duration: 1000
					});
					// 清除token                    
					localStorage.removeItem('token');
					store.commit('loginSuccess', null);
					// 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
					setTimeout(() => {
						router.replace({
							path: '/gmall/g5012/login',
							query: {
								// redirect: router.currentRoute.fullPath
								redirect: '/gmall/g5012/index'
							}
						});
					}, 1000);
					break;
					// 404请求不存在                
				case 404:
					Toast({
						message: '网络请求不存在',
						duration: 1500
					});
					break;
					// 其他错误，直接抛出错误提示
				default:
					Toast({
						message: error.response.data.message,
						duration: 1500,
					});
			}
			return Promise.reject(error.response);
		}
	}
);
