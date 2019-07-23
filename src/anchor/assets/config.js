 const isDebug = false;

 var config = {
    minSettingActionTime: 0.5,
    maxSettingActionTime: 24,
    defaultActionTime: 3,
    extUuid: '',
    baseUrl: isDebug ? '' : 'weixiaoyuan.xyz',
    port: isDebug ? 17050 : 80,
    settingStateMap: {
        unstart: 0,
        countDown: 1,
        liveInfo:2,
        end: 3
    }
}

export default config;