;(function (define) {

define(['jquery', 'backbone'], function ($, Backbone) {
   'use strict';

    return Backbone.View.extend({

        el: '#discovery-form',
        events: {
            'submit form': 'submitForm',
            'click #discovery-clear': 'clearAll'
        },

        initialize: function () {
            this.$searchField = this.$el.find('input');
            this.$searchButton = this.$el.find('button');
            this.$message = this.$el.find('#discovery-message');
            this.$clearAll = this.$el.find('#discovery-clear');
            this.$loadingIndicator = this.$el.find('#loading-indicator');
            this.errorTemplate = _.template($('#error-tpl').html());
            this.notFoundTemplate = _.template($('#not_found-tpl').html());
        },

        submitForm: function (event) {
            event.preventDefault();
            this.doSearch();
        },

        doSearch: function (term) {
            if (term) {
                this.$searchField.val(term);
            }
            else {
                term = this.$searchField.val();
            }

            var trimmed = $.trim(term);
            if (trimmed) {
                this.trigger('search', trimmed);
            }
            this.$message.empty();
        },

        clearSearch: function () {
            this.$searchField.val('');
        },

        showClearAllButton: function () {
            this.$clearAll.removeClass('hidden');
        },

        hideClearAllButton: function() {
            this.$clearAll.addClass('hidden');
        },

        showLoadingIndicator: function () {
            this.$loadingIndicator.removeClass('hidden');
        },

        hideLoadingIndicator: function () {
            this.$loadingIndicator.addClass('hidden');
        },

        clearAll: function () {
            this.hideClearAllButton();
            this.clearSearch();
            this.trigger('clear');
            return false;
        },

        showNotFoundMessage: function (searchTerm) {
            var msg = this.notFoundTemplate({term: searchTerm});
            this.$message.html(msg);
            this.hideClearAllButton();
        },

        showErrorMessage: function () {
            var msg = this.errorTemplate();
            this.$message.html(msg);
        }

    });

});

})(define || RequireJS.define);
