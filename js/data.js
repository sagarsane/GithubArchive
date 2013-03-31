(function () {
    "use strict";
    var newLanguagesList = [];
    var newReposList = []
    var newUsersList = [];


    var count = 0;
    var list = new WinJS.Binding.List();
    var commentsList = new WinJS.Binding.List();
    var mediumGray = "", darkgray = "", lightgray = "";
    var sampleGroups = [];

    var itemContent = "<p>Curabitur class aliquam vestibulum nam curae maecenas</p>";
    var itemDescription = "Item Description Here:";
    var groupDescription = ["Group Description for Top Repositories", "Group Description for Top Languages", "Group Description for Top Users"];


    var darkGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3B0cPoPAANMAcOba1BlAAAAAElFTkSuQmCC";
    var lightGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY7h4+cp/AAhpA3h+ANDKAAAAAElFTkSuQmCC";
    mediumGray = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY5g8dcZ/AAY/AsAlWFQ+AAAAAElFTkSuQmCC";

    sampleGroups = [
       { key: "group1", title: "Top Repositories", subtitle: "Most Popular Github Repos for past 1 month", backgroundImage: darkGray, description: groupDescription[0] },
       { key: "group2", title: "Top Languages", subtitle: "Most Popular Languages on Github for past 1 month", backgroundImage: lightGray, description: groupDescription[1] },
       { key: "group3", title: "Top Users", subtitle: "Most Popular Users/Contributers on Github for past 1 month", backgroundImage: mediumGray, description: groupDescription[2] }
    ];


    var sampleItems = [
       /* { group: sampleGroups[0], title: "Test", subtitle: "Test", description: itemDescription, content: itemContent, backgroundImage: lightGray },*/
    ];

    var list = getData();
    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );
   
   
    function getData() {

        var data = sampleItems;

        
        var retData = new WinJS.Binding.List();
        $.each(data, function (index, entry) {
            retData.push(entry);
        });
        
        getUsersData();
        getReposData();
        getLanguagesData();





        return retData;




    }


    function setTileUpdates(datalist) {

        var notifications = Windows.UI.Notifications;

        for (var i = 0; i < 5; i++) {
            notifications.TileUpdateManager.createTileUpdaterForApplication().enableNotificationQueue(true);

            var template = notifications.TileTemplateType.tileWideImageAndText01;
            var tileXml = notifications.TileUpdateManager.getTemplateContent(template);

            var tileTextAttributes = tileXml.getElementsByTagName("text");
            tileTextAttributes[0].appendChild(tileXml.createTextNode(datalist[i].title));

            var tileImageAttributes = tileXml.getElementsByTagName("image");
            tileImageAttributes[0].setAttribute("src", "http://www.gravatar.com/avatar/" + datalist[i].gravatarId);
            tileImageAttributes[0].setAttribute("alt", "red graphic");

            var squareTemplate = notifications.TileTemplateType.tileSquareText04;
            var squareTileXml = notifications.TileUpdateManager.getTemplateContent(squareTemplate);

            var squareTileTextAttributes = squareTileXml.getElementsByTagName("text");
            squareTileTextAttributes[0].appendChild(squareTileXml.createTextNode(datalist[i].title));

            var node = tileXml.importNode(squareTileXml.getElementsByTagName("binding").item(0), true);
            tileXml.getElementsByTagName("visual").item(0).appendChild(node);

            var tileNotification = new notifications.TileNotification(tileXml);
            tileNotification.tag = $.trim(datalist[i].subtitle);
            var currentTime = new Date();
            tileNotification.expirationTime = new Date(currentTime.getTime() + 600 * 1000);
            notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
        }
    }

    function getLanguagesData() {
        getAjax("http://abetterportfolio.appspot.com/toplanguages").then(function (request) {
            var top_languages = $.parseJSON(request.response);
            newLanguagesList = [];
            var newLanguage = {};
            $.each(top_languages.rows, function (index, entry) {
                newLanguage = {};
                $.each(entry.f, function (index, entry) {

                    switch (index) {
                        case 0:
                            newLanguage.title = entry.v;
                            break;
                        case 1:
                            newLanguage.content = " -- Total Count: " + entry.v;
                            newLanguage.subtitle = entry.v;
                            newLanguage.description = entry.v;
                            newLanguage.itemContent = entry.v;
                            break;
                    }
                });
                newLanguage.group = sampleGroups[1];
                newLanguage.backgroundImage = darkgray;
                newLanguagesList.push(newLanguage);
                list.push(newLanguage);
            });

            //setTileUpdates(newLanguagesList);
        });
    }


    function getReposData() {
        getAjax("http://abetterportfolio.appspot.com/toprepos").then(function (request) {
            var top_repos = $.parseJSON(request.response);
            newReposList = [];
            var newRepos = {};
            $.each(top_repos.rows, function (index, entry) {
                newRepos = {};
                $.each(entry.f, function (index, entry) {

                    switch (index) {
                        case 0:
                            newRepos.title = entry.v;
                            break;
                        case 3:
                            newRepos.description = entry.v;
                            break;
                        case 2:
                            newRepos.subtitle = "User Name: " + entry.v;
                            break;
                        case 1:
                            newRepos.content = "Number of Pushes: " + entry.v;
                            break;
                        case 4:
                            newRepos.content += " -- " + entry.v;
                            break;
                        case 5:
                            newRepos.content += " -- Language: " + entry.v;
                    }
                });
                newRepos.backgroundImage = lightgray;
                newRepos.group = sampleGroups[0];
                newReposList.push(newRepos);
                list.push(newRepos);
            });
            //setTileUpdates(newReposList);
        });
    }


    function getUsersData() {
        getAjax("http://abetterportfolio.appspot.com/mostactiveusers").then(function (request) {
            var mostactive_users = $.parseJSON(request.response);
            newUsersList = [];
            var newUsers = {};
            $.each(mostactive_users.rows, function (index, entry) {
                newUsers = {};
                $.each(entry.f, function (index, entry) {
                    switch (index) {
                        case 1:
                            newUsers.title = entry.v;
                            break;
                        case 0:
                            var userId = entry.v;
                            newUsers.description = "Github User Id: " + userId;
                            newUsers.subtitle = userId;
                            newUsers.backgroundImage = mediumGray;
                            /* WinJS.xhr({
                                 url: "http://www.gravatar.com/avatar/d5e18ff7e2d01beafbad009dbbec9bd2?s=1024",
                                 type: "GET",
                                 responseType: "blob",
                             })
                             .done(function (request) {
                                 newUsers.backgroundImage = URL.createObjectURL(request.response);
                             });
                            
                             break;*/
                         case 2:
                             newUsers.content = "Number of Code Commits: " + entry.v;
                             break;
                        case 3:
                            newUsers.gravatarId = entry.v;
                            newUsers.backgroundImage = "http://www.gravatar.com/avatar/" + newUsers.gravatarId + "";
                            break;

                    }
                });
                newUsers.group = sampleGroups[2];
                newUsersList.push(newUsers);
                list.push(newUsers);
               // $.merge(sampleItems, newUsersList);
            });
            setTileUpdates(newUsersList);

        });
    }

    function getAjax(url) {
        return WinJS.xhr({
            url: url,
            type: "GET",
            responseType: "json",
        });
    }

    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        getItemCommentsFromList: getItemCommentsFromList,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference,
    });


    function getItemReference(item) {
        return [item.group.key, item.title];
    }

    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    function getItemCommentsFromList(commentList) {
        return commentsList.createFiltered(function (item) { return item.comments.key === commentList.comments.key; });
    }

    function resolveGroupReference(key) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).key === key) {
                return groupedItems.groups.getAt(i);
            }
        }
    }

    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }





})();
