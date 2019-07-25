<template>
    <div id="app">
        <index></index>
    </div>
</template>

<script>

import Index from './components/index'
export default {
    name: 'app',
    components: {
        Index
    },
    data(){
        return {
            title: "we are here"
        }
    }
}

</script>

<style>
    html,
    body {
        position: relative;
        font-family: "微软雅黑", "Helvetica Neue", Helvetica, STHeiTi, sans-serif;
        font-family: "Microsoft YaHei";
        margin: 0;
        padding: 0;
        height: 100%;
        background:transparent;
        overflow-x:hidden;
    }

    #app {
        background-color: #173b32;
    }
</style>
