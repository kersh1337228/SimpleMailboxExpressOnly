class Login {
    constructor() {
        this.state = {
            errors: {}
        }
        this.login = this.login.bind(this)
        this.render()
    }

    setState(state) {
        this.state = state
        this.render()
    }

    async login(event) {
        event.preventDefault()
        const request = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries((new FormData(event.target)).entries()))
        })
        const response = await request.json()
        console.log(response)
        if (!request.ok) {
            let state = this.state
            state.errors = response.errors
            this.setState(state)
        } else {
            localStorage.setItem('token', response.token)
            localStorage.setItem('username', response.username)
            window.location.href = '/mail/list'
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


const login = new Login()
document.querySelector('.sign_form').addEventListener('submit', login.login)
