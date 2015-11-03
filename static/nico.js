$(function(){
  /*CSRF*/
  function getCookie(name) {
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = jQuery.trim(cookies[i]);
              // Does this cookie string begin with the name we want?
              if (cookie.substring(0, name.length + 1) == (name + '=')) {
                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      return cookieValue;
  }
  var csrftoken = getCookie('csrftoken');

  function csrfSafeMethod(method) {
      // these HTTP methods do not require CSRF protection
      return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }

  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      }
  });


  $('.delete').click(function(){
    id = $(this).attr('num')
    $.ajax({
      type: 'POST',
      url: 'delete',
      data: {
        'id': id,
      }
    }).done(function(data){
      $('#wrapper').append(data);
    });
  });

  $('.move').click(function(){
    id = $(this).attr('num');
    category = $('#catsel' + id).val();
    if (category == 'new'){
      category = $('#form' + id).val();
    }
    $.ajax({
      type: 'POST',
      url: 'move',
      data: {
        'id': JSON.stringify([id]),
        'category': category,
      }
    }).done(function(data){
      $('#wrapper').append(data);
    });
  });

  $('#move').click(function(){
    category = $('#catsel').val();
    location.href = '?category=' + category ;
  });

  $('#movechk').click(function(){
    category = $('#catsel').val();
    if (category !== "all"){
      var ids = [];
      ids = $('input:checkbox:checked').map(function(){
        checkid =  $(this).attr('id');
        return checkid.slice(5)
      }).get();
      $.ajax({
        type: 'POST',
        url: 'move',
        data: {
        'id': JSON.stringify(ids),
        'category': category,
        }
      }).done(function(data){
        $('#wrapper').append(data);
      });
    }else{
      alert('all には移動できません');
    }
  });

  $('#chkall').click(function(){
    $('input:checkbox:not(:checked)').map(function(){
      $(this).prop('checked',true);
    })
  });

  $('#unchk').click(function(){
    $('input:checkbox:checked').map(function(){
      $(this).prop('checked',false);
    })
  });
});
