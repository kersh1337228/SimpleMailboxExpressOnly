class Navbar {
    constructor() {
        this.render()
    }

    showTab(event) {
        let tab = event.target.parentElement.querySelector(':scope > .account_container')
        if (tab.style.display === 'none') {
            tab.style.display = 'flex'
        } else {
            tab.style.display = 'none'
        }
    }

    async delete() {
        const request = await fetch(`/auth/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        const response = await request.json()
        if (!request.ok && response === 'TokenError') {
            localStorage.clear()
            window.location.href = '/auth/login'
        } else {
            localStorage.clear()
            window.location.href = '/auth/login'
        }
    }

    render() {
        const navlinks = document.getElementById('navlinks')
        if (localStorage.getItem('token')) {
            navlinks.insertAdjacentHTML('afterbegin', `
                <li><a href="/">Home</a></li>
                <li><a href="/mail/list">Mail</a></li>
            `)
            const username = localStorage.getItem('username')
            navlinks.insertAdjacentHTML('afterend', `
                <div class='account'>
                    <div class='account_nav'>
                        Current account: ${username}
                    </div>
                    <div class='account_container' style='display: none'>
                        <button class="sign_out_button">Sign out</button>
                        <button class="account_delete">Delete account</button>
                    </div>
                </div>
            `)
            document.querySelector('.account_nav').addEventListener('click', this.showTab)
            document.querySelector('.sign_out_button').addEventListener('click', event =>  {
                localStorage.clear()
                window.location.href = '/auth/login'
            })
            document.querySelector('.account_delete').addEventListener('click', this.delete)
        } else {
            navlinks.insertAdjacentHTML('afterbegin', `
                <li><a href="/">Home</a></li>
                <li><a href="/auth/login">Sign in</a></li>
                <li><a href="/auth/register">Sign up</a></li>
            `)
        }
    }
}


const navbar = new Navbar()
