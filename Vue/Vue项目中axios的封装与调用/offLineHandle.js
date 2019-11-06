再提一下断网的处理，这里只做一个简单的示例：

<template>
    <div id="app">
        <div v-if="!network">
            <h3>我没网了</h3>
            <div @click="onRefresh">刷新</div>
        </div>
        <router-view/>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    export default {  
        name: 'App',
        computed: {
            ...mapState(['network'])  
        },  
        methods: {    
            // 通过跳转一个空页面再返回的方式来实现刷新当前页面数据的目的
            onRefresh () {      
                this.$router.replace('/refresh')    
            }  
        }
    }
</script>

这是app.vue，这里简单演示一下断网。在http.js中介绍了，我们会在断网的时候，来更新vue中network的状态，那么这里我们根据network的状态来判断是否需要加载这个断网组件。
断网情况下，加载断网组件，不加载对应页面的组件。
当点击刷新的时候，我们通过跳转refesh页面然后立即返回的方式来实现重新获取数据的操作。
因此我们需要新建一个refresh.vue页面，并在其beforeRouteEnter钩子中再返回当前页面。

// refresh.vue
beforeRouteEnter (to, from, next) {
    next(vm => {            
        vm.$router.replace(from.fullPath)        
    })    
}

这是一种全局通用的断网提示，当然了，也可以根据自己的项目需求操作。具体操作就仁者见仁智者见智了。
如果更多的需求，或者说是不一样的需求，可以根据自己的需求进行一个改进。
