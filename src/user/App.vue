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
            title: "we are users"
        }
    }
}
</script>

<style scoped>
    #app{
        width: 376px;
        height: 680px;
        position: absolute;
        overflow:hidden;
    }
    #app{
        overflow-x: hidden;
        overflow-y: auto;
        color: #000;
        font-size: .7rem;
        height: 100%;
    }
    /*滚动条样式*/
    #app::-webkit-scrollbar {
        width: 4px;
        /*height: 4px;*/
    }
    #app::-webkit-scrollbar-thumb {
        border-radius: 10px;
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        background: rgba(0,0,0,0.2);
    }
    #app::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 0;
        background: rgba(0,0,0,0.1);

    }
</style>
