import express, {NextFunction, application, request, response} from 'express';
import * as fs from 'node:fs';
import * as bcrypt from 'bcrypt';

const app = express()

var Salt = bcrypt.genSaltSync(15)
var pass: string = bcrypt.hashSync("yes i am very real men", Salt)
var Salt2 = bcrypt.genSaltSync(15)
while(Salt2) {
var superpass: string = bcrypt.hashSync("yes i am incredibly real men", Salt2)
Salt2 = null;
}

var users: string = fs.readFileSync(__dirname + '/banned.txt').toString();
var users2 = users.split("\n");
var admins: string = fs.readFileSync(__dirname + '/admins.txt').toString();
var admins2 = admins.split("\n");
var sus: string = fs.readFileSync(__dirname + '/superusers.txt').toString();
var sus2 = sus.split("\n");

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

app.get('/isadmin', async (req: any, res: any) => {
    if(!req.query.userid) {
        res.send("no userid supplied");
        return;
    }
    var txt: string = "false";
    if(admins2.includes(req.query.userid)) txt = "true"
    if(sus2.includes(req.query.userid)) txt = "superuser"
    res.send(txt);
    return;
})

app.post('/makeadmin', async (req: any, res: any) => {
    if(req.headers.userid == null || req.headers.superauth == null) {
        res.appendHeader("reason", "no headers")
        res.sendStatus(403);
        return;
    }
    if(!await bcrypt.compare(req.headers.superauth, superpass)) {
        res.appendHeader("reason", "password no matchie")
        res.sendStatus(403);
        return;
    }
    if(admins2.indexOf(req.headers.userid) !== -1 || sus2.indexOf(req.headers.userid) !== -1) {
        res.appendHeader("reason", "alr exists")
        res.sendStatus(403);
        return;
    }
    if(req.headers.makesu == "true") {
        sus += '\n'+req.headers.userid;
        sus2.push(req.headers.userid);
        fs.writeFileSync(__dirname + '/superusers.txt', sus);
        res.sendStatus(200)
        return
    }
    admins += '\n'+req.headers.userid;
    admins2.push(req.headers.userid);
    fs.writeFile(__dirname + '/admins.txt', admins, async (err) => {
        console.log(err)
    });
    res.sendStatus(200);
    return;
})

app.post('/demote', async (req: any, res: any) => {
    if(!req.headers.userid || !req.headers.superauth) {
        res.sendStatus(403);
        return;
    }
    if(!await bcrypt.compare(req.headers.superauth, superpass)) {
        res.sendStatus(403);
        return;
    }
    if(admins2.indexOf(req.headers.userid) < 1) {
        res.sendStatus(403);
        return;
    }
    admins = admins.replace('\n'+req.headers.userid, '');
    admins2.splice(admins2.indexOf(req.headers.userid), 1);
    fs.writeFile(__dirname + '/admins.txt', users, async (err) => {
        console.log(err)
    });
    res.sendStatus(200);
    return;
})

app.post('/ban', async (req: any, res: any) => {
    if(!req.headers.userid || !req.headers.auth) {
        res.sendStatus(403);
        return;
    }
    if(!await bcrypt.compare(req.headers.auth, pass)) {
        res.sendStatus(403);
        return;
    }
    if(users2.indexOf(req.headers.userid) !== -1) {
        res.sendStatus(403);
        return;
    }
    users += '\n'+req.headers.userid;
    users2.push(req.headers.userid);
    fs.writeFile(__dirname + '/banned.txt', users, async (err) => {
        console.log(err)
    });
    res.sendStatus(200);
    return;
});

app.post('/unban', async (req: any, res: any) => {
    if(!req.headers.userid || !req.headers.auth) {
        res.sendStatus(403);
        return;
    }
    if(!await bcrypt.compare(req.headers.password, pass)) {
        res.sendStatus(403);
        return;
    }
    console.log(users2.indexOf(req.headers.userid))
    if(users2.indexOf(req.headers.userid) < 1) {
        res.sendStatus(403);
        return;
    }
    users = users.replace('\n'+req.headers.userid, '');
    users2.splice(users2.indexOf(req.headers.userid), 1);
    fs.writeFile(__dirname + '/banned.txt', users, async (err) => {
        console.log(err)
    });
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
    req.headers.userids = "{" + req.headers.userids + "}";
    let obj = JSON.parse(req.headers.userids);
    for(let userid in obj) {
        ++ind;
        console.log(userid, ind, obj[ind], users2.indexOf(obj[ind]))
        returnObject[ind] = (users2.indexOf(obj[ind].toString()) != -1);
    }
    console.log(returnObject);
    console.log(JSON.stringify(returnObject));
    res.send(JSON.stringify(returnObject));
});

app.get('/', async (req: any, res: any) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get('/adminmang', async (req: any, res: any) => {
    res.sendFile(__dirname + '/public/adminmang.html');
})

app.get('/bans', async (req: any, res: any) => {
    res.sendFile(__dirname + '/banned.txt')
});

app.get('/js/indexjs.js', async (req: any, res: any) => {
    res.sendFile(__dirname + '/public/js/indexjs.js');
});

app.get('/js/adminmangjs.js', async (req: any, res: any) => {
    res.sendFile(__dirname + '/public/js/adminmangjs.js');
});

app.get('/admins', async (req: any, res: any) => {
    res.sendFile(__dirname + '/admins.txt')
})

app.get('/superusers', async (req: any, res: any) => {
    res.sendFile(__dirname + '/superusers.txt')
})

app.get('*', async (req: any, res: any) => {
    res.sendFile(__dirname + '/public/404.html')
})