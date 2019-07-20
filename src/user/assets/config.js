const isDebug = false;
//调试端口
var config = {
    minSettingActionTime: 3,
    maxSettingActionTime: 8,
    defaultActionTime: 3,
    extUuid: '',
    baseUrl: isDebug ? 'https://jsonplaceholder.typicode.com/' : '',
    port: isDebug ? 17050 : 80,
    settingStateMap: {
        lastResult: 0,
        ready: 1,
        countDown: 2,
        end: 3
    }
}

export default config;