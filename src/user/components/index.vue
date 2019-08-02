<template>
    <div class="index">
        <!--小程序名称，不用动-->
        <div class="bg_title">
            <img class="title" src="./../assets/img/bg_01.gif"/>
        </div>
        <!--面板切换-->
        <div class="live-panel">
            <div class="user-msg">
                <span>您当前拥有的投票数为
                    <span style="font-weight: 600; margin: 0 3px">{{keepVotes}}</span>票
                </span>
                <div>
                    <span @click="toScribe" class="get-sp">订阅</span>
                    <span @click="toGift" class="get-sp">送礼</span>
                    <span @click="toSendBarrage" class="get-sp">发弹幕</span>
                </div>
            </div>
            <div class="tabs-panel">
                <a-tabs defaultActiveKey="1" :tabBarStyle="styleObject">
                <a-tab-pane key="1">
                    <span style="font-size: 20px" slot="tab">
                        <span style="margin-right: 10px;">主播Flag</span>
                        <img @click="showRule" style="width: 20px; height: 20px;" src="./../assets/img/q_icon.png">
                    </span>
                    <div v-if="showUnstartPanel" style="color: #f5d090">
                        <div class="non-flag">该主播还没有Flag,<br>敬请期待</div>
                    </div>
                    <div v-if="showLivingPanel" style="color: #f5d090">
                        <div class="panel-main">
                            <div class="flag-content">
                                <span style="font-size: 20px; font-weight: 300">{{lastVote.anchor_name}}说:</span>
                                <span>{{flagConfig.flagContent}}</span>
                            </div>
                            <div>
                                <img @click="showMoreFun" class="other-fun" src="./../assets/img/model_icon.png"/>
                            </div>

                        </div>

                        <div class="vote-container">
                            <div class="time-stamp">
                                <time-stamp :prize-msg="flagConfig.choosedOptions?flagConfig.choosedOptions:[]"
                                            :object-count="objectVoteCount" :support-count="supportVoteCount"></time-stamp>
                            </div>
                            <div class="show-action-time">
                                <p v-if="voteIsStart&&!voteIsEnd">距结束还剩
                                    <span>{{hours}}</span> 时 <span>{{minute}}</span> 分 <span>{{second}}</span> 秒</p>
                                <p v-if="voteIsEnd" style="color:red">投票已经结束，等待主播开奖！！</p>
                            </div>

                        </div>

                        <div class="vote-options">
                            <div class="support-vote">
                                    <span style="color: #f5d090">支持票|&nbsp;{{supportOption}}
                                        &nbsp;({{getSupportCount}}票)</span>
                                <div class="options">
                                    <vote-progress type="support" :value="getSpportPecent"></vote-progress>
                                </div>
                            </div>
                            <div class="object-vote">
                                    <span style="color: #f5d090">反对票|&nbsp;{{objectOption}}
                                        &nbsp;({{getObjectCount}}票)</span>
                                <div class="options">
                                    <vote-progress type="object" :value="getObectPecent"></vote-progress>
                                </div>
                            </div>
                            <div class="bt-container">
                                <div class="o-bt">
                                    <img @click="confirmObjectVote" class="bt-style" src="./../assets/img/object_bt.png"/>
                                </div>
                                <div class="s-bt">
                                    <img @click="confirmSupportVote" class="bt-style" src="./../assets/img/support_bt.png"/>
                                    <img v-if="isShowObject" class="icon-style" src="./../assets/img/obj_icon.png">
                                    <img v-if="isShowSpport" class="icon-style" src="./../assets/img/sup_icon.png">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="showResultPanel" style="color: #f5d090">
                        <div class="none-prize" v-if="prizeList.length==0">
                            <div class="non-span">暂时无人中奖</div>
                        </div>
                        <div v-else class="table-style" style="align-items: center; justify-content: center">
                            <div class="table-list1">
                                <div class="table-title1" style="font-size: 25px"><span>中奖名单</span></div>
                                <div class="table-record">
                                    <div class="record-list" style="font-size: 20px" v-for="item in prizeList" v-bind:key="">
                                        <span class="sp-luck">欧皇</span>{{item.user_name}}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mention-container">
                            <div>正在等待主播开启下一场Flag...</div>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2">
                    <span style="font-size: 20px;" slot="tab">主播记录</span>
                    <div class="table-style">
                        <div class="table-list1">
                            <div class="table-title1"><span>历史记录</span></div>
                            <div class="table-record">
                                <div class="record-list" v-for="item in anchorRecord" v-bind:key="">
                                    {{item.flagContent}}
                                </div>
                            </div>
                        </div>
                        <div class="table-list2">
                            <div class="table-title2"><span>是否成功</span></div>
                            <div class="table-record">
                                <div class="record-list" v-for="item in recordState" v-bind:key="">
                                    <span :class="{fail: item==0}">
                                        {{item==0?'失败':'成功'}}
                                    </span>
                                </div>
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
                <ul class="ul-style">
                    <li class="q-li">Q:&nbsp;如何获取选票</li>
                    <li class="a-li">订阅+1票,发送弹幕、送礼物都有可能随机掉票哦~</li>
                    <li class="q-li">Q: 关于Flag内容右上角小图标</li>
                    <li class="a-li">即主播开启的娱乐模式。<br>
                        有"主播口令"(按主播口令内容发送弹幕前100位送出选票)<br>
                        "最后一分钟加速"(可能刷出66张选票甚至更多票哦~)</li>
                    <li class="q-li">Q: 最后怎么结算？</li>
                    <li class="a-li">活动奖品由主播方解释，并且奖品由主播颁发~</li>
                    <li class="q-li">Q: 关于票的使用</li>
                    <li class="a-li">所有获得的票只能用于本场使用哦~本场过后剩余的票数全部失效！</li>
                </ul>
                <a-button @click="showRule">我已了解</a-button>
            </div>
        </div>

        <toast></toast>
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
                isShowSpport:false,
                isShowObject:false,
                supportOption:'',
                objectOption: '',
                moreFuntions: false,

                /*主播配置项*/
                flagConfig:{},
                voteIsStart: false,
                voteIsEnd: false,
                voteCountDownNum: 0,
                prizeList:[],

                /*用户配置项*/
                keepVotes: 0,  //用户拥有的票
                objectVoteCount: 0, //支持票数量
                supportVoteCount: 0, //反对票数量
                lastVote: {}, //上次投票结果
                thisVote: {}, //这一次投票的内容
                flagId: "",
                flagRecords: [1,2,3,4],
                isScribed: 0,
                anchorRecord: [],
                recordState: []

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
                this.getAnchorHistory();
                this.registerListener();
            });

            hyExt.onLeaveForeground(()=>{
                this.onLoadUserVote();
            });

            this.getUserInfo(); //用户信息授权

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
            },

            getObjectCount() {
                return this.objectVoteCount;
            },

            getSupportCount(){
                return this.supportVoteCount;
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

            getAnchorHistory(){
                util.hy_request({
                    service: 'getHistory',
                    method: 'GET'
                }).then(res =>{
                    if(res.status==200){
                        this.anchorRecord = res.data;
                        this.recordState = res.state;
                    }
                })
            },

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
                        if (res.status === 200 && res.data.length) {

                            var configOptions = JSON.parse(res.data[0]['config_content']);
                            this.lastVote = res.data[0];
                            this.flagConfig = configOptions;
                            this.flagId = this.lastVote.flag_id;
                            this.supportVoteCount = res.data[1].support_count;
                            this.objectVoteCount = res.data[1].object_count;
                            this.supportOption = configOptions.voteContent.support;
                            this.objectOption = configOptions.voteContent.object;

                            //如果未完成的话
                            if(!this.lastVote.success){
                                this.getUserstate();
                            };

                            if(res.hasResult) {
                                //如果正在进行中
                                if(res.data[0].flag_state==0){
                                    this.settingState = CONFIG.settingStateMap.liveInfo;
                                    this.startVoteTimeCountDown();
                                }

                                //如果已完成
                                else if(res.data[0].flag_state==1){
                                    this.prizeList = JSON.parse(this.lastVote.prize_list);
                                    this.settingState = CONFIG.settingStateMap.end;
                                }
                            }
                            else{
                                this.settingState = CONFIG.settingStateMap.unstart;
                            }

                        }
                        else {
                            this.settingState = CONFIG.settingStateMap.unstart;
                        }
                    })
            },

            registerListener() {

                hyExt.observer.on('start_flag', res => {

                    res = JSON.parse(res);

                    this.flagConfig = res;
                    this.flagId = res.flagId;

                    this.supportVoteCount = 0;
                    this.objectVoteCount = 0;

                    //倒计时开始， 用户可以开始设置
                    this.settingState = CONFIG.settingStateMap.liveInfo;
                    this.startVoteTimeCountDown();
                });

                hyExt.observer.on('prize_draw_finish', res => {

                    res = JSON.parse(res);

                    this.settingState = CONFIG.settingStateMap.end;

                });

                hyExt.context.on('subscribeSubmit', isSubscribed => {
                    console.log(isSubscribed);
                    if(isSubscribed==1&&this.isScribed==0){
                        console.log("成功订阅");
                        util.showToast("恭喜您血赚一张票~");
                        this.isScribed=1;
                        this.keepVotes++;
                    }
                    else {
                        util.showToast("不能重复订阅哦~")
                    }
                });

                hyExt.context.on('barrageSubmit', barrageInfo => {
                    console.log(barrageInfo);
                });

                hyExt.context.on('giftSubmit', barrageInfo => {
                    console.log(barrageInfo)
                });
            },


            getUserstate(){
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
                        this.keepVotes = res.data[0].keep_votes;
                        this.isScribed = res.data[0].is_scribed;
                    }
                    else if(res.status==200 && res.data==''){
                        this.keepVotes = 1;
                    }
                    //如果用户在表中没记录 场景：用户第一次打开小程序时且主播正在运行
                    hyExt.context.getSubscribeInfo().then(isScribed => {
                        if(!this.isScribed&&isScribed){
                            this.keepVotes++;
                        }
                    })
                })
            },

            confirmSupportVote() {

                var that = this;

                if(this.voteIsEnd){
                    util.showToast("坐等做主播开奖吧~");
                    return;
                }

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

                if(this.voteIsEnd){
                    util.showToast("坐等做主播开奖吧~");
                    return;
                }

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
                var updateCounts = 0;
                if (this.voteIsStart && !this.voteIsEnd) {

                    this.curTimer = setInterval(() => {
                        if (that.voteCountDownNum - new Date().getTime() > 0) {
                            var curTime = util.SecondToData(that.voteCountDownNum);
                            //实现前台论查询模式，后面优化需要换成websocket，减少性能消耗。
                            if(updateCounts%5==0)
                                this.updateVoteCount();
                            this.initFormate(curTime);
                            this.initFormate(curTime);
                            updateCounts++;
                        }
                        else {
                            that.voteIsEnd = true;
                            clearInterval(curTime);
                        }
                    }, 1000);
                }

                console.log(this.voteCountDownNum);
            },

            updateVoteCount(){
                util.hy_request({
                    service: 'backVoteCount',
                    method: 'GET',
                    param:{
                        flagId: this.flagId
                    }
                }).then(res => {
                    this.supportCount = res.support_count;
                    this.objectCount = res.object_count;
                })
            },

            initFormate(curTime) {
                this.hours = curTime.split(':')[0];
                this.minute = curTime.split(':')[1];
                this.second = curTime.split(':')[2];
            },

            toScribe(){
                hyExt.context.leadSubscribe().then(() => {
                    hyExt.logger.info('发起订阅成功')
                }).catch(err => {
                    util.showToast("您已经订阅过啦~")
                })
            },

            toGift(){
                hyExt.context.leadGift().then(() => {
                    hyExt.logger.info('发起送礼成功')
                }).catch(err => {
                    hyExt.logger.warn('发起送礼失败', err)
                })
            },

            toSendBarrage(){
                hyExt.context.leadBarrage().then(() => {
                    hyExt.logger.info('发起发言成功')
                }).catch(err => {
                    hyExt.logger.warn('发起发言失败', err)
                })
            },

            showRule(){
                this.showRuleToast = !this.showRuleToast;
            },

            onLoadUserVote(){
                if(this.voteIsEnd){
                    return;
                }

                util.hy_request({
                    service: 'saveUserState',
                    method: 'POST',
                    param: {
                        flagId: this.flagId,
                        isScribed: this.isScribed,
                        keepVotes: this.keepVotes,
                    }
                }).then(res => {
                    console.log(res);
                })
            },

            showMoreFun(){
                this.moreFuntions = !this.moreFuntions;
            }
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
            margin: 0 auto;
            font-size: 15px;
            font-weight: 300;
            text-align: center;
        }

        .get-sp{
            margin: 0 5px;
            text-decoration: underline;
        }

        .get-sp:hover{
            color: white;
        }

        .tabs-panel{
        }

    }

    .fail{
        color: #ed6521;
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
        margin: 0 auto;
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

        .other-fun{
            width: 50px;
            height: 50px;
            position: absolute;
            right: 40px;
            top: 63px;
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

    .none-prize{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        font-weight: 300;
        margin-top: 20px;
    }

    .table-style{
        display: flex;
        flex-direction: row;
        width: 100%;

        .table-list1{
            display: flex;
            flex-direction: column;
            width: 56%;
            margin-left: 5%;

            .table-title1{
                width: 90%;
                font-size: 18px;
                font-weight: 300;
                text-align: center;
                margin: 7px 0;
                color: #c9bc97;
            }

            .table-record{
                display: flex;
                flex-direction: column;
                width: 100%;
                margin-top: 10px;

                .record-list{
                    margin: 5px 5px;
                    color: white;
                    width: 90%;
                    word-wrap: break-word;
                    text-align: center;
                }
            }
        }

        .table-list2{
            display: flex;
            flex-direction: column;
            width: 30%;

            .table-title2{
                width: 100%;
                font-size: 18px;
                font-weight: 300;
                text-align: center;
                margin: 7px 0;
                color: #c9bc97;
            }

            .table-record{
                display: flex;
                flex-direction: column;
                height: 100%;
                margin-top: 10px;

                .record-list{
                    display: flex;
                    text-align: center;
                    align-items: center;
                    justify-content: center;
                    color: deepskyblue;
                    height: 100%;

                }
            }
        }
    }

    .sp-luck{
        border: 1px solid #f5d090;
        color: #f0ad4e;
        height: 20px;
        padding: 0 12px;
        margin-right: 10px;
        font-size: 15px;
        border-radius: 10px;

    }

    .mention-container{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: 300;
        margin-top: 20px;
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

        .icon-style{
            position: absolute;
            width: 25px;
            bottom: 32px;
            left: 81%;
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
        bottom: 20px;
        width: 100%;
        display: flex;
        padding: 20px 20px;
        z-index: 999;

        .rule-container{
            display: flex;
            flex-direction: column;
            margin: 0 auto;
            background-color: #f2f2f2;
            border-radius: 12px ;
            width: 90%;
            color: black;

            .rule-title{
                margin: 5px auto;
                font-size: 15px;
            }

            ul{
                list-style: none;
                width: 90%;
                li{
                    padding-left: 0;
                    margin-left: -30px;
                }
                .q-li{
                    font-size: 15px;
                    font-weight: 600;
                    margin: 10px 0 2px -30px;
                }
                .a-li{
                    margin-left: -15px;
                    letter-spacing: 1px;
                    font-weight: 300;
                }
            }

        }

    }
</style>
