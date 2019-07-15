<template>
    <div class="time_stamp">
        <div class="time_line_box">
            <div class="time_line" style="width:90%;">
                <ol>
                    <li>
                        <a class="order_item selected" style="left:15%;">step1</a>
                    </li>
                    <li>
                        <a class="order_item" style="left:40%;">step2</a>
                    </li>
                    <li>
                        <a class="order_item" style="left:70%;">step3</a>
                    </li>
                    <li>
                        <a class="order_item" style="left:90%;">step4</a>
                    </li>
                </ol>
                <span class="filling_line" style="transform: scaleX(0.28);"></span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "timeStamp"
    }
</script>

<style scoped>
    .time_line_box{
        position: relative;
        height: 60px;
        overflow: hidden;
    }
    .time_line{
        position: absolute;
        z-index: 1;
        left: 20px;
        top: 49px;
        height: 5px;
        background: #dfdfdf;
        border-radius: 10px 10px 10px 10px;
        -webkit-transition: -webkit-transform 0.4s;
        -moz-transition: -moz-transform 0.4s;
        transition: transform 0.4s;
    }
    .order_item{
        position: absolute;
        bottom: 0;
        z-index: 2;
        text-align: center;
        font-size: 13px;
        padding-bottom: 15px;
        color: black;
    }
    .order_item:after{
        content: '';
        position: absolute;
        left: 50%;
        right: auto;
        transform: translateX(-50%);
        bottom: -5px;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        border: 2px solid #dfdfdf;
        background-color: #f8f8f8;
    }
    .selected:after{
        background-color: #ffba4a;
        border-color: #ffba4a;
        height: 10px;
        width: 10px;
    }
    .filling_line{
        position: absolute;
        z-index: 1;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        background-color: #ffba4a;
        transform-origin: left center;
        transition-property: transform;
        transition-duration: 0.3s;
        transition-timing-function: initial;
        transition-delay: initial;
    }
    .filling_line:after{
        display: block;
        height: 100%;
        width: 100%;
        content: "";
        background: white;
        border-radius: 5px;
        position: absolute;
        left: 0;
        top: 0;
        animation: lineshow 1s infinite;
    }

    @keyframes lineshow {
        0%   {width: 0; opacity: .3;}
        100% {width: 100%; opacity: 0.1;}
    }
</style>