<template>
    <div class="time_stamp">
        <div class="time_line_box">
            <div class="time_line" style="width:90%;">
                <ol>
                    <li v-for="(msg,index) in prizeContent" v-bind:key="">
                        <a-popover :content="msg.type">
                            <a class="order_item" :class="{selected: msg.count<=totalCount}"
                               :style="{left: (msg.count/finalCount)*100 + '%'}">{{showStep[index]}}</a>
                        </a-popover>
                    </li>
                </ol>
                <span class="filling_line" :style="styleObject"></span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "timeStamp",
        props:{
            prizeMsg:{
                type: Array,
                required: true
            },
            objectCount:{
                type: Number,
                required: true
            },
            supportCount:{
                type: Number,
                required: true
            }
        },
        data(){
            return{
                styleObject: {
                    fontSize: '20px',
                    transform: 'scaleX(0.22)'
                },
                processedPrizeContent:[],
                showStep:['A','B','C','D','E'],
                finalCount: 1,
                totalCount: 1,
            }
        },
        computed:{
            prizeContent(){
                if(this.prizeMsg.length!=0){
                    this.finalCount = this.prizeMsg[this.prizeMsg.length-1].votesCount;
                    this.processedPrizeContent = this.prizeMsg.map(item => {
                        return {
                            type: "达到" + item.votesCount + "票,送出" + item.prizeType + "共"
                            + item.prizeCount + "份",
                            count: item.votesCount
                        }
                    });
                    this.totalCount = this.supportCount + this.objectCount;
                    this.styleObject = {
                        fontSize: '20px',
                        transform: 'scaleX(' + this.totalCount/this.finalCount + ')'
                    };
                    console.log(this.prizeMsg);
                    return this.processedPrizeContent;
                }

            },
            lineContent(){

            }

        }
    }
</script>

<style scoped>
    .time_line_box{
        position: relative;
        height: 60px;
        overflow: hidden;
        bottom: 20px;
    }
    .time_line{
        position: absolute;
        z-index: 1;
        left: 20px;
        top: 49px;
        height: 5px;
        background: #dfdfdf;
        border-radius: 10px 10px 10px 10px;
        -webkit-transition: -webkit-transform 0.4s;
        -moz-transition: -moz-transform 0.4s;
        transition: transform 0.4s;
    }
    .order_item{
        position: absolute;
        bottom: 0;
        z-index: 2;
        text-align: center;
        font-size: 13px;
        padding-bottom: 15px;
        color: #fcffda;
    }
    .order_item:after{
        content: '';
        position: absolute;
        left: 50%;
        right: auto;
        transform: translateX(-50%);
        bottom: -5px;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        border: 2px solid #dfdfdf;
        background-color: #f8f8f8;
    }
    .selected:after{
        background-color: #ffba4a;
        border-color: #ffba4a;
        height: 13px;
        width: 13px;
    }
    .filling_line{
        position: absolute;
        z-index: 1;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background-color: #ffba4a;
        transform-origin: left center;
        transition-property: transform;
        transition-duration: 0.3s;
        transition-timing-function: initial;
        transition-delay: initial;
    }

    .filling_line:after{
        display: block;
        height: 100%;
        width: 100%;
        content: "";
        background: white;
        border-radius: 5px;
        position: absolute;
        left: 0;
        top: 0;
        animation: lineshow 1s infinite;
    }

    @keyframes lineshow {
        0%   {width: 0; opacity: .3;}
        100% {width: 100%; opacity: 0.1;}
    }
</style>