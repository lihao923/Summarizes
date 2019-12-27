/**
 * article模块接口列表
 */

import base from './base'; // 导入接口域名列表
import axios from './http'; // 导入http中创建的axios实例
import qs from 'qs'; // 引入qs模块，用来序列化post类型的数据，

const article = {
    // 文章列表
    articleList() {
        return axios.get(`${base.article}/topics`);
    },
	
    // 文章详情,演示
    articleDetail(id, params) {
        return axios.get(`${base.article}/topic/${id}`, {
            params: params
        });
    },
	
    // post提交
    login(params) {
        return axios.post(`${base.article}/accesstoken`, qs.stringify(params));
    }
    // 其他接口…………
}

export default article;


// 调用演示
/* methods: {
    onLoad(id) {
        this.$api.article.articleDetail(id, {
            api: 123
        }).then(res => {
            // 执行某些操作
        })
    }
} */
