class Register {
    constructor() {
        this.state = {
            errors: {}
        }
        this.register = this.register.bind(this)
        this.passwords = this.passwords.bind(this)
        this.render()
    }

    setState(state) {
        this.state = state
        this.render()
    }

    async register(event) {
        event.preventDefault()
        const request = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries((new FormData(event.target)).entries()))
        })
        const response = await request.json()
        if (!request.ok) {
            let state = this.state
            state.errors = response.errors
            this.setState(state)
        } else {
            window.location.href = '/auth/login'
        }
    }

    passwords() {
        const [password, password_repeat] = [
            document.querySelector('.sign_form').password.value,
            document.querySelector('.sign_form').password_repeat.value
        ]
        console.log(password, password_repeat)
        if (password !== '' && password !== password_repeat) {
            let state = this.state
            state.errors = {
                password_repeat: ['Passwords do not match']
            }
            this.setState(state)
        } else {
            let state = this.state
            state.errors = {}
            this.setState(state)
        }
    }

    render() {
        document.querySelectorAll('.errors_list').forEach(list => list.remove())
        if (Object.keys(this.state.errors).length) {
            for (const [field_name, errors] of Object.entries(this.state.errors)) {
                let field = document.querySelector(`.sign_form input[name=${field_name}]`)
                field.insertAdjacentHTML('beforebegin',`
                    <ul class='errors_list'></ul>
                `)
                for (const error of errors) {
                    const errors_list = field.parentElement.querySelector(':scope .errors_list')
                    errors_list.insertAdjacentHTML('afterbegin', `<li>${error}</li>`)
                }
            }
        }
    }
}


const register = new Register()
document.querySelector('.sign_form').addEventListener('submit', register.register)
document.querySelector('.sign_form input[name=password]').addEventListener('input', register.passwords)
document.querySelector('.sign_form input[name=password]').addEventListener('paste', register.passwords)
document.querySelector('.sign_form input[name=password_repeat]').addEventListener('input', register.passwords)
document.querySelector('.sign_form input[name=password_repeat]').addEventListener('paste', register.passwords)
