const update = document.querySelector('#update-button')
const deleteButton = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')

update.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Darth Vader',
            quote: 'I find your lack of faith disturbing.',
        })
    })
        .then(res => {
            if (res.ok)
                return res.json()
        })
        .then(response => {
            console.log(response)
        })

})

deleteButton.addEventListener('click', _ => {
    console.log('bananas')
    fetch('/quotes', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        })
    })
        .then(res => {
            if (res.ok) return res.json()
        })
        .then(response => {
            if (response === 'No quote to delete') {
                messageDiv.textContent = 'No Darth Vader quote to delete'
            } else {
                window.location.reload(true)
            }
        })
})

// The issue that I was having is trying to get the fetch to return the success message into the dom.
// I'm not totally sure if I was putting the .then in the right place (maybe should be server.js??)
// This is because it was returning a string back -- used Claude to figure this out