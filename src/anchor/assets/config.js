 const isDebug = false;

 var config = {
    minSettingActionTime: 0.5,
    maxSettingActionTime: 24,
    defaultActionTime: 3,
    extUuid: '',
    baseUrl: isDebug ? '' : 'https://www.weixiaoyuan.xyz/api/setflag',
    port: isDebug ? 17050 : 80,
    settingStateMap: {
        unstart: 0,
        countDown: 1,
        liveInfo:2,
        end: 3
    },
     voteContent:{
        support: "我觉得主播可以完成",
         object: "我觉得主播够呛"
     },
     tabs:{
         fontSize: '20px',
         color: '#f5d090',
         display: 'flex',
         alignItems: 'center',
         fontWeight: '300',
         paddingLeft: '18px',
         width: '300px'
     }
};

export default config;