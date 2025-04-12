<?php
//con esto en todos los archivos dependenmos de la conexion a la base de datos
require('db.php');

//entre parentesis los parametros que recibe
function userRegistry($username, $password, $email){
    //por si hay un error todo dentro de un try catch
    try{
        //vamos a usar la variable pdo global porque se accede de cualquier lado
        global $pdo;
        //encripta la clave
        $passwordHashed = password_hash($password, PASSWORD_BCRYPT);
        //en este insert los values los definimos luego cuando ejecutamos
        $sql = "INSERT INTO USERS (username, password, email) values (:username, :password, :email)";
        $stmt = $pdo -> prepare($sql);
        $stmt -> execute(params: ['username' => $username, 'password' => $passwordHashed, 'email' => $email]);
        return "User registered";
        
    }catch(Exception $e){

    }
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    if (isset($_POST['email']) && isset($_POST['password'])) {
        //logica para manejar el post. los datos van a llegar en formato "formulario" no en JSON
        $username = $_POST['email'];
        $password = $_POST['password'];
        if (userRegistry($username, $password, $username)) {
            http_response_code(200);
            echo json_encode(["message" => "Registro de usuario exitoso"]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => "Error al registrar usuario"]);
        }
    }else{
        http_response_code(400);
        echo json_encode(["error" => "email y password son requeridos"]);
    }
} else {
    http_response_code(response_code: 405);//metodo no permitido
    echo json_encode(["error" => "Metodo no permitido"]);
}