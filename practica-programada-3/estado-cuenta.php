<?php
// en este arreglo almaceno las transacciones hechas con la tarjeta
$transacciones = [];
function registrarTransaccion($id, $descripcion, $monto)
{
    global $transacciones;
    // agrego la transacción al arreglo
    array_push($transacciones, [
        "id" => $id,
        "descripcion" => $descripcion,
        "monto" => $monto
    ]);
}
function generarEstadoDeCuenta()
{
    global $transacciones;
    // variables($) para calcular
    $montoTotalContado = 0;
    
    // echo =mostar
    //el end of line es para concatenar un espacio en blanco
    echo "DEtalle de Transacciones:" . PHP_EOL;
    foreach ($transacciones as $transaccion) {
        echo "ID: " . $transaccion['id'] . " - " . $transaccion['descripcion'] . " - Monto: $" . number_format($transaccion['monto'], 2) . PHP_EOL;
        $montoTotalContado += $transaccion['monto'];
    }
    
    // lo que debe detallar el estado de cuenta
    $interes = $montoTotalContado * 0.026;
    $cashback = $montoTotalContado * 0.001;
    $montoFinal = $montoTotalContado + $interes - $cashback;
    
    // Mostrar resumen del estado de cuenta
    echo "\nRESUMEN DEL ESTADO DE CUENTA:" . PHP_EOL;
    echo "Monto total de contado: $" . number_format($montoTotalContado, 2) . PHP_EOL;
    echo "Monto total con interés (2.6%): $" . number_format($montoTotalContado + $interes, 2) . PHP_EOL;
    echo "Cashback aplicado (0.1%): $" . number_format($cashback, 2) . PHP_EOL;
    echo "Monto final a pagar: $" . number_format($montoFinal, 2) . PHP_EOL;
    
    // guardar el txt
    $archivo = fopen("estado_cuenta.txt", "w") or die("No se puede abrir el archivo");
    fwrite($archivo, "Detalle de Transacciones:\n");
    foreach ($transacciones as $transaccion) {
        fwrite($archivo, "ID: " . $transaccion['id'] . " - " . $transaccion['descripcion'] . " - Monto: $" . number_format($transaccion['monto'], 2) . "\n");
    }
    fwrite($archivo, "\nRESUMEN DEL ESTADO DE CUENTA:\n");
    fwrite($archivo, "Monto total de contado: $" . number_format($montoTotalContado, 2) . "\n");
    fwrite($archivo, "Monto total con interés (2.6%): $" . number_format($montoTotalContado + $interes, 2) . "\n");
    fwrite($archivo, "Cashback aplicado (0.1%): $" . number_format($cashback, 2) . "\n");
    fwrite($archivo, "Monto final a pagar: $" . number_format($montoFinal, 2) . "\n");
    fclose($archivo);
    
    echo "\nEstado de cuenta generado y guardado en estado_cuenta.txt";
}
// simulacion de las transacciones:
registrarTransaccion(1, "MEGA SUPER SAN JOSÉ", 100.50);
registrarTransaccion(2, "UBER VIAJES", 15.99);
registrarTransaccion(3, "ECOMMERCE", 45.25);
registrarTransaccion(4, "Spotify", 80.00);

generarEstadoDeCuenta();
?>
