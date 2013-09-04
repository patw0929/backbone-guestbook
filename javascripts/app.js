$.fn.serializeObject = function() {
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
      if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
              o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
      } else {
          o[this.name] = this.value || '';
      }
  });
  return o;
};

var htmlEncode = function (value) {
    return $('<div />').text(value).html();
};

var changeNavFocus = function (menu) {
    $('.nav').find('li').removeClass('active');
    $(menu).parent().addClass('active');    
};

var Datas = Backbone.Collection.extend({

    url: 'api_data',
    comparator: function (data) {
        return -1 * (new Date(data.get('datetime')).getTime());
    }

});

var Data = Backbone.Model.extend({

    url: 'api_data'

});

var DataList = Backbone.View.extend({

    el: $('.main'),
    render: function () {
        var that = this;
        changeNavFocus('.btn-list');
        var datas = new Datas();
        datas.fetch({
            success: function () {
                var template = _.template($("#list-template").html(), { datas: datas.models });
                that.$el.html(template);
            }
        });  
    }

});

var SignView = Backbone.View.extend({

    el: $('.main'),
    render: function () {
        var that = this;
        changeNavFocus('.btn-sign');
        var template = _.template($("#sign-template").html());
        that.$el.html(template);
    },
    events: {
        'submit .sign-form': 'saveData',
        'click .back': 'backList'
    },
    saveData: function (e) {
        var dataDetail = $(e.currentTarget).serializeObject();
        var data = new Data();
        data.save(dataDetail, {
            success: function (data) {
                alert('Success!');
                router.navigate('', {trigger: true});
            }
        });
        return false;
    },
    backList: function (e) {
        e.preventDefault();
        router.navigate('', {trigger: true});
    }
});

var About = Backbone.View.extend({

    el: $('.main'),
    render: function () {
        changeNavFocus('.btn-about');
        var about = $('#about').html();
        this.$el.html(about);
    }

});

var Router = Backbone.Router.extend({
    routes: {
        '': 'list',
        'sign': 'sign',
        'about': 'about'
    }
});

var dataList = new DataList();
var sign = new SignView();
var about = new About();

var router = new Router();
router.on('route:sign', function () {
    sign.render();
});

router.on('route:list', function () {
    dataList.render();
});

router.on('route:about', function () {
    about.render();
});

Backbone.history.start();