Template.defaultBootstrapPaginator.created = function(){
    var self = this;

    if (!this.data.pagination) {
        return;
    }

    this.displayedPages = new ReactiveVar([]);

    this.runOnClick = function(e, clickedPage) {
        if (typeof self.data.onClick === 'function') {
            self.data.onClick(e, self, clickedPage);
        } else {
            e.preventDefault();
        }
    };

    //auto slice displayedPages to fit in one line
    this.autorun(function(){
        if (!self.data.pagination.ready()) {
            return;
        }

        var pageCount = self.data.pagination.totalPages(),
            current = self.data.pagination.currentPage(),
            displayedPages;

        if (pageCount > self.data.limit){
            var min = 0;
            if (current > self.data.limit/2){
                if (current >  pageCount - self.data.limit/2){
                    min = pageCount - self.data.limit;
                }else{
                    min = Math.floor(current - self.data.limit/2);
                }
            }
            displayedPages = getIntArray(min + 1, min + 1 + self.data.limit);
        }else{
            displayedPages = getIntArray(1, pageCount + 1);
        }

        self.displayedPages.set(displayedPages);
    })
};

Template.defaultBootstrapPaginator.helpers({
    hasPages: function () {
        return this.pagination && this.pagination.totalPages() > 1 && this.limit;
    },
    getPaginationClass: function () {
        return this.paginationClass || "pagination";
    },
    getItemClass: function () {
        return this.itemClass || "page-item";
    },
    shouldWrapLinks: function () {
        return this.wrapLinks !== false;
    },
    isActive : function(){
        return this.valueOf() == Template.instance().data.pagination.currentPage();
    },
    pagesToDisplay: function(){
        return Template.instance().displayedPages.get();
    },
    isInFirstPage: function () {
        return this.pagination.currentPage() == 1;
    },
    arePreviousPagesHidden: function () {
        var displayedPages = Template.instance().displayedPages.get();
        return displayedPages && displayedPages.length && displayedPages[0] > 1;
    },
    areNextPagesHidden: function () {
        var displayedPages = Template.instance().displayedPages.get();
        return displayedPages && displayedPages.length && (displayedPages[displayedPages.length - 1] < this.pagination.totalPages());

    },
    isInLastPage: function () {
        return this.pagination.currentPage() == this.pagination.totalPages();
    },
    lastPage: function(){
        return this.pagination.totalPages();
    }
});

Template.defaultBootstrapPaginator.events({
    'click .page-link': function(e, templateInstance){
        if (typeof this.valueOf() === 'number') {
            templateInstance.runOnClick(e, this.valueOf());
            templateInstance.data.pagination.currentPage(this.valueOf());
        }
    },
    'click .previous-page': function(e, templateInstance){
        templateInstance.runOnClick(e, templateInstance.data.pagination.currentPage() - 1);
        templateInstance.data.pagination.currentPage(templateInstance.data.pagination.currentPage() - 1);
    },
    'click .next-page': function(e, templateInstance){
        templateInstance.runOnClick(e, templateInstance.data.pagination.currentPage() + 1);
        templateInstance.data.pagination.currentPage(templateInstance.data.pagination.currentPage() + 1);
    },
    'click .show-prev': function(e, templateInstance){
		e.preventDefault();

        var displayedPages = templateInstance.displayedPages.get(),
            min = Math.max(1, displayedPages[0] - templateInstance.data.limit);

        templateInstance.displayedPages.set(getIntArray(min, min + templateInstance.data.limit));
    },
    'click .show-next': function(e, templateInstance){
		e.preventDefault();

        var pageCount = templateInstance.data.pagination.totalPages(),
            displayedPages = templateInstance.displayedPages.get(),
            min = Math.min(pageCount - templateInstance.data.limit, displayedPages[displayedPages.length - 1]) + 1;

        templateInstance.displayedPages.set(getIntArray(min, min + templateInstance.data.limit));
    }
});

var getIntArray = function(min, max){
    var result = [];
    for (var i = min; i < max; ++i){
        result.push(i);
    }
    return result;
};