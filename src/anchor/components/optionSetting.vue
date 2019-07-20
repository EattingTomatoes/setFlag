<template>
    <div class="options-setting">
        <div>
            <ul>
                <li class="bd-callout bd-callout-warning" v-for="(option, index) in options" v-bind:key="option.id">
                    <img @click="options.splice(index,1)" class="option-icon" src="./../assets/img/reduce.png"/>
                    投票数达到:{{option.num}},送出{{option.prize}}
                </li>
            </ul>
            <div @click="addOptions" class="add-btn">添加选项</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "optionSetting",
        data() {
            return {
                options:[{
                    id:1,
                    num:20,
                    prize:'一百个奶油包'
                }],
                nextOptionsId:2
            }
        },
        methods: {
            addOptions: function () {
                this.options.push({
                    id:this.nextOptionsId++,
                    num:30,
                    prize:'两百个奶油包'
                });
                console.log(this.options.length);
                console.log(this.options);
            },
        }
    }
</script>

<style scoped>

    ul{
        padding: 0;
    }

    .add-btn{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 4px;
        background-color: white;

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
    }

    .bd-callout-warning{
        border-left-color: #f0ad4e;

    }

    .option-icon{
        height: 22px;
        width: 22px;
        margin-right: 10px;
    }
</style>