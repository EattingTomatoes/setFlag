<template>
    <div class="index">
        <vue-scroll :ops="ops" style="width: 100%; height: 600px">
            <!--小程序名称，不用动-->
            <div class="bg_title">
                <img class="title" src="./../assets/img/bg_01.gif"/>
            </div>
            <!--面板切换-->
            <div class="live-panel">
                <div class="user-msg">
                    <span>您当前拥有的投票数为{{keepVotes}}票</span>
                </div>
                <div class="tabs-panel">
                    <a-tabs defaultActiveKey="1" :tabBarStyle="styleObject">
                    <a-tab-pane key="1">
                        <span style="font-size: 20px" slot="tab">
                            <span style="margin-right: 10px">主播Flag</span>
                            <img @click="showRule" style="width: 20px; height: 20px;" src="./../assets/img/q_icon.png">
                        </span>
                        <div v-if="showUnstartPanel" style="color: #f5d090">
                            <div v-if="lastVote" class="non-flag">该主播还没有Flag,<br>敬请期待</div>
                            <div v-else>
                                <div class="last-vote">
                                    <table width="350px" height="100px" rules="all">
                                        <tr>
                                            <td align="center" colspan="3">上一期：今晚不上王者不睡觉</td>
                                        </tr>
                                        <tr>
                                            <td align="center" colspan="3">中奖名单</td>
                                        </tr>
                                        <tr>
                                            <td align="center">22</td>
                                            <td align="center" colspan="2">222</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div v-if="showLivingPanel" style="color: #f5d090">
                            <div class="panel-main">
                                <div class="flag-content">
                                    <span style="font-size: 20px; font-weight: 300">{{lastVote.anchor_name}}说:</span>
                                    <span>{{flagConfig.flagContent}}</span>
                                </div>
                            </div>

                            <div class="vote-container">
                                <div class="time-stamp">
                                    <time-stamp :prize-msg="flagConfig.choosedOptions?flagConfig.choosedOptions:[]"></time-stamp>
                                </div>
                                <div class="show-action-time">
                                    <p v-if="voteIsStart&&!voteIsEnd">距结束还剩
                                        <span>{{hours}}</span> 时 <span>{{minute}}</span> 分 <span>{{second}}</span> 秒</p>
                                    <p v-if="voteIsEnd" style="color:red">投票已经结束，等待主播开奖！！</p>
                                </div>

                            </div>

                            <div class="vote-options">
                                <a-radio-group size="small" style="width: 100%" v-model="choosedVote">
                                    <div class="support-vote">
                                        <span style="color: #f5d090">支持票|&nbsp;我觉得可以</span>
                                        <div class="options">
                                            <vote-progress type="support" :value="getSpportPecent"></vote-progress>
                                        </div>
                                    </div>
                                    <div class="object-vote">
                                        <span style="color: #f5d090">反对票|&nbsp;我觉得还不行</span>
                                        <div class="options">
                                            <vote-progress type="object" :value="getObectPecent"></vote-progress>
                                        </div>
                                    </div>
                                </a-radio-group>
                                <div class="bt-container">
                                    <div class="o-bt">
                                        <img @click="confirmObjectVote" class="bt-style" src="./../assets/img/object_bt.png"/>
                                        <span class="o-cha-bt">不支持</span>
                                    </div>
                                    <div class="s-bt">
                                        <img @click="confirmSupportVote" class="bt-style" src="./../assets/img/support_bt.png"/>
                                        <span class="s-cha-bt">支持</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="showResultPanel" style="color: #f5d090">
                            <div class="last-vote">
                                <table width="350px" height="100px" rules="all">
                                    <tr>
                                        <td align="center" colspan="3">中奖名单</td>
                                    </tr>
                                    <tr>
                                        <td align="center">22</td>
                                        <td align="center" colspan="2">222</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2">
                        <span style="font-size: 20px;" slot="tab">主播记录</span>
                        <div>
                            <div class="table-titles">
                                <div class="table-title">
                                    <span>历史Flag</span>
                                    <span>是否成功</span>
                                </div>
                            </div>
                            <div class="table-lists" v-for="item in flagRecords">
                                <div class="table-list">
                                    <span>"这把吃鸡我稳定输出"</span>
                                    <span>失败</span>
                                </div>
                            </div>
                        </div>
                    </a-tab-pane>
                </a-tabs>
                </div>
            </div>

            <div v-if="showRuleToast" class="rule-toast">
                <div class="rule-container">
                    <span class="rule-title">规则说明</span>
                    <ul>
                        <li>Q:&nbsp;如何获取选票</li>
                        <li>A:&nbsp;订阅+1票,发送弹幕、送礼物都有可能随机掉票哦~</li>
                        <li>Q: 主播Flag内容右上角那个是什么？</li>
                        <li>A：主播开启的娱乐模式。有"主播口令"（按主播口令内容发送弹幕前100位送出选票）
                            、"最后一分钟加速"(即倒计时一分钟刷弹幕刷礼物就有可能刷出66张选票哦~)</li>
                        <li>Q: 最后怎么结算？</li>
                        <li>A: 最后由主播对选票方进行抽奖，并且奖品由主播颁发</li>
                        <li>Q: 我有跟好玩的模式/我有问题反馈</li>
                        <li>请戳这里！！</li>
                    </ul>
                    <a-button @click="showRule">我已了解</a-button>
                </div>
            </div>

            <!--<div>-->
            <!--<h2>浏览</h2>-->
            <!--<p>{{choosedVote}}</p>-->
            <!--</div>-->
            <toast></toast>
        </vue-scroll>
    </div>
</template>

<script>
    import TimeStamp from "./timeStamp";
    import util from "./../assets/util";
    import CONFIG from "./../assets/config";
    import VoteProgress from "./voteProgress";
    import ARadioGroup from "ant-design-vue/es/radio/Group";
    import Toast from "../../user/components/toast";

    export default {
        name: 'index',
        components: {Toast, ARadioGroup, VoteProgress, TimeStamp},
        props: {
            //主播端传过来的data
            curdata: {
                type: Array,
                default: null
            }
        },
        data() {
            return {
                styleObject:CONFIG.tabs,
                ops: CONFIG.ops,
                isStart: false,
                isEnd: false,
                curTimer: null,
                time: [],
                day: '',
                hours: '',
                minute: '',
                second: '',
                settingState: CONFIG.settingStateMap.liveInfo,
                showRuleToast: false,
                userInfo: null,

                /*主播配置项*/
                flagConfig:{},
                voteIsStart: false,
                voteIsEnd: false,
                voteCountDownNum: 0,

                /*用户配置项*/
                choosedVote: 0, //用户选择的票
                keepVotes: 2,  //用户拥有的票
                objectVoteCount: 2, //支持票数量
                supportVoteCount: 3, //反对票数量
                lastVote: {}, //上次投票结果
                thisVote: {}, //这一次投票的内容
                flagId: "",
                flagRecords: [1,2,3,4],
                isScribed: 0

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
                // this.getAnchorHistory();
                this.registerListener();
                this.getUserInfo(); //用户信息授权
            });

        },
        computed: {
            showUnstartPanel() {
                return this.settingState == CONFIG.settingStateMap.unstart;
            },

            showLivingPanel() {
                return this.settingState == CONFIG.settingStateMap.liveInfo;
            },

            showResultPanel() {
                return this.settingState == CONFIG.settingStateMap.end;
            },

            getSpportPecent() {
                var total = this.supportVoteCount + this.objectVoteCount;
                if (!total) return 0;
                var takePecent = this.supportVoteCount / total;
                var intTake = takePecent * 100;
                return intTake;
            },

            getObectPecent() {
                var total = this.supportVoteCount + this.objectVoteCount;
                if (!total) return 0;
                var takePecent = this.objectVoteCount / total;
                var intTake = takePecent * 100;
                return intTake;
            }
        },
        methods: {

            getUserInfo() {
                hyExt.context.getUserInfo()
                    .then(userInfo => {
                        this.userInfo = userInfo;
                        console.log('用户信息', userInfo);
                    });
            },

            // getAnchorHistory(){
            //     util.hy_request({
            //         service: 'getHistory',
            //         method: 'GET'
            //     }).then(res =>{
            //         if(res.status==200){
            //             this.flagRecords = res.data;
            //         }
            //     })
            // },

            getLastVoteResult(flagId = "") {
                var questParam = {};
                if (flagId) {
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
                        if (res.status === 200 && res.data) {

                            var configOptions = JSON.parse(res.data[0]['config_content']);
                            this.lastVote = res.data[0];
                            this.flagConfig = configOptions;
                            this.flagId = this.lastVote.flag_id;

                            //如果未完成的话
                            if(this.lastVote.success){
                                //发起网络请求时去服务器端找数据缓存
                                util.hy_request({
                                    service: 'getUserMsg',
                                    method:'GET',
                                    param:{
                                        flagId: this.flagId
                                    }
                                }).then(res=>{
                                    //如果用户已经在表中有记录  场景：用户重新打开小程序时主播正在运行
                                    if(res.status==200 && res.data){
                                        console.log(this.flagId)
                                        this.keepVotes = res.data[0].keepVotes;
                                        this.isScribed = res.isScribed;
                                    }
                                    //如果用户在表中没记录 场景：用户第一次打开小程序时且主播正在运行
                                    this.getUserstate();
                                })
                            };

                            if(res.hasResult) {
                                if(res.data[0].flag_state==0){
                                    this.settingState = CONFIG.settingStateMap.liveInfo;
                                    this.startVoteTimeCountDown();
                                }

                                else if(res.data[0].flag_state==1){
                                    this.settingState = CONFIG.settingStateMap.end;
                                }
                            }
                            else{
                                this.settingState = CONFIG.settingStateMap.unstart;
                            }

                        }
                    })
            },

            registerListener() {
                hyExt.observer.on('flag_config_info-push', res => {
                    res = JSON.parse(res);
                    this.settingState = CONFIG.settingStateMap.ready;
                    this.thisVote = res.thisVote;
                    this.flagId = res.flagId;

                    console.log('保存配置推送', 'flag_content_info-push', res, res.flagId);
                });

                hyExt.observer.on('flag_config_ready-push', res => {

                    res = JSON.parse(res);

                    this.thisVote = res.thisVote;
                    this.flagId = res.flagId;

                    this.supportVoteCount = 0;
                    this.objectVoteCount = 0;

                    //倒计时开始， 用户可以开始设置
                    this.settingState = CONFIG.settingStateMap.countDown;
                    this.startVoteTimeCountDown();
                    console.log('保存配置推送', 'flag_config_info-push', res, res.raceId);
                });

                hyExt.observer.on('speed_race_finish-push', res => {

                    res = JSON.parse(res);

                    this.getLastVoteResult(this.flagId);
                    this.settingState = CONFIG.settingStateMap.end;

                });

                hyExt.context.on('subscribeSubmit', isSubscribed => {
                    if(isSubscribed==true){
                        console.log("111")
                    }
                });

                hyExt.context.on('barrageSubmit', barrageInfo => {

                });

                hyExt.context.on('giftSubmit', barrageInfo => {

                });
            },

            getUserstate(){
                hyExt.context.getSubscribeInfo().then(isScribed => {
                    if(!this.isScribed&&isScribed){
                        this.keepVotes++;
                    }
                })
            },

            confirmSupportVote() {

                var that = this;

                if (this.keepVotes <= 0) {
                    util.showToast("你的票数不够，快去获取选票吧~");
                    return;
                }

                util.hy_request({
                    service: 'addVote',
                    method: 'POST',
                    //上传用户的资料，选票,
                    param: {
                        flagId: this.flagId,
                        userNick: this.userInfo.userNick,
                        voteState: 1
                    }
                }).then(res => {
                    if (res.status == 200) {
                        util.showToast("投票成功");
                        that.supportVoteCount++;
                        that.keepVotes--;
                    }
                    else {
                        util.showToast("投票失败，请重新投票");
                    }
                })
            },

            confirmObjectVote(){
                var that = this;

                if (this.keepVotes <= 0) {
                    util.showToast("你的票数不够，快去获取选票吧~");
                    return;
                }

                util.hy_request({
                    service: 'addVote',
                    method: 'POST',
                    //上传用户的资料，选票,
                    param: {
                        flagId: this.flagId,
                        userNick: this.userInfo.userNick,
                        voteState: 2
                    }
                }).then(res => {
                    if (res.status == 200) {
                        util.showToast("投票成功");
                        that.objectVoteCount++;
                        that.keepVotes--;
                    }
                    else {
                        util.showToast("投票失败，请重新投票");
                    }
                })
            },

            startVoteTimeCountDown() {
                this.voteIsStart = true;
                this.voteCountDownNum = this.flagConfig.acheiveTime;
                var that = this;
                if (this.voteIsStart && !this.voteIsEnd) {

                    this.curTimer = setInterval(() => {
                        if (that.voteCountDownNum - new Date().getTime() > 0) {
                            var curTime = util.SecondToData(that.voteCountDownNum);
                            this.initFormate(curTime);
                            this.initFormate(curTime);
                        }
                        else {
                            that.voteIsEnd = true;
                            clearInterval(curTime);
                        }
                    }, 1000);
                }

                console.log(this.voteCountDownNum);
            },

            initFormate(curTime) {
                this.hours = curTime.split(':')[0];
                this.minute = curTime.split(':')[1];
                this.second = curTime.split(':')[2];
            },

            showRule(){
                this.showRuleToast = !this.showRuleToast;
            },
        },
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

        .user-msg{
            display: flex;
            flex-direction: column;
            margin: 15px auto 5px auto;
            font-size: 15px;
            font-weight: 300;
            text-align: center;
        }

        .tabs-panel{
        }

    }

    .vote-container {
        display: flex;
        flex-direction: column;
        width: 90%;
        margin: 0 auto;

        .time-stamp{
            width: 90%;
            margin-left: 15px;
        }
    }

    .show-action-time {
        margin: 10px auto;
    }

    .panel-main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-top: 10px;

        .flag-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            width: 90%;
            font-weight: 600;
            font-size: 32px;

        }

    }

    .vote-options {
        margin: 0 0 30px 65px;
        width: 75%;

        .support-vote{
            display: flex;
            flex-direction: column;
        }

        .object-vote{
            display: flex;
            flex-direction: column;
        }

        .options {
            color: #f5d090;
        }

        .s-option {
            position: absolute;
            bottom: 113px;
            left: 45px;
        }

        .o-option {
            position: absolute;
            bottom: 68px;
            left: 45px;
        }
    }

    .table-titles{

        display: flex;

        .table-title{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            margin: 0 auto;
            width: 95%;
            height: 50px;
            color: white;
            font-size: 18px;
        }

    }

    .table-lists{
        display: flex;
        flex-direction: column;
        /*padding: 10px 10px;*/

        .table-list{
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;
            margin: 0 auto;
            width: 90%;
            height: 50px;
            border: 1px solid red;
            color: white;
        }
    }

    .non-flag {
        margin: 30px 20px 10px 20px;
        text-align: center;
        font-size: 30px;
        font-weight: 300;
    }

    .last-vote {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .btn-rule {
        position: absolute;
        top: -25px;
        left: 0;
        color: #666;
    }

    .bt-container {
        display: flex;
        margin-left: 20px;
        align-items: center;
        padding-bottom: 30px;

        .s-bt{
            position: absolute;
            bottom: -15px;
            left: 73px;
        }

        .o-bt {
            position: absolute;
            bottom: -15px;
            right: 75px;
        }

        .bt-style{
            width: 120px;
        }

        .s-cha-bt{
            position: absolute;
            bottom: 33px;
            left: 40px;
            color: white;
            font-size: 15px;
            font-weight: 400;
        }

        .o-cha-bt{
            position: absolute;
            bottom: 33px;
            left: 40px;
            color: white;
            font-size: 15px;
            font-weight: 400;
        }

        .user-vote-msg {
            margin-left: 20px;
        }

        .keep-vote {
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

    .rule-toast{
        position: absolute;
        top: 250px;
        width: 100%;
        height: 220px;
        display: flex;
        padding: 20px 20px;
        z-index: 999;

        .rule-container{
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            background-color: #93a3a0;
            border-radius: 12px ;
            border: 1px solid #cccccc;
            width: 90%;
            color: #f5d090;

            .rule-title{
                margin: 5px auto;
                font-size: 15px;
            }

        }

    }
</style>
