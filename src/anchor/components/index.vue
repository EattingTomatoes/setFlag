<template>
    <div id="index">
        <i class="title"></i>
        <div class="form-data">
            <div>
                <div>
                    <div class="flag-content">
                        <label>Flag内容</label>
                        <input type="text" v-model="flagContent" class="form-control"/>
                    </div>
                    <div class="flag-begin">
                        <label>投票结束时间</label>
                        <select v-model="limitedTime" class="form-control">
                            <option v-for="n in 24">
                                {{n}}个小时以后
                            </option>
                        </select>
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
                                        <img @click="options.splice(index,1)" class="option-icon" src="./../assets/img/reduce.png"/>
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
                        <input v-model="otherOptions" type="checkbox" value="开启'最后一分钟'加速模式"/>开启"最后一分钟"加速模式.
                    </div>
                    <div class="form-check">
                        <input v-model="otherOptions" type="checkbox" value="开启主播口令模式">开启主播口令模式.
                    </div>
                    <div class="form-check">
                        <input v-model="otherOptions" type="checkbox" value="开启随机送票模式">开启随机送票模式.
                    </div>
                </div>
            </div>

            <div class="btn_wrapper">
                <button @click="saveSettingConfig" type="button" class="save">保存</button>
                <button @click="getAnchorMsg" type="button" class="start">启动</button>
            </div>

            <!--<button type="button" @click="testSdk">测试</button>-->

            <div id="preview">
                <h3>浏览</h3>
                <p>{{limitedTime}}</p>
                <p>{{flagContent}}</p>
                <p>{{supportOption}}</p>
                <p>{{objectOption}}</p>
                <p v-for="choosedOption in choosedOptions">{{choosedOption}}</p>
                <p v-for="otherOption in otherOptions">{{otherOption}}</p>
            </div>
        </div>

        <add-options-dialog
            :choosedOptionList="choosedOptions">
        </add-options-dialog>
        <toast></toast>
    </div>
</template>

<script>
    import ARadioGroup from "ant-design-vue/es/radio/Group";
    import OptionSetting from "./optionSetting";
    import util from "./../assets/util"
    import eventBus from "../assets/eventBus"
    import AddOptionsDialog from "./addOptionsDialog";
    import Toast from "./toast";

    export default {
        name: 'Index',
        components: {Toast, AddOptionsDialog, OptionSetting, ARadioGroup},
        props: {
            msg: String
        },
        data() {
            return {
                flagContent: '',
                supportOption: '',
                objectOption: '',
                limitedTime:'',
                choosedOptions:[],
                otherOptions:[],
                nextOptionsId:2,
                isSettingSelf: true,
                anchorMsg:{}
            }
        },
        created(){
            hyExt.onLoad(()=>{
                this.getAnchorMsg();
                this.getLastResult();
                this.registerResultListener();

                eventBus.$on('saveOption',({votesCount, prizeType, prizeCount}) => {
                    console.log('传过来的内容为',votesCount,prizeType,prizeCount);
                    var length = this.choosedOptions.length;

                    this.choosedOptions.push({
                        optionId:this.nextOptionsId++,
                        votesCount:votesCount,
                        prizeType:prizeType,
                        prizeCount:prizeCount
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
        methods:{
            getLastResult(){

            },

            showAddOptionsDialog(){
                if(this.choosedOptions.length >= 5){
                    util.showToast('只能设置五个哦');
                    return;
                }
                eventBus.$emit('showDialog');
            },

            registerResultListener(){

            },

            saveSettingConfig: function(){
                if(!(this.flagContent&&this.limitedTime&&this.choosedOptions.length)){
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
                    limitedTime: this.limitedTime,
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
                    console.log(res)
                        // if(res.status === 0 && res.data) {
                        //     this.raceId = res.data.raceId;
                        //     util.showToast('已成功保存');
                        // }else{
                        //     util.showToast(res.msg);
                        // }
                        //
                        // console.log('保存结果', res);
                });
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
