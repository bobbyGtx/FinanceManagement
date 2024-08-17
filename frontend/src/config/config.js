const host='http://localhost:3000';
const api='/api';
export const config = {
    host: host,
    api:host+'/api',
    URL:{
        login:host+api+'/login',
        logout:host+api+'/logout',
        register:host+api+'/signup',
        refresh:host+api+'/refresh',
        balance:host+api+'/balance',
        categories:host+api+'/categories',//список категорий и CRUD
        operations:host+api+'/operations',//список операций и CRUD
    },
    incCategory:'/income',
    expCategory:'/expense',
    tokenHeader:'x-auth-token',
    method:{
        post:'POST',
        get:'GET',
        put:'PUT',
        del:'DELETE',
    },
    colors:[
        'rgb(255,0,0)',
        'rgb(253,126,20)',
        'rgb(255,193,7)',
        'rgb(32,201,151)',
        'rgb(13,110,253)',
        'rgb(128,0,128)',
        'rgb(107,142,35)',
        'rgb(219,112,147)',
        'rgb(255,215,0)',
        'rgb(0,0,255)',
        'rgb(153,50,204)',
        'rgb(0,255,127)',
        'rgb(233,150,122)',
        'rgb(240,230,140)',
        'rgb(135,206,235)',
    ],
    defColor:'rgb(145,142,142)',
}