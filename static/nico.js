$(function(){
  $('.delete').click(function(){
    var id = $(this).attr('num')
    $.ajax({
      type: 'POST',
      url: 'delete',
      data: {
        'id': id,
      }
    }).done(function(data){
      $('#info' + data["message"]).remove()
    });
  });

  $('.move').click(function(){
    var id = $(this).attr('num');
    var category = $('#catsel' + id).val();
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
      data["message"].forEach(function(removeId) {
        $('#info' + removeId).remove()
      })
    });
  });

  $('#add').click(function(){
    var smid = $("#addsm").val()
    $.ajax({
      type: 'POST',
      url: 'add',
      data: {
        'smid': smid,
      }
    }).done(function(data){
      if (confirm("success! reload?")) {
        location.href = '?category=None'
      }
    }).fail(function(data){
      alert("error!: " + data.responseJSON["error_message"])
    });
  });

  $('#move').click(function(){
    var category = $('#catsel').val();
    location.href = '?category=' + category ;
  });

  $('#movechk').click(function(){
    var category = $('#catsel').val();
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
        data["message"].forEach(function(removeId) {
          $('#info' + removeId).remove()
        })
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
