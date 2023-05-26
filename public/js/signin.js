const signupForm = document.querySelector('.loginForm');
const feedbackElement = document.querySelector('.feedback');

const signup = async user => {
    const res = await fetch('/user-signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user
        })
    });
    
    const result = await(res.json());
    
    showFeedback(result.status, result.code, feedbackElement, true);
};

signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const user = {
        username: signupForm.username.value,
        password: signupForm.password.value,
    };

    signup(user);
});