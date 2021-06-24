const sessions = {};

export const get = (uid) =>{
    console.log('uid', uid)
    console.log('sessions', sessions)
    return  sessions[uid];
}
export const set = (uid, token) => {sessions[uid] = token;}
