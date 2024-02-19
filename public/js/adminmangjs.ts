document.getElementById("adminthem")?.addEventListener('click', (e) => {
    var checkbox: any = document.getElementById("su");
    var auth: any = document.getElementById("auth");
    var userid: any = document.getElementById("userid");
    var div: any = document.getElementById("successes");
    if(!checkbox || !auth || !userid || !userid.value || !auth.value || !div ) {
        return;
    }
    if(checkbox.checked) {
        fetch('/makeadmin', {
            method: 'POST',
            headers: new Headers({
                'superauth': auth.value,
                'userid': userid.value,
                'makesu': "true"
            })
        }).then((res) => {
            if(res.status == 200) {
                var tring = document.createElement('li');
                tring.innerHTML = "Successfully made " + userid.value + " a superuser";
                auth.appendChild(tring);
                return;
            }
            var tring = document.createElement('li');
            tring.innerHTML = "failed to make " + userid.value + " a superuser";
            div.appendChild(tring);
        }).catch((res) => {
            var tring = document.createElement('li');
            tring.innerHTML = "failed to make " + userid.value + " a superuser (" + res + ")";
            div.appendChild(tring);
        })
        return;
    }
    fetch('/makeadmin', {
        method: 'POST',
        headers: new Headers({
            'superauth': auth.value,
            'userid': userid.value
        })
    }).then((res) => {
        if(res.status == 200) {
            var tring = document.createElement('li');
            tring.innerHTML = "Successfully made " + userid.value + " an admin";
            auth.appendChild(tring);
            return;
        }
        var tring = document.createElement('li');
        tring.innerHTML = "failed to make " + userid.value + " an admin";
        div.appendChild(tring);
    }).catch((res) => {
        var tring = document.createElement('li');
        tring.innerHTML = "failed to make " + userid.value + " an admin (" + res + ")";
        div.appendChild(tring);
    })
})

document.getElementById("demotethem")?.addEventListener('click', (e) => {
    var auth: any = document.getElementById("auth2");
    var userid: any = document.getElementById("userid2");
    var div: any = document.getElementById("successes");

    if(!auth || !userid || !userid.value || !auth.value || !div ) {
        return;
    }

    fetch('/demote', {
        method: 'POST',
        headers: new Headers({
            'superauth': auth.value,
            'userid': userid.value
        })
    }).then((res) => {
        if(res.status == 200) {
            var tring = document.createElement('li');
            tring.innerHTML = "Successfully demoted " + userid.value;
            auth.appendChild(tring);
            return;
        }
        var tring = document.createElement('li');
        tring.innerHTML = "failed to demote " + userid.value;
        div.appendChild(tring);
    }).catch((res) => {
        var tring = document.createElement('li');
        tring.innerHTML = "failed to demote " + userid.value + " (" + res + ")";
        div.appendChild(tring);
    })
})