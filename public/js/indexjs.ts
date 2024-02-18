document.getElementById("banthem")?.addEventListener('click', (e) => {
    var checkbox: any = document.getElementById("unban");
    var auth: any = document.getElementById("auth");
    var userid: any = document.getElementById("userid");
    var div: any = document.getElementById("successes");
    if(!checkbox || !auth || !userid || !userid.value || !auth.value || !div) {
        return;
    }
    if(checkbox.checked !== true) {
        fetch('/ban', {
            method: 'POST',
            headers: new Headers({
                'auth': auth.value,
                'userid': userid.value
            })
        }).then((res) => {
            if(res.status == 200) {
                var tring = document.createElement('li');
                tring.innerHTML = "Successfully banned " + userid.value;
                div.appendChild(tring);
                return;
            }
            var tring = document.createElement('li');
            tring.innerHTML = "failed to ban " + userid.value;
            div.appendChild(tring);
        })
    } else {
        fetch('/unban', {
                method: 'POST',
                headers: new Headers({
                    'auth': auth.value,
                    'userid': userid.value
                })
            }).then((res) => {
                if(res.status == 200) {
                    var tring = document.createElement('li');
                    tring.innerHTML = "Successfully unbanned " + userid.value;
                    div.appendChild(tring);
                    return;
                }
                var tring = document.createElement('li');
                tring.innerHTML = "failed to unban " + userid.value;
                div.appendChild(tring);
            })
    }
});