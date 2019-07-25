const isDebug = false;
//调试端口
var config = {
    minSettingActionTime: 3,
    maxSettingActionTime: 8,
    defaultActionTime: 3,
    extUuid: '',
    baseUrl: isDebug ? '' : 'weixiaoyuan.xyz',
    port: isDebug ? 17050 : 80,
    settingStateMap: {
        unstart: 0,
        countDown: 1,
        liveInfo:2,
        end: 3
    },
    ops: {
        vuescroll: {},
        scrollPanel: {},
        rail: {
            background: '#01a99a',
            opacity: 0,
            size: '10px',
            specifyBorderRadius: false,
            gutterOfEnds: null,    //轨道距 x 和 y 轴两端的距离
            gutterOfSide: '0',   //距离容器的距离
            keepShow: false,   //是否即使 bar 不存在的情况下也保持显示
            border:'none'    //边框
        },
        bar: {
            hoverStyle: true,
            onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
            background: '#385247',   //颜色
        }
    }
}

export default config;