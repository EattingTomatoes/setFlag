<template>
    <div class="mention" v-if="isShowMention">
        <div class="mask" @click="hideMention"></div>
        <div class="main-mention">
            <img class="mention-img" src="./../assets/img/mention.png"/>
            <div class="mention-text">
                <span>{{text}}</span>
            </div>
        </div>
    </div>
</template>

<script>

    import eventBus from '../assets/eventBus';

    export default {
        name: "mention",
        data() {
            return {
                text: '',
                isShowMention: false
            }
        },

        created(){
            eventBus.$on('showMention',(text)=>{
                this.text = text;
                this.isShowMention = true
            })
        },

        methods:{
            hideMention(){
                this.isShowMention = false;
            }
        }
    }


</script>

<style lang="scss" scoped>


    .mask{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 654px;
        z-index: 1;
        background: rgba(0, 0, 0, 0.5);
    }
    
    .main-mention{
        position: absolute;
        top: 270px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 996;
        width: 286px;
        height: 161px;


        .mention-img{
            max-width: 300px;
            max-height: 160px;
        }

        .mention-text {
            color: black;
            font-weight: 300;
            position: absolute;
            font-size: 15px;
            top: 36px;
            left: 86px;
            width: 145px;
            height: 107px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>