var apiVersion = 'v30.0',
loginUrl = 'https://login.salesforce.com/',
redirectURI = 'https://flybyus.herokuapp.com/:3000/oauthcallback.html',
proxyURL = 'https://flybyus.herokuapp.com/:3000/proxy/',
client = new forcetk.Client(clientId, loginUrl, proxyURL);

function login() {
    var url = loginUrl + 'services/oauth2/authorize?display=popup&response_type=token'
                + '&client_id=' + encodeURIComponent(clientId)
                + '&redirect_uri=' + encodeURIComponent(redirectURI);
    window.open(url);
}
function oauthCallback(response) {
    if (response && response.access_token) {
        client.setSessionToken(response.access_token,
                               apiVersion,
                               response.instance_url);
        console.log('OAuth authentication succeeded');
        getSessions();
    } else {
        alert("AuthenticationError: No Token");
    }
}

function getSessions() {
    var soql = "SELECT Id, Name, Flug_Datum__c FROM Flug__c",
        html = '';
    client.query(soql,
        function (data) {
            var sessions = data.records;
            for (var i=0; i<sessions.length; i++) {
                html += '<li class="table-view-cell">' + sessions[i].Name + '</li>';
            }
            $('.session-list').html(html);
        },
        function (error) {
            alert("Error: " + JSON.stringify(error));
        });
    return false;
}

function showSessionList() {
    getSessionList(
        function (data) {
            var sessions = data.records,
                html = '';
            for (var i=0; i<sessions.length; i++) {
                html += '<li class="table-view-cell"><a href="#sessions/'+ sessions[i].Session__r.Id +'">' + sessions[i].Session__r.Name + '</a></li>';
            }
            html =
                '<div class="page">' +
                '<header class="bar bar-nav">' +
                    '<h1 class="title">Sessions</h1>' +
                '</header>' +
                '<div class="content">' +
                    '<ul class="table-view session-list">' + html + '</ul>' +
                '</div>' +
                '</div>';
            slider.slidePage($(html));
        },
        function (error) {
            alert("Error: " + JSON.stringify(error));
        });
    return false;
}



  login();