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
                                             v-model="flagContent" maxlength="15"></a-input>
                                </div>
                                <!--<input type="text" v-model="flagContent" class="form-control"/>-->
                            </div>

                            <div class="time-wrapper">
                                <label style="width: 72px">投票时长</label>
                                <div class="wrapper">
                                    <a-icon type="minus" class="time-icon" @click="reduceActionTime"></a-icon>
                                    <p class="time">
                                        {{actionTime}}小时
                                    </p>
                                    <a-icon type="plus" class="time-icon" @click="addActionTime"/>
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
                                                     v-model="voteContent.support" size="small" maxlength="15"/>
                                        </div>
                                        <div>
                                            <a-input type="text" class="option-object" addonBefore="反对票"
                                                     v-model="voteContent.object" size="small" maxlength="15"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="prize-container">
                            <label>奖金进度</label>
                            <div class="options-setting">
                                <ul>
                                    <li class="bd-callout bd-callout-warning" v-for="(option, index) in choosedOptions"
                                        v-bind:key="option.id">
                                        <a-icon type="minus" class="option-icon"
                                                @click="choosedOptions.splice(index,1)"></a-icon>
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
                                <input v-model="otherOptions" type="checkbox" value="1"/>开启"最后一分钟"加速模式.
                            </div>
                            <div class="form-check">
                                <input v-model="otherOptions" type="checkbox" value="2">开启随机送票模式.
                            </div>
                            <div class="form-check">
                                <input v-model="otherOptions" type="checkbox" value="3">开启主播口令模式.
                            </div>

                            <div class="order-content-style" v-if="otherOptions.find(item => item==3)">
                                <label>口令内容</label>
                                <!--<div :click="addOrder" class="add-btn">+添加口令</div>-->
                                <a-input class="order-input" v-model="orderContent" type="text"
                                         placeholder="如:整条街我靓仔" maxlength="15"></a-input>
                            </div>
                        </div>

                    </div>
                    <div class="btn_wrapper">
                        <div class="save">
                            <a-button size="large" @click="saveSettingConfig">保存</a-button>
                        </div>
                        <div class="start">
                            <a-button size="large" @click="startAction">启动</a-button>
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

        <div v-if="showCountingDownPanel" class="bg-panel count_down_panel">
            <div class="ready_content" v-if="isReadyCountDown">
                <p class="tip_ready">即将开始</p>
                <p class="count_ready" v-if="readyCountDownNum > 0">{{readyCountDownNum}}</p>
            </div>
        </div>

        <div v-if="showLiveInfoPanel" class="bg-panel live_info_panel">
            <div class="live_info_show">
                <p class="flag_content">{{anchorMsg.userNick}}:&nbsp;{{flagContent}}</p>
                <p v-if="voteIsStart&&!voteIsEnd">距投票还剩
                    <span>{{time.hours}}</span> 时 <span>{{time.minute}}</span> 分 <span>{{time.second}}</span> 秒</p>
                <p v-if="voteIsEnd" style="color:red">投票已结束</p>
                <div v-if="voteIsEnd">
                    <div class="vote-style">
                        <div class="support-container">
                            <div class="support-sp">支持票</div>
                            <div class="support-count">{{supportVoteCount}}</div>
                        </div>
                        <div class="object-container">
                            <div class="object-sp">反对票</div>
                            <div class="object-count">{{objectVoteCount}}</div>
                        </div>
                    </div>
                    <a-button @click="submitResult1">从投"支持票"中抽奖</a-button>
                    <a-button @click="submitResult2">从投"反对票"中抽奖</a-button>
                </div>
            </div>
        </div>

        <div v-if="showResultPanel" class="bg-panel result_panel">
            <div class="panel-main">
                <div class="flag-content">
                    <span>参与Flag:"{{flagContent}}"的中奖名单为:</span>
                </div>
                <div class="prize-header">
                    <span>中奖用户ID</span>
                    <span>中奖用户名称</span>
                </div>
                <div class="prize-list" v-for="prizeMsg in prizeList">
                    <span>{{prizeMsg.user_id}}</span>
                    <span>{{prizeMsg.user_name}}</span>
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
                :choosedOptionList="choosedOptions">
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
                voteContent: CONFIG.voteContent,
                time: {hours: '', minute: '', second: ''},
                styleObject: CONFIG.tabs,
                showNone: 0,
                saveAllOptions: false,
                supportVoteCount:0,
                objectVoteCount: 0,
                anchorRecord:[],
                recordState:[],

                //提交主播配置项
                anchorMsg: {},
                supportOption: '',
                objectOption: '',
                actionTime: 1,
                achevieTime: 0,
                flagContent: '',
                choosedOptions: [],
                otherOptions: [],
                orderContent: '',
                prizeList: [],
                allConfig:null,
            }
        },
        created() {
            hyExt.onLoad(() => {
                this.getAnchorMsg();
                this.getLastVoteResult();
                this.registerResultListener();

                eventBus.$on('saveOption', ({votesCount, prizeType, prizeCount}) => {
                    console.log('传过来的内容为', votesCount, prizeType, prizeCount);
                    var length = this.choosedOptions.length;

                    this.choosedOptions.push({
                        optionId: this.nextOptionsId++,
                        votesCount: votesCount,
                        prizeType: prizeType,
                        prizeCount: prizeCount,
                    });

                    // var compare = function (prop) {
                    //     return function (obj1, obj2) {
                    //         var val1 = obj1[prop];
                    //         var val2 = obj2[prop];
                    //         if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                    //             val1 = Number(val1);
                    //             val2 = Number(val2);
                    //         }
                    //         if (val1 < val2) {
                    //             return -1;
                    //         }
                    //         else if (val1 > val2) {
                    //             return 1;
                    //         }
                    //         return 0;
                    //     }
                    // };
                    // this.choosedOptions.sort(compare('votesCount'));

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
            getSpportPecent() {
                var total = this.supportVoteCount + this.objectVoteCount;
                console.log("dedede",total)
                if (!total) return 0;
                var takePecent = this.supportVoteCount / total;
                var intTake = takePecent * 100;
                return intTake;
            },

            getObectPecent() {
                var total = this.supportVoteCount + this.objectVoteCount;
                console.log("dedede",total)
                if (!total) return 0;
                var takePecent = this.objectVoteCount / total;
                var intTake = takePecent * 100;
                return intTake;
            }
        },

        methods: {
            getLastVoteResult(flagId = "") {
                var questParam = {};
                if (flagId) {
                    questParam = {
                        service: 'getFlagConfig',
                        param: {
                            flagId: flagId
                        }
                    }
                }
                else {
                    questParam = {
                        service: 'getFlagConfig',
                    }
                }

                util.hy_request(questParam)
                    .then(res => {
                        if (res.status === 200 && res.data.length) {

                            var configOptions = JSON.parse(res.data[0]['config_content']);
                            this.actionTime = configOptions.limitedTime;
                            this.acheiveTime = configOptions.acheiveTime;
                            this.voteContent = configOptions.voteContent;
                            this.choosedOptions = configOptions.choosedOptions;
                            this.otherOptions = configOptions.otherOptions;
                            this.orderContent = configOptions.orderContent;
                            this.flagContent = configOptions.flagContent;
                            this.flagId = res.data[0]['flag_id'];
                            console.log(res)

                            if (res.hasResult) {
                                this.supportVoteCount = res.data[1].support_count;
                                this.objectVoteCount = res.data[1].object_count;
                                if (res.data[0].flag_state == 0) {
                                    this.settingState = CONFIG.settingStateMap.liveInfo;
                                    this.startVoteTimeCountDown();
                                }

                                else if (res.data[0].flag_state == 1) {
                                    this.prizeList = JSON.parse(res.data[0]['prize_list']);
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
                        this.anchorRecord = res.data;
                        this.recordState = res.state;
                    }
                })
            },

            checkContent(e){
                if(this.flagContent.length>15){
                    util.showToast("输入的Flag内容不能超过15个字！")
                }
            },

            //注册结果的一个监听按钮。有消息源就触发
            registerResultListener() {
                hyExt.observer.on('get_finish_result', res => {
                    res = JSON.parse(res);
                    this.getLastVoteResult(this.flagId);
                    this.settingState = CONFIG.settingStateMap.end;
                })

            },

            reduceActionTime() {
                if (this.actionTime <= CONFIG.minSettingActionTime) {
                    return;
                }
                this.actionTime -= 0.5;
            },

            addActionTime() {
                if (this.actionTime >= CONFIG.maxSettingActionTime) {
                    return;
                }
                this.actionTime += 0.5;
            },

            showAddOptionsDialog() {
                if (this.choosedOptions.length >= 5) {
                    util.showToast('只能设置五个哦');
                    return;
                }
                eventBus.$emit('showDialog');
            },

            saveSettingConfig: function () {

                this.choosedOptions = this.choosedOptions.map(item => {
                    return {
                        votesCount: util.xssFilter(item.votesCount),
                        prizeType: util.xssFilter(item.prizeType),
                        prizeCount: item.prizeCount
                    }
                });

                this.acheiveTime = new Date().getTime() + this.actionTime * 3600 * 1000;

                var submitValue = {
                    flagContent: util.xssFilter(this.flagContent),
                    limitedTime: this.actionTime,
                    acheiveTime: this.acheiveTime,
                    voteContent: this.voteContent, // 投票选项
                    choosedOptions: this.choosedOptions, // 奖品选项
                    otherOptions: this.otherOptions, // 其它配置
                    orderContent: this.orderContent,
                };

                this.allConfig = submitValue;

                var that = this;
                util.hy_request({
                    service: 'saveConfig',
                    method: 'POST',
                    param: {
                        anchorMsg: JSON.stringify(that.anchorMsg),
                        options: JSON.stringify(submitValue)
                    }
                }).then(res => {
                    if (res.status == 200 && res.flag_id) {
                        this.flagId = res.flag_id;
                        this.saveAllOptions = true;
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

                if (!(this.flagContent && this.actionTime && this.choosedOptions.length
                    && this.voteContent.object && this.voteContent.support)) {
                    util.showToast('请填写完整配置哈~');
                    return;
                }

                if (this.otherOptions.find(item => item == 3) && !this.orderContent) {
                    util.showToast('请填写主播口令~');
                    return;
                }

                // this.startReadyTimeCountDown();

                util.hy_request({
                    service: 'startFlag',
                    method: 'POST',
                    param: {
                        flagId: this.flagId
                    }
                }).then(res => {
                    console.log(res);
                    if (res.status === 200) {
                        this.allConfig.flagId = this.flagId;
                        hyExt.observer.emit('start_flag',JSON.stringify(this.allConfig));
                        console.log(JSON.stringify(this.allConfig));
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
                this.voteCountDownNum = this.acheiveTime;
                var that = this;
                var updateCounts= 0;
                if (this.voteIsStart && !this.voteIsEnd) {
                    this.curTimer = setInterval(() => {
                        if (that.voteCountDownNum - new Date().getTime() > 0) {
                            var curTime = util.SecondToData(that.voteCountDownNum);
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
                this.updateVoteCount();
            },

            updateVoteCount(){
                util.hy_request({
                    service: 'backVoteCount',
                    method: 'GET',
                    param:{
                        flagId: this.flagId
                    }
                }).then(res => {
                    this.supportVoteCount = res.support_count;
                    this.objectVoteCount = res.object_count;
                })
            },

            initFormate(curTime) {
                this.time.hours = curTime.split(':')[0];
                this.time.minute = curTime.split(':')[1];
                this.time.second = curTime.split(':')[2];
            },

            getAnchorMsg() {
                var that = this;
                hyExt.context.getUserInfo().then(userInfo => {
                    that.anchorMsg = userInfo;
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
                        this.prizeList = res.prize_list;
                        if (!res.res) {
                            this.showNone = 1;
                        }
                        hyExt.observer.emit('prize_draw_finish',JSON.stringify(res.prize_list));
                        console.log(JSON.stringify(res.prize_list));
                        this.settingState = CONFIG.settingStateMap.end;
                    }
                })

            },

            submitResult2() {
                util.hy_request({
                    service: 'prizeDraw',
                    param: {
                        success: 0,
                        flagId: this.flagId
                    }

                }).then(res => {
                    if (res.status == 200) {
                        this.prizeList = res.prize_list;
                        if (!res.res) {
                            console.log("re", res);
                            this.showNone = 1;
                        }
                        hyExt.observer.emit('prize_draw_finish',JSON.stringify(res.prize_list));
                        this.settingState = CONFIG.settingStateMap.end;
                    }
                })
            },

            configNextFlag() {
                this.settingState = CONFIG.settingStateMap.unstart;
                Object.assign(this.$data, this.$options.data());
                this.getAnchorMsg();
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
            padding: 5px;
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
                    font-size: 15px;
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
        .order-content-style {

            margin-top: 10px;
            .order-input {
                margin-top: 10px;
                margin-left: 10px;
                width: 90%;
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
            font-size: 20px;
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

                .support-container{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-right: 30px;
                    border-right: 1px solid #f5d090;

                    .support-sp{
                        font-size: 22px;
                        font-weight: 500;
                    }

                    .support-count{
                        font-size: 20px;
                        font-weight: 300;
                    }

                }

                .object-container{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding-left: 30px;

                    .object-sp{
                        font-size: 22px;
                        font-weight: 500;
                    }

                    .object-count{
                        font-size: 20px;
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
            width: 90%;
            font-size: 20px;
            font-weight: 600;
        }

        .prize-header {
            width: 90%;
            margin: 0 auto;
            margin-top: 20px;
            padding-bottom: 10px;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            font-size: 18px;
            font-weight: 300;
            border-bottom: 1px solid #f5d090;
        }

        .prize-list {
            width: 90%;
            margin: 10px auto;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            font-size: 17px;
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
</style>
