Kurounin:Pagination-Blaze
=================

This package provides a bootstrap 3 paginator Blaze template to be used with the [kurounin:pagination](https://atmospherejs.com/kurounin/pagination) package.

# Usage
```html
{{> defaultBootstrapPaginator pagination=templatePagination limit=10 containerClass="text-center"}}
```

Available template parameters are:
* `pagination`: pagination instance
* `limit`: the maximum number of page links to display
* `containerClass`: optional container class for the paginator