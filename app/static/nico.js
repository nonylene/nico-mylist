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
    requestMove([id], category)
  });

  $('.reload').click(function(){
    var id = $(this).attr('num');
    requestReload([id])
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
      if (confirm("success! Go to top?")) {
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
      var ids = $('input:checkbox:checked').map(function(){
        checkid =  $(this).attr('id');
        return checkid.slice(5)
      }).get();
      requestMove(ids, category)
    }else{
      alert('all には移動できません');
    }
  });

  $('#reloadchk').click(function(){
    var ids = $('input:checkbox:checked').map(function(){
      checkid =  $(this).attr('id');
      return checkid.slice(5)
    }).get();
    requestReload(ids)
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

  function requestMove(ids, category) {
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
  }

  function requestReload(ids) {
    $.ajax({
      type: 'POST',
      url: 'reload',
      data: {
        'id': JSON.stringify(ids),
      }
    }).done(function(data){
      if (confirm("success! reload?")) {
        location.reload()
      }
    });
  }
});
