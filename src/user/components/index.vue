<template>
    <div class="index">
        <vue-scroll :ops="ops" style="width: 100%; height: 600px">
            <!--小程序名称，不用动-->
            <div class="bg_title">
                <img class="title" src="./../assets/img/bg_01.gif"/>
            </div>
            <!--面板切换-->
            <div class="live-panel" v-if="showLivingPanel">
                <div class="panel-main">
                    <span class="btn-record">主播记录</span>
                    <div class="flag-content">
                        <span style="font-size: 20px; font-weight: 300">北风那个吹说:</span>
                        <span>今晚不上王者不睡觉</span>
                    </div>
                </div>

                <div class="vote-container">
                    <div class="time-stamp">
                        <time-stamp></time-stamp>
                    </div>
                    <div class="show-action-time">
                        <p v-if="!isStart">活动还未开始哦~</p>
                        <p v-if="isStart&&!isEnd">距结束还剩
                            <span>{{hours}}</span> 时 <span>{{minute}}</span> 分 <span>{{second}}</span> 秒</p>
                        <p v-if="isEnd" style="color:red">投票已经结束，正在统计结果</p>
                    </div>

                </div>

                <div class="vote-options">
                    <a-radio-group size="small" style="width: 100%" v-model="choosedVote">
                        <div class="support-vote">
                            <span style="color: #f5d090">支持票|&nbsp;我觉得可以</span>
                            <div class="options">
                                <a-radio class="s-option" value="1"></a-radio>
                                <vote-progress type="support" :value="getSpportPecent"></vote-progress>
                            </div>
                        </div>
                        <div class="object-vote">
                            <span style="color: #f5d090">反对票|&nbsp;我觉得还不行</span>
                            <div class="options">
                                <a-radio class="o-option" value="2"></a-radio>
                                <vote-progress type="object" :value="getObectPecent"></vote-progress>
                            </div>
                        </div>
                    </a-radio-group>
                    <div class="bt-container">
                        <a-button @click="confirmVote">投票</a-button>
                        <div class="user-vote-msg">
                        <span>您当前拥有<span class="keep-vote">{{keepVotes}}</span>票</span>
                        </div>
                    </div>
                </div>
            </div>

            <!--<div>-->
                <!--<h2>浏览</h2>-->
                <!--<p>{{choosedVote}}</p>-->
            <!--</div>-->
        </vue-scroll>
    </div>
</template>

<script>
    import TimeStamp from "./timeStamp";
    import util from "./../assets/util";
    import CONFIG from "./../assets/config";
    import VoteProgress from "./voteProgress";
    import ARadioGroup from "ant-design-vue/es/radio/Group";

    export default {
        name: 'index',
        components: {ARadioGroup, VoteProgress, TimeStamp},
        props: {
            //主播端传过来的data
            curdata: {
                type: Array,
                default: null
            }
        },
        data() {
            return {
                ops: CONFIG.ops,
                isStart: false,
                isEnd: false,
                curTimer: null,
                time: [1562182780135, 1563876930968, 40],
                day: '',
                hours: '',
                minute: '',
                second: '',
                settingState: CONFIG.settingStateMap.liveInfo,
                userInfo: null,
                choosedVote: 0, //用户选择的票
                keepVotes: 2,  //用户拥有的票
                objectVoteCount: 2, //支持票数量
                supportVoteCount: 3, //反对票数量
                lastVote: {}, //上一次投票的内容
                thisVote: {}, //这一次投票的内容
                flagId: ""

            }
        },
        watch: {
            time() {
                if (this.time) {
                    clearInterval(this.curTimer);
                    this.initTime();
                }
            },
            curdata() {
                if (this.time) {
                    clearInterval(this.curTimer);
                    this.initTime();
                }
            }
        },
        created() {
            hyExt.onLoad(() => {
                this.getLastVoteResult();
                this.registerListener();
            });

            this.getUserInfo(); //用户信息授权
            if (this.time) {
                clearInterval(this.curTimer);
                this.initTime();
            }
        },
        computed: {
            showLivingPanel() {
                return this.settingState == CONFIG.settingStateMap.liveInfo;
            },

            getSpportPecent(){
                var total = this.supportVoteCount + this.objectVoteCount;
                if(!total) return 0;
                var takePecent = this.supportVoteCount/total;
                var intTake = takePecent * 100;
                return intTake;
            },

            getObectPecent(){
                var total = this.supportVoteCount + this.objectVoteCount;
                if(!total) return 0;
                var takePecent = this.objectVoteCount/total;
                var intTake = takePecent * 100;
                return intTake;
            }
        },
        methods: {

            initTime() {

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
                    if (this.isStart && !this.isEnd) {
                        if (that.time[1] - new Date().getTime() > 0) {
                            that.curTimer = setInterval(() => {
                                that.curTime = util.SecondToData(that.time[1]);
                                that.initFormate(that.curTime);
                                that.initFormate(that.curTime);
                            }, 1000)
                        }
                        else {
                            clearInterval(that.curTimer);
                        }
                    } else if (!this.isStart) {

                    }
                }
            },

            initFormate(curTime) {
                this.hours = curTime.split(':')[0];
                this.minute = curTime.split(':')[1];
                this.second = curTime.split(':')[2];
            },

            getUserInfo(){
                hyExt.context.getUserInfo()
                    .then(userInfo => {
                        this.userInfo = userInfo;

                        console.log('用户信息', userInfo);
                    })
            },

            getLastVoteResult(flagId = ""){

                var questParam = "";
                if(flagId){
                    questParam = {
                        service: 'getVoteResult',
                        param: {
                            flagId: flagId
                        }
                    }
                }
                else {
                    questParam = {
                        service: 'getVoteResult',
                    }
                }

                util.hy_request(questParam)
                    .then(res => {
                        if(res.status === 0){
                            if(res.data && res.data.flagId){
                                this.lastVote = res.data.lastVote;
                            }
                            else {
                                console.log("还没有开启过")
                            }
                        }

                        if(!flagId) {
                            console.log("上次比赛的结果未", res);
                        }
                        else {
                            console.log('比赛的结果为', res);
                        }
                    })
            },

            registerListener() {
                hyExt.observer.on('flag_config_info-push', res=>{
                    res = JSON.parse(res);
                    this.settingState = CONFIG.settingStateMap.ready;
                    this.thisVote = res.thisVote;
                    this.flagId = res.flagId;

                    console.log('保存配置推送', 'flag_content_info-push', res, res.flagId);
                });

                hyExt.observer.on('flag_config_ready-push', res=>{

                    res = JSON.parse(res);

                    this.thisVote = res.thisVote;
                    this.flagId = res.flagId;

                    this.supportVoteCount = 0;
                    this.objectVoteCount = 0;

                    //倒计时开始， 用户可以开始设置
                    this.settingState = CONFIG.settingStateMap.countDown;
                    this.startReadyTimeCountDown();
                    console.log('保存配置推送', 'flag_config_info-push', res, res.raceId);
                });

                hyExt.observer.on('speed_race_finish-push', res=>{

                    res = JSON.parse(res);

                    this.getLastVoteResult(this.flagId);
                    this.settingState = CONFIG.settingStateMap.end;


                })
            },

            confirmVote(){

                var that = this;

                if(this.choosedVote==0){
                    util.showToast("请选择你要支持的选票哦~");
                    return;
                }

                if(this.keepVotes <=0){
                    util.showToast("你的票数不够，快去获取选票吧~");
                    return;
                }

                util.hy_request({
                    service: 'addVote',
                    method: 'POST',
                    //上传用户的资料，选票,
                    param: {
                        userInfo: this.userInfo,
                        voteState: this.choosedVote
                    }
                }).then(res=>{
                    if(res.status == 200) {
                        util.showToast("投票成功");
                        if(that.choosedVote == 1){
                            that.supportVoteCount++;
                        }
                        else {
                            that.objectVoteCount++;
                        }
                        that.keepVotes--;
                    }
                    else{
                        util.showToast("投票失败，请重新投票");
                    }
                })

            },



            takeApi(){

            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


    .index {
        color: #f5d090;

        .bg_title {

            width: 100%;
            background-color: #173b32;
            top: 0;

            .title {
                width: auto;
                height: auto;
                max-height: 100%;
                max-width: 100%;
                z-index: 0;
                user-select: none;
            }
        }

        .bg_color {

            display: flex;
            width: 100%;
            background-color: #173b32;
            top: 0;

            .bg {
                width: auto;
                height: auto;
                max-height: 100%;
                max-width: 100%;
                z-index: 0;
                user-select: none;
            }
        }
    }

    .pro-name {
        position: absolute;
        display: block;
        top: -46px;
        left: 50%;
        margin-left: -163px;
        width: 325px;
        height: 69px;
    }

    .live-panel {
        background-image: url("./../assets/img/bg_02.gif");
        width: 100%;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 400px;

        .vote-container{
            display: flex;
            flex-direction: column;
            width: 90%;
            margin: 0 auto;
        }

        .show-action-time{
            margin: 10px auto;
        }
    }

    .panel-main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 10px 20px;

        .flag-content{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            width: 90%;
            font-weight: 600;
            font-size: 28px;
        }

    }

    .vote-options{
        width: 85%;
        margin-left: 40px;

        .options{
            color: #f5d090;
        }

        .s-option{
            position: absolute;
            bottom: 159px;
            left: 20px;
        }

        .o-option{
            position: absolute;
            bottom: 117px;
            left: 20px;
        }
    }

    .btn-rule {
        position: absolute;
        top: -25px;
        left: 0;
        color: #666;
    }

    .bt-container{
        display: flex;
        margin-left: 50px;
        align-items: center;

        .user-vote-msg{
            margin-left: 20px;
        }

        .keep-vote{
            color: #c7d2b0;
            text-decoration: #0a8cd2;
            font-weight: 600;
            padding: 0 10px;
            font-size: 15px;
        }
    }


    .btn-record {
        position: absolute;
        top: 240px;
        right: 0;
        padding-right: 20px;
        color: #abd6c4;
        text-decoration: white;
    }


</style>
