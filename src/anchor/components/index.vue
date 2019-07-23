<template>
    <div id="index">
        <i class="title"></i>
        <div v-if="showUnstartPanel" class="form-data">
            <div>
                <div>
                    <div class="flag-content">
                        <label>Flag内容</label>
                        <input type="text" v-model="flagContent" class="form-control"/>
                    </div>
                    <!--<div class="flag-begin">-->
                        <!--<label>投票结束时间</label>-->
                        <!--<select v-model="limitedTime" class="form-control">-->
                            <!--<option v-for="n in 24">-->
                                <!--{{n}}个小时以后-->
                            <!--</option>-->
                        <!--</select>-->
                    <!--</div>-->
                    <div class="time_wrapper">
                        <span class="desc">投票时长</span>
                        <div class="reduce_icon_wrapper" @click="reduceActionTime">
                            <img src="../assets/img/reduce_icon.png"/>
                        </div>

                        <p class="time">
                            {{actionTime}}
                        </p>

                        <div class="add_icon_wrapper" @click="addActionTime">
                            <img src="../assets/img/add_icon.png" class="icon"/>
                        </div>
                        <span>小时</span>
                    </div>

                    <div class="vote-options">
                        <div class="vote-title">
                            <label>投票选项</label>
                        </div>
                        <div v-if="isSettingSelf='default'" class="vote-option">
                            <div class="option-content">
                                <p class="support-option">"支持票| 这波我必须自持"</p>
                            </div>
                            <div class="option-content">
                                <p class="object-option">"反对票| 我jio得不可能"</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div>
                        <label>奖金进度</label>
                        <div class="options-setting">
                            <div>
                                <ul>
                                    <li class="bd-callout bd-callout-warning" v-for="(option, index) in choosedOptions" v-bind:key="option.id">
                                        <img @click="choosedOptions.splice(index,1)" class="option-icon" src="./../assets/img/reduce.png"/>
                                        投票数达到{{option.votesCount}}票时,送出{{option.prizeType}}共{{option.prizeCount}}份
                                    </li>
                                </ul>
                                <div @click="showAddOptionsDialog" class="add-btn">+添加选项</div>
                            </div>
                        </div>
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
                        <div v-if="otherOptions.find(item => item==3)">
                            <label>口令内容</label>
                            <input v-model="orderContent" class="form-control" type="text" placeholder="如:整条街我靓仔"/>
                            <!--<div :click="addOrder" class="add-btn">+添加口令</div>-->
                        </div>
                    </div>
                </div>

                <a-button @click="testSdk">测试</a-button>
            </div>

            <div class="btn_wrapper">
                <button @click="saveSettingConfig" type="button" class="save">保存</button>
                <button @click="startAction" type="button" class="start">启动</button>
            </div>

            <!--<button type="button" @click="testSdk">测试</button>-->

            <!--<div id="preview">-->
                <!--<h3>浏览</h3>-->
                <!--<p>{{flagContent}}</p>-->
                <!--<p>{{supportOption}}</p>-->
                <!--<p>{{objectOption}}</p>-->
                <!--<p v-for="choosedOption in choosedOptions">{{choosedOption}}</p>-->
                <!--<p v-for="otherOption in otherOptions">{{otherOption}}</p>-->
            <!--</div>-->

            <a-button>测试</a-button>
        </div>

        <div v-if="showCountingDownPanel" class="count_down_panel">
            <div v-if="isReadyCountDown">
                <p class="tip_ready">即将开始</p>
                <p v-if="readyCountDownNum > 0">{{readyCountDownNum}}</p>
            </div>
        </div>

        <div v-if="showLiveInfoPanel" class="live_info_panel">
            <div class="addcountdown">
                <p v-if="!voteIsStart">活动还未开始哦~</p>
                <p v-if="voteIsStart&&!voteIsEnd">距投票还剩
                    <span>{{time.hours}}</span> 时 <span>{{time.minute}}</span> 分 <span>{{time.second}}</span> 秒</p>
                <div>
                    <div></div>

                </div>
                <p v-if="voteIsEnd" style="color:red">投票已结束</p>
            </div>
        </div>

        <div v-if="showResultPanel && result" class="result_panel">

        </div>

        <add-options-dialog
            :choosedOptionList="choosedOptions">
        </add-options-dialog>
        <toast></toast>
    </div>
</template>

<script>
    import ARadioGroup from "ant-design-vue/es/radio/Group";
    import CONFIG from "./../assets/config";
    import OptionSetting from "./optionSetting";
    import util from "./../assets/util"
    import eventBus from "../assets/eventBus"
    import AddOptionsDialog from "./addOptionsDialog";
    import Toast from "./toast";

    export default {
        name: 'Index',
        components: {Toast, AddOptionsDialog},
        props: {
            msg: String
        },
        data() {
            return {
                flagId: -1,
                actionTime:1,  //提交项
                flagContent: '',//提交项
                supportOption: '',
                objectOption: '',
                choosedOptions:[], //提交项
                otherOptions:[], //提交项
                nextOptionsId:2,
                anchorMsg:{},
                orderContent:{}, //提交项
                settingState:CONFIG.settingStateMap.unstart,
                voteCountDownNum: 0,
                readyCountDownNum: 0,
                isReadyCountDown: true,
                voteIsStart: false,
                voteIsEnd: false,
                curTimer: null,
                time:{hours:'', minute:'', second:''}
            }
        },
        created(){
            hyExt.onLoad(()=>{
                this.getAnchorMsg();
                this.getLastVoteResult();
                this.registerResultListener();

                eventBus.$on('saveOption',({votesCount, prizeType, prizeCount}) => {
                    console.log('传过来的内容为',votesCount,prizeType,prizeCount);
                    var length = this.choosedOptions.length;

                    this.choosedOptions.push({
                        optionId:this.nextOptionsId++,
                        votesCount:votesCount,
                        prizeType:prizeType,
                        prizeCount:prizeCount,
                    });

                    var compare = function (prop) {
                        return function (obj1, obj2) {
                            var val1 = obj1[prop];
                            var val2 = obj2[prop];
                            if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
                                val1 = Number(val1);
                                val2 = Number(val2);
                            }
                            if (val1 < val2) {return -1;}
                            else if (val1 > val2) {return 1;}
                            return 0;
                        }
                    };
                    this.choosedOptions.sort(compare('votesCount'));

                })
            });

        },
        computed: {
            showUnstartPanel(){
                return this.settingState == CONFIG.settingStateMap.unstart;
            },
            showCountingDownPanel() {
                return this.settingState == CONFIG.settingStateMap.countDown;
            },
            showLiveInfoPanel(){
                return this.settingState == CONFIG.settingStateMap.liveInfo;
            },
            showResultPanel(){
                return this.settingState == CONFIG.settingStateMap.end;
            },
        },

        methods:{
            getLastVoteResult(flagId = ""){
                var questParam = {};
                if(flagId){
                    questParam = {
                        service: 'getFlagResult',
                        param: {
                            flagId: flagId
                        }
                    }
                }
                else {
                    questParam = {
                        service: 'getFlagResult',
                    }
                }

                // util.request(questParam)
                //     .then(res => {
                //         if(res.status === 0){
                //             if(res.data && res.data.flagId){
                //
                //             }
                //         }
                //     })
            },

            //注册结果的一个监听按钮。有消息源就触发
            registerResultListener(){
                // hyExt.observer.on('get_finish_result', res => {
                //     res = JSON.parse(res);
                //     this.getLastVoteResult(this.flagId);
                //     this.settingState = CONFIG.settingStateMap.end;
                //     console.log("推送结果完毕", res)
                // })
                hyExt.observer.on('foo', res=>{
                    res = JSON.parse(res);
                    console.log("推送完毕",res);
                })

            },

            reduceActionTime(){
                if(this.actionTime <=CONFIG.minSettingActionTime){
                    return;
                }
                this.actionTime-=0.5;
            },

            addActionTime(){
                if(this.actionTime >= CONFIG.maxSettingActionTime){
                    return;
                }
                this.actionTime+=0.5;
            },

            showAddOptionsDialog(){
                if(this.choosedOptions.length >= 5){
                    util.showToast('只能设置五个哦');
                    return;
                }
                eventBus.$emit('showDialog');
            },

            saveSettingConfig: function(){
                if(!(this.flagContent&&this.actionTime&&this.choosedOptions.length)){
                    util.showToast('请填写完整配置哈~');
                    return;
                }

                this.choosedOptions = this.choosedOptions.map(item => {
                    return {
                        votesCount: util.xssFilter(item.votesCount),
                        prizeType: util.xssFilter(item.prizeType),
                        prizeCount: item.prizeCount
                    }
                });

                var submitValue = {
                    flagContent: util.xssFilter(this.flagContent),
                    limitedTime: this.actionTime,
                    choosedOptions: this.choosedOptions,
                    otherOptions: this.choosedOptions
                };

                var that = this;
                util.hy_request({
                    service: 'saveConfig',
                    method:'POST',
                    param: {
                        anchorMsg: JSON.stringify(that.anchorMsg),
                        options: JSON.stringify(submitValue)
                    }
                }).then(res => {
                    console.log('dede',res);
                    if(res.status == 200 && res.flag_id) {
                        this.flagId = res.flag_id;
                        util.showToast('已成功保存');
                    }else{
                        util.showToast(res.msg);
                    }

                    console.log('保存结果', res);
                });
            },


            startAction(){

                if(!(this.flagContent&&this.actionTime&&this.choosedOptions.length)){
                    util.showToast('请填写完整配置哈~');
                    return;
                }

                if(this.flagId <=0 ){
                    util.showToast('请先保存好设置，再启动');
                    return;
                }

                this.startReadyTimeCountDown();

                // util.request({
                //     service: 'startFlag',
                //     method: 'POST',
                //     param: {
                //         flagId: this.flagId
                //     }
                // }).then(res => {
                //     if(res.status === 0){
                //         console.log('启动成功');
                //         this.startReadyTimeCountDown();
                //     }
                //     else {
                //         util.showToast(res.msg);
                //     }
                //
                //     console.log('正在启动', res);
                // })

            },

            startReadyTimeCountDown(){
                this.readyCountDownNum = 3;
                this.isReadyCountDown = true;
                this.settingState = CONFIG.settingStateMap.countDown;

                var timer = setInterval(() => {
                    if(this.readyCountDownNum <= 0){
                        this.settingState = CONFIG.settingStateMap.liveInfo;
                        this.startVoteTimeCountDown(this.raceTime);
                        this.isReadyCountDown = false;
                        clearInterval(timer);
                    }

                    this.readyCountDownNum--;
                }, 1000)
            },

            startVoteTimeCountDown(){
                this.voteIsStart = true;
                this.voteCountDownNum = new Date().getTime() + this.actionTime * 10 * 1000;
                var that = this;
                if(this.voteIsStart&&!this.voteIsEnd){

                    this.curTimer = setInterval(()=>{
                        if(that.voteCountDownNum - new Date().getTime()>0){
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

            initFormate(curTime){
                this.time.hours = curTime.split(':')[0];
                this.time.minute = curTime.split(':')[1];
                this.time.second = curTime.split(':')[2];
            },

            getAnchorMsg(){
                var that = this;
                hyExt.context.getUserInfo().then(userInfo => {
                    console.log('Youngso1',that.anchorMsg);
                    that.anchorMsg = userInfo;
                    console.log('Youngso2',that.anchorMsg);
                    hyExt.logger.info('获取用户信息成功', userInfo.userNick)
                }).catch(err => {
                    hyExt.logger.warn('获取用户信息失败');
                });
            },


            testSdk(){
                hyExt.observer.emit('foo','foo');
            }

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    @import '../assets/scss/partial/_base';
    @import "../assets/scss/partial/_reset";
    @import '../assets/scss/common';

    #index {
        display: flex;
        flex-direction: column;
        background-color: rgb(59, 136, 117);
    }

    #index .title {
        height: 253px;
        background: url("../assets/img/title.png") no-repeat 10%;
        -moz-background-size: 100%;
        background-size: 100%;
    }

    .form-data {
        margin: 5px 0 0 12px;
        max-width: 300px;
        border-radius: 5px;
        padding: 12px 10px;
        background-color: rgba(255, 255, 255, 0.4);
        margin-bottom: 20px;
    }

    label {
        display: block;
        margin: 20px 0 10px;
        font-size: 16px;
        font-weight: 600;
    }

    .vote-options {

        display: flex;
        flex-direction: column;

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
            flex-direction: row;

            p {
                padding: 8px 8px;
                margin-bottom: 1rem;
                border: 1px solid transparent;
                border-radius: .25rem;
                width: 90%;
            }

            .support-option {
                color: #0c5460;
                background-color: #d1ecf1;
                border-color: #bee5eb;
            }

            .object-option {
                color: #721c24;
                background-color: #f8d7da;
                border-color: #f5c6cb;
            }
        }

    }

    .add-btn{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 4px;
        background-color: white;
        padding: 6px;
        width:90%;
    }

    .bd-callout{
        padding: 0.55rem;
        margin-top: 1.25rem;
        margin-bottom: 1.25rem;
        border: 1px solid #eee;
        border-left-width: .25rem;
        border-radius: .25rem;
        font-size: 14px;
        list-style-type: none;
        margin-left: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        vertical-align: middle;
        letter-spacing: 1px;
    }

    .bd-callout-warning{
        border-left-color: #f0ad4e;

    }

    .option-icon{
        height: 22px;
        width: 22px;
        margin-right: 10px;
    }

    .form-control {
        display: block;
        width: 90%;
        padding: 5px 5px;
        font-size: 1rem;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        background-clip: padding-box;
        border: 1px solid #ced4da;
        border-radius: .25rem;
        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
    }

    .other-options {
        margin-top: 0;

        .form-check {
            position: relative;
            display: block;

        }
    }

    .btn_wrapper{
        //width: size(680px); //暂时调整样式
        margin: 20px auto 0;
        display: flex;
        justify-content: space-between;

        .save, .start{
            width: 105px;
            height: 40px;
            border-radius: 10px;
            border: 0;
            font-size: 16px;
            cursor: pointer;
            display: block;
        }

        .save{
            background: #fff;
            color: #FFA200;
            &:active{
                background: #e5e5e5;
            }
        }

        .start{
            background: #FFA200;
            color: #fff;
            &:active{
                background: #e59100;
            }

            &.disabled{
                background: #e5e5e5;
                color: #999999;
                cursor: default;
            }
        }
    }
</style>
