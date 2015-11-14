$(function(){
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

  $('#add').click(function(){
    smid = $("#addsm").val()
    $.ajax({
      type: 'POST',
      url: 'add',
      data: {
        'smid': smid,
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
