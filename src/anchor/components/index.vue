<template>
    <div id="index">
        <div class="bg_title">
            <img class="title" src="./../assets/img/bg_01.gif"/>
        </div>
        <div v-if="showUnstartPanel" class="bg-panel form-data">
            <a-tabs defaultActiveKey="1" :tabBarStyle="styleObject">
                <a-tab-pane key="1">
                    <span slot="tab">
                        主播设置
                        <img style="width: 20px; height: 20px;" src="./../assets/img/q_icon.png">
                    </span>
                    <div style="color: #f5d090">
                        <div>
                            <div class="flag-content">
                                <label>Flag内容</label>
                                <div class="content">
                                    <a-input type="text" style="padding-left: 10px; width: 160px" size="small"
                                             v-model="content" maxlength="15"></a-input>
                                </div>
                                <!--<input type="text" v-model="content" class="form-control"/>-->
                            </div>

                            <div class="time-wrapper">
                                <label style="width: 72px">投票时长</label>
                                <div class="wrapper">
                                    <a-icon type="minus" class="time-icon" @click="reducelimitedTime"></a-icon>
                                    <p class="time">
                                        {{limitedTime}}小时
                                    </p>
                                    <a-icon type="plus" class="time-icon" @click="addlimitedTime"/>
                                </div>
                            </div>

                            <div class="vote-options">
                                <div class="vote-title">
                                    <label style="width:68px">投票选项</label>
                                </div>
                                <div v-if="isSettingSelf='default'" class="vote-option">
                                    <div class="option-content">
                                        <div>
                                            <a-input type="text" class="option-support" addonBefore="支持票"
                                                     v-model="supportOption" size="small" maxlength="15"/>
                                        </div>
                                        <div>
                                            <a-input type="text" class="option-object" addonBefore="反对票"
                                                     v-model="objectOption" size="small" maxlength="15"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="prize-container">
                            <label>奖金进度</label>
                            <div class="options-setting">
                                <ul>
                                    <li class="bd-callout bd-callout-warning" v-for="(option, index) in prizes"
                                        v-bind:key="option.id">
                                        <div style="display:flex; margin: auto" @click="prizes.splice(index,1)">
                                            <a-icon type="minus" class="option-icon"></a-icon>
                                        </div>
                                        <div class="option-container">
                                            投票数达到<span>{{option.votesCount}}</span>票时,
                                            送出<span>{{option.prizeType}}</span>
                                            共<span>{{option.prizeCount}}</span>份
                                        </div>
                                    </li>
                                </ul>
                                <div @click="showAddOptionsDialog" class="add-btn">+添加选项</div>
                            </div>
                        </div>

                        <div class="other-options">
                            <div>
                                <label>其他选项(可选)</label>
                            </div>

                            <div class="form-check">
                                <input v-model="mode" type="checkbox" value="1"/>开启"最后十分钟"加速模式.
                            </div>
                            <div class="mode1-style" v-if="mode.find(item => item=='1')">
                                <label class="mode1-cha-style">*开启之后在投票结束前十分钟用户可爆出多张票</label>
                            </div>
                            <div class="form-check">
                                <input v-model="mode" type="checkbox" value="2">开启主播口令模式.
                            </div>

                            <div class="order-content-style" v-if="mode.find(item => item=='2')">
                                <label>主播口令</label>
                                <label class="mode2-cha-style">*隔一段时间出现一次,输入与口令相同的弹幕即可获得投票</label>
                                <ul>
                                    <div>
                                        <li class="commands-style" v-for="(item, index) in command" :key="index">
                                            <a-input class="command-style" :addonBefore=index+1 v-model="command[index]" ></a-input>
                                            <div class="command-delete">
                                                <span @click="deleteCommand(index)">删除</span>
                                            </div>
                                        </li>
                                    </div>
                                </ul>
                                <div class="options-setting">
                                    <div @click="addCommand" class="add-btn">+添加口令</div>
                                </div>
                            </div>
                        </div>


                    </div>
                    <!--<div><a-button @click="testApi">测试</a-button></div>-->
                    <div class="btn_wrapper">
                        <div class="save">
                            <a-button size="large" @click="saveSettingConfig">保存</a-button>
                        </div>
                        <div class="start">
                            <a-button size="large" @click="startAction">启动</a-button>
                        </div>
                    </div>

                    <div>
                        <div v-for="item in command">
                            <p>{{item}}</p>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2">
                    <span slot="tab">主播记录</span>
                    <div class="table-style">
                        <div class="table-list1">
                            <div class="table-title1"><span>历史记录</span></div>
                            <div class="table-record">
                                <div class="record-list" v-for="item in anchorRecord" v-bind:key="">
                                    {{item.content}}
                                </div>
                            </div>
                        </div>
                        <div class="table-list2">
                            <div class="table-title2"><span>是否成功</span></div>
                            <div class="table-record">
                                <div class="record-list" v-for="item in anchorRecord" v-bind:key="">
                                        <span :class="{fail: item.finish_state==2}">
                                            {{item.finish_state==2?'失败':'成功'}}
                                        </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>


        </div>

        <div v-if="showCountingDownPanel" class="bg-panel count_down_panel">
            <div class="ready_content" v-if="isReadyCountDown">
                <p class="tip_ready">即将开始</p>
                <p class="count_ready" v-if="readyCountDownNum > 0">{{readyCountDownNum}}</p>
            </div>
        </div>

        <div v-if="showLiveInfoPanel" class="bg-panel live_info_panel">
            <div class="live_info_show">
                <p v-if="voteIsStart&&!voteIsEnd">距投票还剩
                    <span>{{time.hours}}</span> 时 <span>{{time.minute}}</span> 分 <span>{{time.second}}</span> 秒</p>
                <p v-if="voteIsEnd" style="color:red">投票已结束</p>
                <div class="vote-style">
                    <div class="support-container">
                        <div class="support-sp">支持票</div>
                        <div class="support-count">{{getSpportVoteCount}}</div>
                    </div>
                    <div class="object-container">
                        <div class="object-sp">反对票</div>
                        <div class="object-count">{{getObjectVoteCount}}</div>
                    </div>
                </div>
                <div v-if="voteIsEnd">
                    <a-button @click="submitResult1">Flag成功</a-button>
                    <a-button @click="submitResult2">Flag失败</a-button>
                </div>
            </div>
        </div>

        <div v-if="showResultPanel" class="bg-panel result_panel">
            <div class="panel-main">
                <div class="flag-content">
                    <span class="win-style">参与Flag:"{{content}}"的中奖名单为:</span>
                </div>
                <div class="prize-header">
                    <span>中奖用户ID</span>
                    <span>中奖用户名称</span>
                </div>
                <div class="prize-list" v-for="winMsg in winList">
                    <span>{{winMsg.uid}}</span>
                    <span>{{winMsg.user_nick}}</span>
                </div>
                <div v-if="showNonePrize" class="no-prize">
                    <span>本次投票未达到目标,</span>
                    <span>下次设置少点票数,</span>
                    <span>说不定人气更旺哦~</span>
                </div>
                <div class="config-bt">
                    <a-button @click="configNextFlag">配置下一个FLag</a-button>
                </div>
            </div>
        </div>

        <add-options-dialog
                :choosedOptionList="prizes">
        </add-options-dialog>
        <toast></toast>

    </div>

</template>

<script>
    import CONFIG from "./../assets/config";
    import util from "./../assets/util"
    import eventBus from "../assets/eventBus"
    import AddOptionsDialog from "./addOptionsDialog";
    import VoteProgress from "./voteProgress";
    import Toast from "./toast";

    export default {
        name: 'Index',
        components: {Toast, AddOptionsDialog, VoteProgress},
        props: {
            msg: String
        },
        data() {
            return {
                //程序中的变量项
                flagId: -1,
                nextOptionsId: 2,
                settingState: CONFIG.settingStateMap.unstart,
                voteCountDownNum: 0,
                readyCountDownNum: 0,
                isReadyCountDown: true,
                voteIsStart: false,
                voteIsEnd: false,
                curTimer: null,
                time: {hours: '', minute: '', second: ''},
                styleObject: CONFIG.tabs,
                showNone: 0,
                saveAllOptions: false,
                supportCount:0,
                objectCount: 0,
                anchorRecord:[],
                recordState:[],
                voteState: 0,
                ws:null,
                wsMsg:null,

                //提交主播配置项
                anchorNick:'',
                anchorUrl:'',
                supportOption: CONFIG.voteContent.support,
                objectOption: CONFIG.voteContent.object,
                limitedTime: 0.1,
                achevieTime: 0,
                content: '',
                choosedOptions: [],
                mode: [],
                command: [],
                ele:0,
                prizes: [],
                winList:[],
                allConfig:null,
            }
        },
        created() {
            hyExt.onLoad(() => {
                this.getAnchorMsg();
                this.getLastVoteResult();
                this.registerResultListener();
                this.getAnchorHistory();
                eventBus.$on('saveOption', ({votesCount, prizeType, prizeCount}) => {
                    var length = this.prizes.length;

                    this.prizes.push({
                        optionId: this.nextOptionsId++,
                        votesCount: votesCount,
                        prizeType: prizeType,
                        prizeCount: prizeCount,
                    });

                })
            });
        },
        computed: {
            showUnstartPanel() {
                return this.settingState == CONFIG.settingStateMap.unstart;
            },
            showCountingDownPanel() {
                return this.settingState == CONFIG.settingStateMap.countDown;
            },
            showLiveInfoPanel() {
                return this.settingState == CONFIG.settingStateMap.liveInfo;
            },
            showResultPanel() {
                return this.settingState == CONFIG.settingStateMap.end;
            },
            showNonePrize(){
                return this.showNone;
            },

            getSpportVoteCount(){
                return this.supportCount;
            },

            getObjectVoteCount(){
                return this.objectCount;
            },

            getSpportPecent() {
                var total = this.supportCount + this.objectCount;
                if (!total) return 0;
                var takePecent = this.supportCount / total;
                var intTake = takePecent * 100;
                return intTake;
            },

            getObectPecent() {
                var total = this.supportCount + this.objectCount;
                if (!total) return 0;
                var takePecent = this.objectCount / total;
                var intTake = takePecent * 100;
                return intTake;
            },


        },

        methods: {

            getLastVoteResult(flagId = "") {
                var questParam = {};
                if (flagId) {
                    questParam = {
                        service: 'getConfig',
                        param: {
                            flagId: flagId
                        }
                    }
                }
                else {
                    questParam = {
                        service: 'getConfig',
                    }
                }

                util.hy_request(questParam)
                    .then(res => {
                        if (res.status === 200 && res.data) {
                            this.content = res.data.content;
                            this.limitedTime = res.data.limited_time;
                            this.achieveTime = res.data.achieve_time;
                            this.supportOption = res.data.support_option;
                            this.objectOption = res.data.object_option;
                            this.prizes = JSON.parse(res.data.prizes);
                            this.mode = JSON.parse(res.data.mode);
                            this.command = JSON.parse(res.data.command);
                            this.flagId = res.data.id;


                            if(res.data.config_state){
                                this.supportCount = res.data.flag_vote.support_count;
                                this.objectCount = res.data.flag_vote.object_count;
                                this.voteState = res.data.flag_vote.vote_state;
                                this.winList = res.data.flag_vote.win_list;
                                if(!res.data.finish_state){
                                    this.settingState = CONFIG.settingStateMap.liveInfo;
                                    this.startVoteTimeCountDown();
                                }
                                else {
                                    this.settingState = CONFIG.settingStateMap.end;
                                }
                            }

                        }
                    })
            },

            getAnchorHistory(){
                util.hy_request({
                    service: 'getHistory',
                    method: 'GET'
                }).then(res =>{
                    if(res.status==200){
                        this.anchorRecord = res.history;
                    }
                })
            },


            //注册结果的一个监听按钮。有消息源就触发
            registerResultListener() {
                var self = this;
                hyExt.observer.on('get_vote_count',res => {
                    res = JSON.parse(res);
                    this.supportCount = res.support_count;
                    this.objectCount = res.object_count;
                });
            },

            reducelimitedTime() {
                if (this.limitedTime <= CONFIG.minSettingActionTime) {
                    return;
                }
                this.limitedTime -= 0.5;
            },

            addlimitedTime() {
                if (this.limitedTime >= CONFIG.maxSettingActionTime) {
                    return;
                }
                this.limitedTime += 0.5;
            },

            addCommand() {
                if(this.ele>=5){
                    util.showToast("最多只能添加5条口令");
                    return;
                }
                this.ele++;
                this.command.push('');
            },
//删除一项
            deleteCommand(index) {
                this.command.splice(index,1);
            },

            showAddOptionsDialog() {
                if (this.choosedOptions.length >= 5) {
                    util.showToast('只能设置五个哦');
                    return;
                }
                eventBus.$emit('showDialog');
            },

            saveSettingConfig: function () {

                this.prizes = this.prizes.map(item => {
                    return {
                        votesCount: util.xssFilter(item.votesCount),
                        prizeType: util.xssFilter(item.prizeType),
                        prizeCount: item.prizeCount
                    }
                });

                this.achieveTime = new Date().getTime() + this.limitedTime * 3600 * 1000;

                var submitValue = {
                    content: util.xssFilter(this.content),
                    limitedTime: this.limitedTime,
                    achieveTime: this.achieveTime,
                    supportOption: this.supportOption,
                    objectOption: this.objectOption,
                    prizes: this.prizes, // 奖品选项
                    mode: this.mode, // 其它配置
                    command: this.command,
                };

                this.allConfig = submitValue;

                var that = this;
                util.hy_request({
                    service: 'saveConfig',
                    method: 'POST',
                    param: {
                        content: util.xssFilter(this.content),
                        limitedTime: this.limitedTime,
                        achieveTime: this.achieveTime,
                        supportOption: this.supportOption,
                        objectOption: this.objectOption,
                        prizes: JSON.stringify(this.prizes), // 奖品选项
                        mode: JSON.stringify(this.mode), // 其它配置
                        command: JSON.stringify(this.command),
                    }
                }).then(res => {
                    if (res.status == 200) {
                        this.saveAllOptions = true;
                        this.flagId = res.data;
                        util.showToast('已成功保存');
                    } else {
                        util.showToast(res.msg);
                    }
                });
            },


            startAction() {

                if(!this.saveAllOptions){
                    util.showToast('请先保存设置~');
                    return;
                }

                if (!(this.content && this.limitedTime && this.prizes.length
                    && this.supportOption && this.objectOption)) {
                    util.showToast('请填写完整配置哈~');
                    this.saveAllOptions = false;
                    return;
                }

                if (this.mode.find(item => item == 2)) {
                    if(this.command.find(com => com=='')){
                        util.showToast('请填写主播口令~');
                        this.saveAllOptions = false;
                        return;
                    }
                }

                console.log(this.userAvatar);
                console.log(this.userNick);

                util.hy_request({
                    service: 'startFlag',
                    method: 'POST',
                    param: {
                        flagId: this.flagId,
                        anchorNick: this.userNick,
                        anchorUrl: this.userAvatar
                    }
                }).then(res => {
                    if (res.status === 200) {
                        hyExt.observer.emit('start_flag',JSON.stringify(this.flagId));
                        this.startReadyTimeCountDown();
                    }
                    else {
                        util.showToast(res.msg);
                    }
                })

            },


            startReadyTimeCountDown() {
                this.readyCountDownNum = 3;
                this.isReadyCountDown = true;
                this.settingState = CONFIG.settingStateMap.countDown;

                var timer = setInterval(() => {
                    if (this.readyCountDownNum <= 0) {
                        this.settingState = CONFIG.settingStateMap.liveInfo;
                        this.startVoteTimeCountDown(this.raceTime);
                        this.isReadyCountDown = false;
                        clearInterval(timer);
                    }

                    this.readyCountDownNum--;
                }, 1000)
            },

            startVoteTimeCountDown() {
                this.voteIsStart = true;
                this.voteIsEnd = false;
                this.voteCountDownNum = this.achieveTime;
                var that = this;
                var updateCounts= 0;
                var sendCount = 1;
                if (this.voteIsStart && !this.voteIsEnd) {
                    this.curTimer = setInterval(() => {
                        if (that.voteCountDownNum - new Date().getTime() > 0) {
                            var curTime = util.SecondToData(that.voteCountDownNum);
                            this.initFormate(curTime);
                            updateCounts++;
                            sendCount++;
                        }
                        else {
                            that.voteIsEnd = true;
                            clearInterval(this.curTimer);
                        }
                    }, 1000);
                }
            },

            getAllVoteCount(){
                util.hy_request({
                    service: 'getAllCount',
                    method: 'GET',
                    param:{
                        flagId: this.flagId
                    }
                }).then(res => {
                    this.supportCount = res.support_count;
                    this.objectCount = res.object_count;
                    var all = {
                        supportCount: this.supportCount,
                        objectCount: this.objectCount
                    };
                })
            },

            initFormate(curTime) {
                this.time.hours = curTime.split(':')[0];
                this.time.minute = curTime.split(':')[1];
                this.time.second = curTime.split(':')[2];
            },

            getAnchorMsg() {
                hyExt.context.getStreamerInfo().then(streamerInfo => {
                    this.anchorNick = streamerInfo.streamerNick;
                    this.anchorUrl = streamerInfo.streamerAvatarUrl
                }).catch(err => {
                    hyExt.logger.warn('获取主播信息失败', err)
                })
            },

            getAnchorMsgAgain() {
                var that = this;
                hyExt.context.getUserInfo().then(userInfo => {
                    that.userNick = userInfo.userNick;
                    that.userAvatar = userInfo.userAvatarUrl;
                }).catch(err => {
                    hyExt.logger.warn('获取用户信息失败');
                });
            },

            submitResult1() {
                util.hy_request({
                    service: 'prizeDraw',
                    param: {
                        success: 1,
                        flagId: this.flagId
                    }

                }).then(res => {
                    if (res.status == 200) {
                        this.winList = res.data;
                        if(!res.data){
                            this.showNone = 1
                        }
                        hyExt.observer.emit('prize_draw_finish',JSON.stringify(res.data));
                        this.settingState = CONFIG.settingStateMap.end;
                    }
                })

            },

            submitResult2() {
                util.hy_request({
                    service: 'prizeDraw',
                    param: {
                        success: 2,
                        flagId: this.flagId
                    }

                }).then(res => {
                    if (res.status == 200) {
                        this.winList = res.data;
                        if(!res.data){
                            this.showNone = 1
                        }
                        hyExt.observer.emit('prize_draw_finish',JSON.stringify(res.data));
                        this.settingState = CONFIG.settingStateMap.end;
                    }
                })
            },

            configNextFlag() {
                this.settingState = CONFIG.settingStateMap.unstart;
                Object.assign(this.$data, this.$options.data());
                this.getAnchorMsgAgain();
                this.getAnchorHistory();
            }

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

    @import '../assets/scss/partial/_base';
    @import "../assets/scss/partial/_reset";
    @import '../assets/scss/common';

    #index {
        display: flex;
        flex-direction: column;
        background-color: #173b32;

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
    }

    .bg-panel {
        background-image: url("./../assets/img/bg_02.gif");
        width: 100%;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 400px;
        padding: 20px 0;
        padding-right: 5px;
    }

    .form-data {
        /*margin: 5px 0 0 12px;*/
        /*max-width: 300px;*/
        /*border-radius: 5px;*/
        /*padding: 12px 10px;*/
        /*background-color: rgba(255, 255, 255, 0.4);*/
        /*margin-bottom: 20px;*/
        display: flex;
        flex-direction: column;
        padding: 20px auto;
        color: #f5d090;

        .set-panel {
            width: 100%;
            color: #f5d090;
        }
    }

    label {
        font-size: 15px;
        margin: 0 0 0 10px;
        width: 25%;
    }

    .flag-content {
        display: flex;
        flex-direction: row;
        align-items: center;
        vertical-align: middle;
        .content {
            width: 73%;
        }
    }

    .time-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        vertical-align: middle;
        margin-top: 20px;

        .time {
            padding: 2px 7px;
            margin: 0 5px;
            border-left: 1px solid #cccccc;
            border-right: 1px solid #cccccc;
            letter-spacing: 1px;
            height: 25px;
        }

        .wrapper {
            display: flex;
            flex-direction: row;
            background-color: white;
            border-radius: 5px;
            padding: 0 10px;
            height: 25px;
            align-items: center;
            vertical-align: middle;
            color: black;

            .time-icon {
                font-size: 18px;
                color: #747575;
            }
        }

    }

    .vote-options {

        display: flex;
        flex-direction: row;
        margin-top: 20px;

        img {
            width: 20px;
            height: 20px;
        }

        .vote-title {
            display: flex;
            flex-direction: row;
            vertical-align: middle;
            align-content: center;
            justify-items: center;

            img {
                margin: auto 10px;
            }
        }

        .option-content {
            display: flex;
            flex-direction: column;
            width: 100%;

            div {
                margin-bottom: 10px;
                width: 180px;
                font-size:15px;
            }

        }

    }

    .prize-container {
        display: flex;
        flex-direction: column;
        font-size: 14px;
    }

    .add-btn {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: #90cade;
        padding: 6px;
        width: 95%;
    }

    .options-setting {

        margin: 0 0 10px 10px;
        color: black;

        .bd-callout {
            padding: 2px 5px 2px 5px;
            margin-top: 3px;
            margin-bottom: 8px;
            border: 1px solid #eee;
            border-left-width: .25rem;
            border-radius: .25rem;
            font-size: 14px;
            list-style-type: none;
            display: flex;
            flex-direction: row;
            align-items: center;
            vertical-align: middle;
            letter-spacing: 1px;
            width: 95%;
            color: black;
            background-color: #f7f7f7;
            border-left-color: #f0ad4e;
            word-wrap: break-word;
            word-break: break-all;

            .option-icon {
                font-size: 20px;
                padding-right: 8px;
                margin-right: 8px;
                border-right: 1px solid #cccccc;
                color: #747575;
            }

            .option-container {
                display: block;
                span {
                    color: black;
                    font-weight: 600;
                    font-size: 13px;
                    white-space: nowrap;
                }
            }
        }
    }

    .other-options {
        margin-top: 10px;
        .form-check {
            position: relative;
            display: block;
            color: white;
            padding-left: 10px;
            margin-top: 7px;
        }
        .checkbox-style {
            color: white;
        }

        .mode1-style{
            color: rgb(240, 181, 9);
            display: flex;
            width: 280px;

            .mode1-cha-style{
                width: 100%;
                font-size: 12px;
            }
        }

        .order-content-style {

            display: flex;
            flex-direction: column;
            margin-top: 15px;

            .mode2-cha-style{
                font-size: 12px;
                width: 90%;
                color: rgb(240, 181, 9);
            }

            .order-input {
                margin-top: 10px;
                margin-left: 10px;
                width: 90%;
            }

            .commands-style{
                display: flex;
                flex-direction: row;
                margin: 5px 0 0 12px;

                .command-style{
                    width: 75%;
                }

                .command-delete{
                    display: flex;
                    align-items: center;
                    background-color: white;
                    border-radius: 5px;
                    padding: 5px 10px 5px 10px;
                    color: black;
                    font-weight: 300;
                    margin-left: 10px;
                }
            }

        }

    }

    .btn_wrapper {
        //width: size(680px); //暂时调整样式
        margin-top: 20px;
        display: flex;
        justify-content: space-around;
    }

    .count_down_panel {
        display: flex;
        flex-direction: column;
        padding: 20px auto;
        color: #f5d090;

        .ready_content {

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .tip_ready {
                margin: 0 auto;
                font-size: 30px;
            }

            .count_ready {
                font-size: 35px;
            }
        }

    }

    .live_info_panel {
        display: flex;
        flex-direction: column;
        padding: 20px auto;
        color: #f5d090;
        align-items: center;
        justify-content: center;

        .live_info_show {
            font-size: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .flag-content {
                font-size: 33px;
                margin-bottom: 10px;
                width: 90%;
            }

            .vote-style{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                width: 100%;
                margin-bottom: 20px;
                margin-top: 40px;

                .support-container{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-right: 30px;
                    border-right: 1px solid #f5d090;

                    .support-sp{
                        font-size: 15px;
                        font-weight: 500;
                    }

                    .support-count{
                        font-size: 15px;
                        font-weight: 300;
                    }

                }

                .object-container{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-left: 30px;

                    .object-sp{
                        font-size: 15px;
                        font-weight: 500;
                    }

                    .object-count{
                        font-size: 15px;
                        font-weight: 300;
                    }
                }
            }
        }

    }

    .bt-vote {

        display: flex;
        width: 100%;
        padding: 10px 10px;
        margin: 10px 0;
        border: 1px solid red;
        border-radius: 2px;

    }

    .result_panel {
        display: flex;
        flex-direction: column;
        padding: 20px auto;
        color: #f5d090;
        align-items: center;
    }

    .panel-main {
        display: flex;
        flex-direction: column;
        padding: 20px 20px;
        align-items: center;

        .flag-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            width: 100%;
            font-size: 20px;
            font-weight: 600;
        }

        .win-style{
            font-size: 15px;
        }

        .prize-header {
            width: 100%;
            margin: 0 auto;
            margin-top: 20px;
            padding-bottom: 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            font-size: 14px;
            font-weight: 300;
            border-bottom: 1px solid #f5d090;
        }

        .prize-list {
            width: 90%;
            margin: 10px auto;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            font-size: 14px;
            font-weight: 300;
        }

        .no-prize {
            width: 90%;
            margin: 10px auto;
            display: flex;
            flex-direction: column;
            text-align: center;
            justify-content: space-around;
            font-size: 20px;
            font-weight: 300;
        }

        .config-bt {
            margin-top: 30px;
        }

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
                font-size: 16px;
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
                font-size: 16px;
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

                .fail{
                    color: #ed6521;
                }
            }
        }
    }
</style>
