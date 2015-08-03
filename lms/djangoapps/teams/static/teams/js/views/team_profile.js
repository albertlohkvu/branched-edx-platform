/**
 * View for an individual team.
 */
;(function (define) {
    'use strict';
    define(['backbone', 'underscore', 'gettext', 'teams/js/views/team_discussion',
            'text!teams/templates/team-profile.underscore',
            'text!teams/templates/team-member.underscore'
        ],
        function (Backbone, _, gettext, TeamDiscussionView, team_template, teamMemberTemplate) {
            var TeamProfileView = Backbone.View.extend({
                initialize: function (options) {
                    this.courseID = options.courseID;
                    this.discussionTopicID = this.model.get('discussion_topic_id');
                    // TODO: remove this once the discussion ID works from the server!
                    if (!this.discussionTopicID) {
                        this.discussionTopicID = '7065c53dcac4fe469fb66997da075f9af7e760a9';
                    }
                    this.maxTeamSize = options.maxTeamSize;
                    this.memberships = this.model.get('membership');
                    this.currentUsername = options.currentUsername;
                },

                render: function () {
                    this.$el.html(_.template(team_template, {
                        courseID: this.courseID,
                        discussionTopicID: this.discussionTopicID,
                        country: this.model.get('country'),
                        language: this.model.get('language'),
                        membershipText: interpolate(
                            // Translators: The following message displays the number of members on a team.
                            ngettext(
                                '%(member_count)s / %(max_member_count)s Member',
                                '%(member_count)s / %(max_member_count)s Members',
                                this.maxTeamSize
                            ),
                            {member_count: this.memberships.length, max_member_count: this.maxTeamSize}, true
                        ),
                        isMember: this.isUserMemberOfTeam()

                    }));
                    this.discussionView = new TeamDiscussionView({
                        el: this.$('.discussion-module')
                    });
                    this.discussionView.render();

                    this.renderTeamMembers();
                    return this;
                },

                renderTeamMembers: function() {
                    var view = this;
                    _.each(this.memberships, function(data) {
                        $.ajax({
                            type: 'GET',
                            url: data.user.url,
                            success: function (data) {
                                if (data.profile_image) {
                                    view.$('.members-info').append(_.template(teamMemberTemplate, {
                                        imageUrl: data.profile_image.image_url_medium,
                                        username: data.username,
                                        memberProfileUrl: '/u/' + data.username
                                    }));
                                }
                            },
                            error: function () {
                                // TODO add error code here.
                            }
                        });

                    });
                },
                isUserMemberOfTeam: function() {
                    var self = this;
                    var member = _.find(this.memberships, function (member) {
                        return member.user.id === self.currentUsername
                    });
                    return member ? true : false;
                }
            });

            return TeamProfileView;
        });
}).call(this, define || RequireJS.define);
