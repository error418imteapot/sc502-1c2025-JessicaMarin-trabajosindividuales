document.addEventListener('DOMContentLoaded', function(){
    const form = document.getElementById('loginForm');
    const loginError = document.getElementById('login-error');

    form.addEventListener('submit', async function(e){
        e.preventDefault();

        //obtenemos el mail y password 
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
 
        //busca el archivo .php con el metodo post y el header
        //el codigo de js se detiene para hacer la solicitud, mientras espera respuesta
        const response = await fetch('backend/login.php',{
            method: 'POST',
            headers:{
                //con el formato de tipo de dato que se va a enviar
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({email: email, password: password})
        });
        //obtenemos la respuesta del servidor en json
        const result = await response.json();

        if(response.ok){
            //login exitoso
            window.location.href ='dashboard.html';
        }else{
            loginError.style.display = 'block';
            loginError.textContent = result.error;
        }

        // if(email === 'test@example.com' && password === 'password123'){
        //     window.location.href ='dashboard.html';
        // }else{
        //     loginError.style.display = 'block';
        // }

    });
})