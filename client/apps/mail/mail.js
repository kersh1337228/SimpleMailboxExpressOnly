class MailList {
    constructor() {
        this.state = {
            mail: {
                list: [],
                selected: []
            },
            sort: {
                field: 'date',
                invert: false
            },
            text: '',
            errors: {},
        }
        this.sendEmail = this.sendEmail.bind(this)
        this.filter = this.filter.bind(this)
        this.sort = this.sort.bind(this)
        this.delete = this.delete.bind(this)
        this.check = this.check.bind(this)
        this.forward = this.forward.bind(this)
        this.reply = this.reply.bind(this)
        this.select = this.select.bind(this)
        this.selectAll = this.selectAll.bind(this)
        this.showSendForm = this.showSendForm.bind(this)
        this.list()
    }

    setState(state) {
        this.state = state
        this.render()
    }

    async list() {
        const request = await fetch('/mail/api/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
        const response = await request.json()
        if (!request.ok) {
            if (response === 'TokenError') {
                localStorage.clear()
                window.location.href = '/auth/login'
            } else {
                let state = this.state
                state.errors = response.errors
                this.setState(state)
            }
        } else {
            let state = this.state
            state.mail.list = response
            this.setState(state)
        }
    }

    async filter(event) {
        const request = await fetch(`/mail/api/list/${event.target.value}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
        const response = await request.json()
        if (!request.ok) {
            if (response === 'TokenError') {
                localStorage.clear()
                window.location.href = '/auth/login'
            } else {
                let state = this.state
                state.errors = response.errors
                this.setState(state)
            }
        } else {
            let state = this.state
            state.mail.list = response
            this.setState(state)
        }
    }

    async sendEmail(event) {
        event.preventDefault()
        const request = await fetch('/mail/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(Object.fromEntries((new FormData(event.target)).entries()))
        })
        const response = await request.json()
        if (!request.ok) {
            if (response === 'TokenError') {
                localStorage.clear()
                window.location.href = '/auth/login'
            } else {
                let state = this.state
                state.errors = response.errors
                this.setState(state)
            }
        } else {
            window.location.reload()
        }
    }

    async delete() {
        const request = await fetch(`/mail/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(this.state.mail.selected)
        })
        const response = await request.json()
        if (!request.ok) {
            if (response === 'TokenError') {
                localStorage.clear()
                window.location.href = '/auth/login'
            } else {
                let state = this.state
                state.errors = response.errors
                this.setState(state)
            }
        } else {
            let state = this.state
            state.mail.list = state.mail.list.filter(email => !state.mail.selected.includes(email))
            state.mail.selected = []
            this.setState(state)
        }
    }

    async check(letter) {
        const request = await fetch(`/mail/check`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(letter)
        })
        const response = await request.json()
        if (!request.ok) {
            if (response === 'TokenError') {
                localStorage.clear()
                window.location.href = '/auth/login'
            } else {
                let state = this.state
                state.errors = response.errors
                this.setState(state)
            }
        } else {
            let state = this.state
            state.mail.list[state.mail.list.indexOf(letter)].checked = true
            try {state.mail.selected[state.mail.selected.indexOf(letter)].checked = true} catch (error) {}
            this.setState(state)
        }
    }

    forward(letter) {
        let state = this.state
        state.text = `Forwarded email\n\nFrom:   ${letter.sender.username}\nTo:     ${letter.recipient.username}\nTitle:  ${letter.title}\nDate:   ${new Date(letter.sending_time).toLocaleString()}\n\n${letter.text}`
        this.setState(state)
        document.querySelector('.mail_create_form input[name=recipient_username]').value = ''
        let send_form = document.querySelector('.mail_create_form')
        if (send_form.style.display === 'none') {
            send_form.style.display = 'flex'
        }
        const event = document.createEvent('HTMLEvents')
        event.initEvent('input', true, true)
        document.querySelector('.mail_create_form textarea').dispatchEvent(event)
    }

    reply(letter) {
        let state = this.state
        state.text = `Reply to email\n\nFrom:   ${letter.sender.username}\nTo:     ${letter.recipient.username}\nTitle:  ${letter.title}\nDate:   ${new Date(letter.sending_time).toLocaleString()}\n\n`
        this.setState(state)
        document.querySelector('.mail_create_form input[name=recipient_username]').value = letter.recipient.username
        let send_form = document.querySelector('.mail_create_form')
        if (send_form.style.display === 'none') {
            send_form.style.display = 'flex'
        }
        const event = document.createEvent('HTMLEvents')
        event.initEvent('input', true, true)
        document.querySelector('.mail_create_form textarea').dispatchEvent(event)
    }

    showLetter(letter) {
        let [letter_element, letter_detail] = [
            document.querySelector(`#${letter.id} .mail_list_letter`),
            document.querySelector(`.${letter.id} .mail_detail`)
        ]
        if (letter_detail.style.display === 'none') {
            letter_detail.style.display = 'inherit'
            letter_element.style.borderRadius = '7px 7px 0 0'
        } else {
            letter_detail.style.display = 'none'
            letter_element.style.borderRadius = '7px'
        }
    }

    showSendForm(event) {
        let send_form = document.querySelector('.mail_create_form')
        if (send_form.style.display === 'none') {
            send_form.style.display = 'flex'
            event.target.innerText = 'Cancel'
        } else {
            send_form.style.display = 'none'
            event.target.innerText = 'Write an email'
            let state = this.state
            state.text = document.querySelector('.mail_create_form textarea').value
            this.setState(state)
        }
    }

    select(event, letter) {
        let state = this.state
        if (event.target.checked) {
            state.mail.selected.push(letter)
        } else {
            state.mail.selected.splice([state.mail.selected.indexOf(letter)], 1)
        }
        this.setState(state)
    }

    selectAll(event) {
        let state = this.state
        if (event.target.checked) {
            state.mail.selected = Object.assign(state.mail.list)
        } else {
            state.mail.selected = []
        }
        this.setState(state)
    }

    sort(event) {
        const parameter = event.target.parentElement.innerHTML.split(' ')[0].toLowerCase()
        let [state, sortCallback] = [this.state, () => {}]
        switch (parameter) {
            case 'date':
                sortCallback = (a, b) => {
                    if (state.sort.invert) {
                        return new Date(a.sending_time) < new Date(b.sending_time) ?
                            1 : new Date(a.sending_time) > new Date(b.sending_time) ? -1 : 0
                    } else {
                        return new Date(a.sending_time) > new Date(b.sending_time) ?
                            1 : new Date(a.sending_time) < new Date(b.sending_time) ? -1 : 0
                    }
                }
                break
            case 'title':
                sortCallback = (a, b) => {
                    if (state.sort.invert) {
                        return a.title < b.title ? 1 : a.title > b.title ? -1 : 0
                    } else {
                        return a.title > b.title ? 1 : a.title < b.title ? -1 : 0
                    }
                }
                break
            default:
                sortCallback = (a, b) => {
                    if (state.sort.invert) {
                        return a[parameter].username < b[parameter].username ?
                            1 : a[parameter].username > b[parameter].username ? -1 : 0
                    } else {
                        return a[parameter].username > b[parameter].username ?
                            1 : a[parameter].username < b[parameter].username ? -1 : 0
                    }
                }
        }
        state.mail.list = state.mail.list.sort(sortCallback)
        state.sort = {
            field: parameter,
            invert: !state.sort.invert
        }
        event.target.innerText = state.sort.invert ? '▴' : '▾'
        this.setState(state)
    }

    textSize(event) {
        event.target.style.height = 'auto'
        event.target.style.height = (event.target.scrollHeight * 0.87) + 'px'
    }

    render() {
        document.querySelectorAll('.errors_list').forEach(list => list.remove())
        if (Object.keys(this.state.errors).length) {
            for (const [field_name, errors] of Object.entries(this.state.errors)) {
                let field = document.querySelector(`.mail_create_form input[name=${field_name}]`)
                field.insertAdjacentHTML('beforebegin',`
                    <ul class='errors_list'></ul>
                `)
                for (const error of errors) {
                    const errors_list = field.parentElement.querySelector(':scope .errors_list')
                    errors_list.insertAdjacentHTML('afterbegin', `<li>${error}</li>`)
                }
            }
        }
        document.querySelector('.delete_button button').style.display = this.state.mail.selected.length ? 'initial' : 'none'
        if (this.state.mail.list.length) {
            document.querySelector('.mail_list ul').innerHTML = ''
            for (const letter of this.state.mail.list) {
                document.querySelector('.mail_list ul').insertAdjacentHTML('afterbegin', `
                    <li id="${letter.id}">
                        <ul class='${localStorage.username !== letter.recipient.username ?
                    'mail_list_letter' : letter.checked ? 'mail_list_letter' : 'mail_list_letter unchecked'}'>
                            <li class='letter_check'>
                                <input type='checkbox' ${this.state.mail.selected.includes(letter) ? 'checked' : ''}>
                            </li>
                            <li><button class="forward_button">Forward</button></li>
                            <li>${letter.sender.username !== localStorage.getItem('username') ? '<button class="reply_button">Reply</button>' : ''}</li>
                            <li>${letter.sender.username}</li>
                            <li>${letter.recipient.username}</li>
                            <li>${letter.title}</li>
                            <li class='letter_date'>${new Date(letter.sending_time).toLocaleString()}</li>
                        </ul>
                    </li>
                    <li class="${letter.id}">
                        <div class='mail_detail' style="display: none">
                            <h2>${letter.title}</h2>
                            <div>From: ${letter.sender.username}</div>
                            <div>To: ${letter.recipient.username}</div>
                            <div>Date: ${new Date(letter.sending_time).toLocaleString()}</div>
                            <div class='letter_text'>${letter.text}</div>
                        </div>
                    </li>
                `)
                document.querySelector(`#${letter.id} .mail_list_letter`).addEventListener('click', event => {
                    this.showLetter(letter)
                })
                document.querySelector(`#${letter.id} input[type=checkbox]`).addEventListener(
                    'change', event => {this.select(event, letter)}
                )
                document.querySelector(`#${letter.id} input[type=checkbox]`).addEventListener(
                    'click', event => {event.stopPropagation()}
                )
                if (!letter.checked && letter.sender.username !== localStorage.getItem('username')) {
                    document.querySelector(`#${letter.id}`).addEventListener(
                        'click', () => {this.check(letter)}
                    )
                }
                document.querySelector(`#${letter.id} .forward_button`).addEventListener('click', event => {
                    event.stopPropagation()
                    this.forward(letter)
                })
                try {
                    document.querySelector(`#${letter.id} .reply_button`).addEventListener('click', event => {
                        event.stopPropagation()
                        this.reply(letter)
                    })
                } catch (error) {}
            }
        } else {
            document.querySelector('.mail_list').innerHTML = 'No emails yet'
        }
        document.querySelector('.mail_list_header input[type=checkbox]').checked =
            this.state.mail.list.every(element => this.state.mail.selected.includes(element)) && this.state.mail.list.length
        document.querySelector('.mail_create_form textarea').value = this.state.text
    }
}


const mail_list = new MailList()
document.querySelector('.mail_create_form').addEventListener('submit', mail_list.sendEmail)
document.querySelector('.mail_create_button').addEventListener('click', mail_list.showSendForm)
for (const option of document.querySelectorAll('.filter_list li input')) {
    option.addEventListener('change', mail_list.filter)
}
document.querySelector('.mail_list_header input[type=checkbox]').addEventListener('click', mail_list.selectAll)
document.querySelector('.delete_button button').addEventListener('click', mail_list.delete)
document.querySelector('.mail_create_form textarea').addEventListener('input', mail_list.textSize)
document.querySelector('.mail_create_form textarea').addEventListener('paste', mail_list.textSize)
for (const span of document.querySelectorAll('.mail_list_header li span')) {
    span.addEventListener('click', mail_list.sort)
}
