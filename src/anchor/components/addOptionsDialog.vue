<template>
    <div class="add-options-dialog" v-if="isShowDialog">
        <div class="mask" @click="hideDialog"></div>
        <div class="main_wrapper">
            <p class="title">添加选项</p>
            <div class="content-wrapper">
                <div>投票数<input class="vote-style" v-model="votesCount" type="text" placeholder="填写票数"/></div>
                <div>抽奖项<input class="prize-style" v-model="prizeType" type="text" placeholder="如:送出100元"/></div>
                <div>
                    数量
                    <select v-model="prizeCount" class="select-style">
                        <option v-for="n in 30">{{n}}</option>
                    </select>
                </div>
            </div>
            <div class="ok-btn" @click="saveOption">完成</div>
        </div>

    </div>
</template>

<script>
    import eventBus from '../assets/eventBus'
    import util from '../assets/util'
    import Toast from "./toast";

    export default {
        name: "addOptionsDialog",
        components: {Toast},
        data(){
            return {
                isShowDialog:false,
                votesCount:'',
                prizeCount:1,
                prizeType:''
            }
        },
        created(){
            eventBus.$on('showDialog', res => {
                this.isShowDialog = true
            })
        },
        destroyed(){
            eventBus.$off('showDialog');
        },
        props:['choosedOptionList'], //已选择的选项
        methods: {

            hideDialog(){
                this.isShowDialog = false;
            },

            saveOption(){
                var submitVoteCount = this.votesCount ? this.votesCount.trim() : '';
                var submitPrizeType = this.prizeType ? this.prizeType.trim() : '';

                if(!(submitVoteCount&&submitPrizeType)){
                    util.showToast('请填写完整信息');
                    return;
                }

                console.log(this.votesCount);
                if(!util.checkNum(this.votesCount)){
                    util.showToast('投票数必须是数字');
                    return;
                }

                console.log('原来的选项',this.choosedOptionList);
                if(this.choosedOptionList){
                    console.log(this.choosedOptionList);
                    const LessThanOthers = this.choosedOptionList.some(item => {
                        if(parseInt(item.votesCount) >= parseInt(submitVoteCount)){
                            return true;
                        }
                    });
                    if(LessThanOthers){
                        util.showToast("当前投票数不低于原先的票数");
                        return;
                    }
                }

                eventBus.$emit('saveOption',{
                    votesCount: this.votesCount,
                    prizeType: this.prizeType,
                    prizeCount: this.prizeCount
                });

                this.hideDialog();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./../assets/scss/common.scss";

    .add-options-dialog{
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 0;

        .mask{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            background: rgba(0, 0, 0, 0.5);
        }

        .main_wrapper{
            position: absolute;
            top: 100px;
            left: 48%;
            transform: translateX(-50%);
            z-index: 2;
            width: 270px;
            height: 300px;
            background: #fff;
            border-radius: 5px;

            .title{
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 15px;
                color: #333333;
                border-bottom: 1px solid  #E9E9E9;
                padding: 10px 0;
            }

            .content-wrapper{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin-top: 35px;

                div{
                    display: flex;
                    flex-direction: row;
                    padding-bottom: 20px;
                    vertical-align: middle;
                    align-items: center;

                    input{
                        display: block;
                        width: 150px;
                        padding: 7px 7px;
                        font-size: 13px;
                        line-height: 1.5;
                        color: #495057;
                        background-color: #fff;
                        background-clip: padding-box;
                        border: 1px solid #ced4da;
                        border-radius: .25rem;
                        margin-left: 10px;
                        transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
                    }

                    .select-style{
                        display: block;
                        width: 150px;
                        padding: 7px 7px;
                        font-size: 13px;
                        line-height: 1.5;
                        color: #495057;
                        background-color: #fff;
                        background-clip: padding-box;
                        border: 1px solid #ced4da;
                        border-radius: .25rem;
                        margin-left: 10px;
                    }
                }
            }

            .ok-btn{
                height: 35px;
                width: 130px;
                display: flex;
                margin: 0 auto;
                align-items: center;
                justify-content: center;
                font-size: 17px;
                color: #000000;
                border: 1px solid rgba(2, 0, 5, 0.45);
                border-radius: 5px;
                cursor: pointer;
            }
        }
    }

</style>