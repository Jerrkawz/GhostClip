function submit() {
    const name = $('#clipName').val();
    const clip = $('#clipBody').val();
    console.log({name, clip});

    $.ajax({
        url: `/${name}`,
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({name, clip})
    }).done(handleSuccessState.bind(null, name))
      .fail(handleErrorState);
}

function handleSuccessState(name) {
    window.history.pushState(name, name, `\\${name}`);
    $('#alert').html(
    `<div class="alert alert-success" role="alert">
        Clip was sucessfully created at the current url: ${window.location}. Important: This is a one time temporary note.
        If you refresh this page it will read and consume the note. If you are using this for the 'UI for HomeAssistant' app then the app will
        read and delete this note for you.
    </div>`);
}

function handleErrorState(res, type, errorMsg) {
    $('#alert').html(
        `<div class="alert alert-danger" role="alert">
            ${res.responseText || errorMsg}
        </div>`);
}