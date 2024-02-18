import express, {NextFunction, application, request, response} from 'express';
import * as fs from 'node:fs';

const app = express();

var users: string = fs.readFileSync(__dirname + '/banned.txt').toString();
var users2 = users.split("\n");

app.listen(3000, async () => {
    console.log("we listen");
});

app.get('/getbanned', async (req: any, res: any) => {
    if(!req.query.userid) {
        res.send("no userid supplied");
        return;
    }
    res.send(users2.includes(req.query.userid));
    return;
});

app.post('/ban', async (req: any, res: any) => {
    if(!await req.headers.userid || !await req.headers.auth) {
        await res.sendStatus(403);
        return;
    }
    if(await req.headers.auth != "yes i am very real men") {
        await res.sendStatus(403);
        return;
    }
    if(users2.indexOf(req.headers.userid) !== -1) {
        res.sendStatus(403);
        return;
    }
    users += '\n'+req.headers.userid;
    users2.push(req.headers.userid);
    fs.writeFileSync(__dirname + '/banned.txt', users);
    res.sendStatus(200);
    return;
});

app.post('/unban', async (req: any, res: any) => {
    if(!await req.headers.userid || !await req.headers.auth) {
        await res.sendStatus(403);
        return;
    }
    if(await req.headers.auth != "yes i am very real men") {
        await res.sendStatus(403);
        return;
    }
    console.log(users2.indexOf(req.headers.userid))
    if(users2.indexOf(req.headers.userid) < 1) {
        await res.sendStatus(403);
        return;
    }
    users = users.replace('\n'+req.headers.userid, '');
    users2.splice(users2.indexOf(req.headers.userid), 1);
    console.log(users);
    console.log(users2);
    fs.writeFileSync(__dirname + '/banned.txt', users);
    res.sendStatus(200);
    return;
});

app.get('/getmassbannage', async (req: any, res: any) => {
    console.log("yooo")
    if(!req.headers.userids) {
        return;
    }

    var returnObject: any = {};
    let ind: number = 0;
    let obj = JSON.parse(req.headers.userids);
    for(let userid in obj) {
        console.log(userid, ind, obj[ind])
        ++ind;
        returnObject[ind] = (users2.indexOf(obj[ind]) != -1);
    }
    console.log(returnObject);
    console.log(JSON.stringify(returnObject));
    res.send(JSON.stringify(returnObject));
});

app.get('/', async (req: any, res: any) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get('/bans', async (req: any, res: any) => {
    res.sendFile(__dirname + '/banned.txt')
});

app.get('/js/indexjs.js', async (req: any, res: any) => {
    res.sendFile(__dirname + '/public/js/indexjs.js');
});