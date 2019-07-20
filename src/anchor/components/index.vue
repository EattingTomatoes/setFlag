<template>
    <div id="index">
        <i class="title"></i>
        <div class="form-data">
            <h4>主播设置</h4>
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
                        <div>奖金进度</div>
                        <option-setting></option-setting>
                    </div>
                </div>
                <div class="other-options">
                    <div>
                        <label>其他选项</label>
                    </div>
                    <div class="form-check">
                        <input type="checkbox"/>开启"最后一分钟"加速模式.
                    </div>
                    <div class="form-check">
                        <input type="checkbox">开启主播口令模式.
                    </div>
                    <div class="form-check">
                        <input type="checkbox">开启随机送票模式.
                    </div>
                </div>
            </div>

            <div class="btn_wrapper">
                <button type="button" class="save">保存</button>
                <button type="button" class="start">启动</button>
            </div>

            <!--<div id="preview">-->
                <!--<h3>浏览</h3>-->
                <!--<p>{{limitedTime}}</p>-->
                <!--<p>{{flagContent}}</p>-->
                <!--<p>{{supportOption}}</p>-->
                <!--<p>{{objectOption}}</p>-->
                <!--<p>{{isSettingSelf}}</p>-->
            <!--</div>-->

        </div>
    </div>
</template>

<script>
    import ARadioGroup from "ant-design-vue/es/radio/Group";
    import OptionSetting from "./optionSetting";

    export default {
        name: 'Index',
        components: {OptionSetting, ARadioGroup},
        props: {
            msg: String
        },
        data() {
            return {
                flagContent: '',
                supportOption: '',
                objectOption: '',
                limitedTime:'',
                isSettingSelf: true
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
        background-color: rgba(255, 255, 255, 0.5);
        margin-bottom: 20px;
    }

    label {
        display: block;
        margin: 20px 0 10px;
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
