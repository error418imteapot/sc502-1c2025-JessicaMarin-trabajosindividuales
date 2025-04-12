<?php
require('../login.php');

if(login("user@gmail.com","123")){
    echo 'Login exitoso' . PHP_EOL;
}else{
    echo 'Login incorrecto' . PHP_EOL;
}


if(login("asdadad", "asdads")){
    echo 'Login exitoso' . PHP_EOL;
}else{
    echo 'Login incorrecto' . PHP_EOL;
}