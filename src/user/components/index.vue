<template>
    <div class="index">
        <div class="pro-name">
            <h3>立Flag|这里可以放置一张小程序图片</h3>
        </div>
        <div class="panel_main">
            <span class="btn-record">规则</span>
            <div class="flag-title">
                <h1>Flag内容<br>
                    今晚上不到王者不睡觉</h1>
            </div>
            <time-stamp></time-stamp>

            <div class="addcountdown">
                <p v-if="!isStart">活动还未开始哦~</p>
                <p v-if="isStart&&!isEnd">距结束还剩
                    <span>{{day}}</span> 天 <span>{{hours}}</span> 时 <span>{{minute}}</span> 分 <span>{{second}}</span> 秒</p>
                <p v-if="isEnd" style="color:red">活动已结束</p>
            </div>
            <button v-on:click="sendRequest">测试</button>
            <button v-on:click="takeApi">API调用接口</button>
        </div>
        <div class="vote">
            <div class="red" id="red">
                <p>这波我必须支持</p>
                <div class="redhand"></div>
                <div class="redbar" id="red_bar">
                    <span></span>
                    <p id="red_num"></p>
                </div>
            </div>
            <div class="blue" id="blue">
                <p style="text-align:right">看看就好</p>
                <div class="bluehand"></div>
                <div class="bluebar" id="blue_bar">
                    <span></span>
                    <p id="blue_num"></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import TimeStamp from "./timeStamp";
    import util from "./../assets/util";
    export default {
        name: 'index',
        components: {TimeStamp},
        props: {
            //主播端传过来的data
            curdata:{
                type: Array,
                default: null
            }
        },
        data(){
            return {
                isStart: false,
                isEnd: false,
                curTimer: null,
                time:[1553182780135,30,40],
                day: '',
                hours: '',
                minute: '',
                second: ''
            }
        },
        watch:{
            time(){
                if(this.time){
                    clearInterval(this.curTimer);
                    this.initTime();
                }
            },
            curdata(){
                if(this.time){
                    clearInterval(this.curTimer);
                    this.initTime();
                }
            }
        },
        created(){
            if(this.time){
                clearInterval(this.curTimer);
                this.initTime();
            }
        },
        methods:{
            initTime(){

                if (this.time) {
                    if (this.time[0] - new Date().getTime() > 0) {
                        this.isStart = false;
                        this.isEnd = false;
                    } else {
                        this.isStart = true;
                        if (this.time[1] - new Date().getTime() > 0) {
                            this.isEnd = false;
                        } else {
                            this.isEnd = true;
                        }
                    }

                    let that = this;
                    //开始但是还没结束
                    if(this.isStart && !this.isEnd){
                        if(that.time[1] - new Date().getTime() >0){
                            that.curTimer = setInterval(()=>{
                                that.curTime = util.SecondToData(_this.time[0]);
                                that.initFormate(that.curTime);
                                that.initFormate(that.curTime);
                            }, 1000)
                        }
                    } else if (!this.isStart){
                        if(that.time[0] - new Date().getTime() > 0){
                            that.curTimer = setInterval(()=>{
                                that.curTime = util.SecondToData(that.time[0]);
                                that.initFormate(that.curTime);
                            }, 1000)
                        }
                    }
                }
            },

            initFormate(curTime){
                if(curTime.indexOf('天')!=-1){
                    let temp = curTime.split('天');
                    this.day = temp[0];
                    this.hours = temp[1].split(':')[0];
                    this.minute = temp[1].split(':')[1];
                    this.second = temp[1].split(':')[2];
                }else {
                    this.day = '00';
                    this.hours = curTime.split(':')[0];
                    this.minute = curTime.split(':')[0];
                    this.second = curTime.split(':')[0];
                }
            },

            sendRequest:function(){
                console.log("enter");
                util.request('https://www.weixiaoyuan.xyz/api/v1/weibo?start=0&count=10:80',{methods:'GET'})
                    .then(res=>{
                        console.log(res)
                    }).catch(error=>{
                        console.log(error.message+"---"+error.code)
                })
            },
            
            takeApi:function () {
                hyExt.context.getLiveInfo().then(liveInfo => {
                    console.log('liveInfo', liveInfo)
                }).catch(err => {
                    console.log('get liveInfo failed', err)
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .index{
        text-align: center;
        position: fixed;
        top: 50%;
        left: 50%;
        margin-top: -300px;
        margin-left: -214px;
        width: 428px;
        z-index: 999;
    }
    .pro-name{
        position: absolute;
        display: block;
        top: -46px;
        left: 50%;
        margin-left: -163px;
        width: 325px;
        height: 69px;
    }
    .panel_main{
        display: block;
        position: relative;
        margin: 40px auto 20px;
        width: 390px;
    }
    .btn-rule{
        position: absolute;
        top: -25px;
        left: 0;
        color: #666;
    }
    .flag-title{
        margin-top: 80px;
    }
    .btn-record{
        position: absolute;
        top: -25px;
        right: 0;
        padding-right: 10px;
    }
    .addcountdown {
        background-position: center;
        background-size: cover;
        p {
            margin: 0;
            padding: 10px;
            span {
                color: red;
                font-weight: bold;
                font-size: 1.1rem;
            }
        }
    }

    .vote{width:288px; height:300px; margin:40px auto;position:relative}
    .red{position:absolute; left:0; top:64px; height:80px;}
    .blue{position:absolute; right:0; top:64px; height:80px;}
    .red p,.blue p{line-height:22px}
    .redbar{position:absolute; left:42px; margin-top:8px;}
    .bluebar{position:absolute; right:42px; margin-top:8px; }
    .redbar span{display:block; height:6px; background:red; width:100%;border-radius:4px;}
    .bluebar span{display:block; height:6px; background:#09f; width:100%;border-radius:4px; position:absolute; right:0}
    .redbar p{line-height:20px; color:red;}
    .bluebar p{line-height:20px; color:#09f; text-align:right; margin-top:6px}

</style>
