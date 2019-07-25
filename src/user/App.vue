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


</style>
