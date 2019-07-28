 const isDebug = false;

 var config = {
    minSettingActionTime: 0.5,
    maxSettingActionTime: 24,
    defaultActionTime: 3,
    extUuid: '',
    baseUrl: isDebug ? '' : 'z.cn',
    port: isDebug ? 17050 : 80,
    settingStateMap: {
        unstart: 0,
        countDown: 1,
        liveInfo:2,
        end: 3
    },
     voteContent:{
        support: "我jio得主播可以完成",
         object: "我jio得主播不能完成"
     },
     tabs:{
         fontSize: '20px',
         color: '#f5d090',
         display: 'flex',
         alignItems: 'center',
         marginLeft: '30px',
         marginRight: '30px',
         fontWeight: '300',
         paddingLeft: '25px'
     }
};

export default config;