(function () {
    "use strict";
    var count = 0;

    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;

    WinJS.UI.Pages.define("/pages/itemDetail/itemDetail.html", {
        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        _items : null,

        _itemInvoked: function (args) {
            var item = this._items.getAt(args.detail.itemIndex);
            WinJS.Navigation.navigate("/pages/itemDetail/itemDetail.html", { item: Data.getItemReference(item) });
        },

        _initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            if (viewState === appViewState.snapped) {
                listView.layout = new ui.ListLayout();
            } else {
                listView.layout = new ui.GridLayout({ groupHeaderPosition: "left" });
            }
        },


        ready: function (element, options) {
            
            var item = options && options.item ? Data.resolveItemReference(options.item) : Data.items.getAt(0);
            element.querySelector(".titlearea .pagetitle").textContent = item.group.title;
            element.querySelector("article .item-title").textContent = item.title;
            element.querySelector("article .item-subtitle").textContent = item.subtitle;
            element.querySelector("article .item-image").src = item.backgroundImage;
            element.querySelector("article .item-image").alt = item.subtitle;
            element.querySelector("article .item-content").innerHTML = item.content;



            if (item.hasOwnProperty("comments")) {
                var itemCommentsList = element.querySelector(".itemCommentsList").winControl;
                this._items = Data.getItemCommentsFromList(item);
                var pageList = this._items.createGrouped(
                    function groupKeySelector(item) { return item.comments.key; },
                    function groupDataSelector(item) { return item.comments; }
                );
                itemCommentsList.itemDataSource = pageList.dataSource;
                itemCommentsList.itemTemplate = element.querySelector(".itemtemplate");
                //itemContentList.groupDataSource = pageList.groups.dataSource;
                //itemContentList.groupHeaderTemplate = element.querySelector(".headertemplate");
                itemCommentsList.oniteminvoked = this._itemInvoked.bind(this);
                this._initializeLayout(itemCommentsList, Windows.UI.ViewManagement.ApplicationView.value);
                //itemCommentsList.element.focus();
            }
            else {
                element.querySelector(".content").focus();
            }
        }
    });
})();
