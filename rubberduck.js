(function($, _, Backbone) {
  "use strict";

  var app = app || {};

  var ChatMessage = Backbone.Model.extend({
    defaults: {
      name: "Duck",
      content: "",
      timeSent: "Now"
    }
  });

  var ChatMessageView = Backbone.View.extend({
    tagName: "p",

    chatTemplate: _.template("<%= name %>: <%= content %> <small class='pull-right timeText'><%= timeSent %>"),

    render: function() {
      this.$el.html(this.chatTemplate(this.model.attributes));
      return this;
    }
  });

  var MessageCollection = Backbone.Collection.extend({
    model: ChatMessage
  });

  var DuckView = Backbone.View.extend({
    duckSayings: [
      "Hmmm.",
      "Okay.",
      "I see.",
      "Alright.",
      "Interesting.",
      "OK",
      "I'm with you.",
      "Following.",
      "Huh.",
    ],

    addDuckMessage: function() {
      var message = this.pickDuckMessage();
      app.messageCollection.add(new ChatMessage({content: message}));
    },

    el: "#duckContainer",

    events: {
      "submit form": "handleFormSubmit",
      "click #resetTranscript": "resetMessageCollection"
    },

    resetMessageCollection: function() {
      app.messageCollection.reset();
      this.$history.html("");
      resetTimeout(this.duckTimeout);
    },

    handleFormSubmit: function(e) {
      e.preventDefault();
      var message = this.$message.val();
      this.$message.val("");
      app.messageCollection.add(new ChatMessage({
        content: message,
        name: "You"
      }));
    },

    initialize: function() {
      this.$message = this.$("#message");
      this.$history = this.$("#duckHistory");
      this.listenTo(app.messageCollection, 'add', this.addMessage);
      this.duckTimeout = null;
    },

    pickDuckMessage: function() {
      return this.duckSayings[Math.floor(Math.random() * this.duckSayings.length)];
    },

    addMessage: function( message ) {
      var messageView = new ChatMessageView({model: message});
      this.$history.prepend(messageView.render().el);
      if (this.duckTimeout) {
        clearTimeout(this.duckTimeout);
      }
      if (message.attributes.name !== "Duck") {
        this.duckTimeout = setTimeout(this.addDuckMessage, 4000);
      }
    }
  });

  app.messageCollection = new MessageCollection();

  var duckView = new DuckView();

  app.messageCollection.add(new ChatMessage({
    content: "I am a well known debugging partner. You load this site and explain your code line by line to me until, at some point, you realise that's not actually what the code does at all. I sit here serenely, with the occasional affirmation, knowing I have helped you on your way.",
    timeSent: "Now"
  }));


})(window.$, window._, window.Backbone);
