<template>
    <div id="index">
        <div class="anchor_bg">
            <img class="bg" src="./../assets/img/background.png"/>
        </div>
        <!--<i class="title"></i>-->
        <div v-if="showUnstartPanel" class="form-data">
            <div>
                <div>
                    <div class="flag-content">
                        <label>Flag内容</label>
                        <div class="content"><a-input type="text" style="padding-left: 10px" size="default" v-model="flagContent"></a-input></div>
                        <!--<input type="text" v-model="flagContent" class="form-control"/>-->
                    </div>

                    <div class="time-wrapper">
                        <label class="desc">投票时长</label>
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
                            <label>投票选项</label>
                        </div>
                        <div v-if="isSettingSelf='default'" class="vote-option">
                            <div class="option-content">
                                <div><a-input type="text" class="option-support" addonBefore="支持票" v-model="voteContent.support"/></div>
                                <div><a-input type="text" class="option-object" addonBefore="反对票" v-model="voteContent.object"/></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="prize-container">
                    <label>奖金进度</label>
                    <div class="options-setting">
                            <ul>
                            <li class="bd-callout bd-callout-warning" v-for="(option, index) in choosedOptions" v-bind:key="option.id">
                                <a-icon type="minus" class="option-icon" @click="choosedOptions.splice(index,1)"></a-icon>
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
                        <a-input class="order-input" v-model="orderContent" type="text" placeholder="如:整条街我靓仔"></a-input>
                    </div>
                </div>

            </div>

            <div class="btn_wrapper">
                <div class="save"><a-button size="large" @click="saveSettingConfig">保存</a-button></div>
                <div class="start"><a-button size="large" @click="startAction">启动</a-button></div>
            </div>

            <!--<button type="button" @click="testSdk">测试</button>-->

            <div id="preview" style="color: white">
                <h3>浏览</h3>
                <p>{{flagContent}}</p>
                <p>{{orderContent}}</p>
                <p>{{voteContent}}</p>
                <p>{{actionTime}}</p>
                <p v-for="choosedOption in choosedOptions">{{choosedOption}}</p>
                <p v-for="otherOption in otherOptions">{{otherOption}}</p>
            </div>

        </div>

        <div v-if="showCountingDownPanel" class="count_down_panel">
            <div class="ready_content" v-if="isReadyCountDown">
                <p class="tip_ready">即将开始</p>
                <p class="count_ready" v-if="readyCountDownNum > 0">{{readyCountDownNum}}</p>
            </div>
        </div>

        <div v-if="showLiveInfoPanel" class="live_info_panel">
            <div class="live_info_show">
                <p class="flag_content">{{anchorMsg.userNick}}:&nbsp;{{flagContent}}</p>
                <p v-if="!voteIsStart">活动还未开始哦~</p>
                <p v-if="voteIsStart&&!voteIsEnd">距投票还剩
                    <span>{{time.hours}}</span> 时 <span>{{time.minute}}</span> 分 <span>{{time.second}}</span> 秒</p>
                <p v-if="voteIsEnd" style="color:red">投票已结束</p>
                <div>
                    <p>支持票</p>
                    <p>反对票</p>
                </div>
            </div>
        </div>

        <div v-if="showResultPanel && result" class="result_panel">

        </div>

        <!--<a-button @click="testSdk"></a-button>-->

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
                orderContent:'', //提交项
                settingState:CONFIG.settingStateMap.unstart,
                voteCountDownNum: 0,
                readyCountDownNum: 0,
                isReadyCountDown: true,
                voteIsStart: false,
                voteIsEnd: false,
                curTimer: null,
                voteContent:CONFIG.voteContent,
                time:{hours:'', minute:'', second:''}
            }
        },
        created(){
            hyExt.onLoad(()=>{
                this.getAnchorMsg();
                this.getLastVoteResult();

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

            this.registerResultListener();

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
                hyExt.observer.on('get_finish_result', res => {
                    res = JSON.parse(res);
                    this.getLastVoteResult(this.flagId);
                    this.settingState = CONFIG.settingStateMap.end;
                    console.log("推送结果完毕", res)
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
                if(!(this.flagContent&&this.actionTime&&this.choosedOptions.length
                    &&this.voteContent.object &&this.voteContent.support)){
                    util.showToast('请填写完整配置哈~');
                    return;
                }

                if(this.otherOptions.find(item => item==3)&&!this.orderContent){
                    util.showToast('请填写主播口令~');
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
                    voteContent: this.voteContent, // 投票选项
                    choosedOptions: this.choosedOptions, // 奖品选项
                    otherOptions: this.otherOptions, // 其它配置
                    orderContent: this.orderContent,
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
            },

            getCheckBox:function(res){
                console.log(res);
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
    }


    #index .anchor_bg{
        width: 100%;
        height: 1500px;
        background-color: #173b32;
        position: absolute;
        top: 0;

        .bg{
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
            z-index: 0;
            user-select: none;
        }
    }

    .form-data {
        /*margin: 5px 0 0 12px;*/
        /*max-width: 300px;*/
        /*border-radius: 5px;*/
        /*padding: 12px 10px;*/
        /*background-color: rgba(255, 255, 255, 0.4);*/
        /*margin-bottom: 20px;*/
        position: relative;
        top: 280px;
        display: flex;
        flex-direction: column;
        padding: 20px auto;
        color: #f5d090;
    }

    label {
        font-size: 17px;
        margin: 0 10px;
    }

    .flag-content{
        display: flex;
        flex-direction: row;
        align-items: center;
        vertical-align: middle;
        .content {
            width: 73%;
        }
    }

    .time-wrapper{
        display: flex;
        flex-direction: row;
        align-items: center;
        vertical-align: middle;
        margin-top: 20px;

        .time{
            padding: 5px 7px;
            margin: 0 5px;
            border-left: 1px solid #cccccc;
            border-right: 1px solid #cccccc;
            letter-spacing: 1px;
        }

        .wrapper{
            display: flex;
            flex-direction: row;
            background-color: white;
            border-radius: 5px;
            padding: 0 10px;
            align-items: center;
            vertical-align: middle;
            color: black;

            .time-icon{
                font-size: 20px;
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
            }

        }

    }

    .prize-container{
        display: flex;
        flex-direction: column;
        margin-top: 5px;
    }

    .add-btn{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background-color: #90cade;
        padding: 6px;
        width:95%;
    }

    .options-setting{

        margin: 3px 0 10px 10px;
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

            .option-container{
                display: block;
                span{
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
        .checkbox-style{
            color: white;
        }
        .order-content-style{

            margin-top: 10px;
            .order-input{
                margin-top: 10px;
                margin-left: 10px;
                width: 90%;
            }
        }

    }

    .btn_wrapper{
        //width: size(680px); //暂时调整样式
        margin-top: 20px;
        display: flex;
        justify-content: space-around;
    }

    .count_down_panel{
        position: relative;
        top: 280px;
        display: flex;
        flex-direction: column;
        padding: 20px auto;
        color: #f5d090;


        .ready_content{

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .tip_ready{
                margin: 0 auto;
                font-size: 30px;
            }

            .count_ready{
                font-size: 35px;
            }
        }

    }

    .live_info_panel{
        position: relative;
        top: 280px;
        display: flex;
        flex-direction: column;
        padding: 20px auto;
        color: #f5d090;
        align-items: center;
        justify-content: center;

        .live_info_show{
            font-size: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .flag-content{
                font-size: 33px;
                margin-bottom: 10px;
                width: 90%;
            }
        }

    }
</style>
