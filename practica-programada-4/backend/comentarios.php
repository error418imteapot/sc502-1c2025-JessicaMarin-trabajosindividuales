<?php
// inicio sesiom
session_start();
// conexión a la db
require_once("db.php");
if (!isset($_SESSION["user_id"])) {
    http_response_code(401);
    echo json_encode(["mensaje" => "Inicie sesion"]);
    exit();
}

// obtener el mtodo de la solicitud
$method = $_SERVER['REQUEST_METHOD'];
// manejo aqui las solicitudes según el método
switch ($method) {
    case 'GET':
        obtenerComentarios();
        break;
    case 'POST':
        agregarComentario();
        break;
    case 'PUT':
        actualizarComentario();
        break;
    case 'DELETE':
        eliminarComentario();
        break;
    default:
        http_response_code(405);
        echo json_encode(["mensaje" => "Método no permitido"]);
        break;
}
/// listar comentarios de una tarea
function obtenerComentarios()
{
    global $conn;
    $task_id = $_GET['task_id'] ?? null;

    if (!$task_id) {
        echo json_encode(["mensaje" => "Debe indicar el id de la tarea"]);
        return;
    }

    $stmt = $conn->prepare("SELECT * FROM comentarios WHERE task_id = ?");
    $stmt->bind_param("i", $task_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $comentarios = $result->fetch_all(MYSQLI_ASSOC);

    echo json_encode($comentarios);
}
// agregar nuevo comentario
function agregarComentario()
{
    global $conn;

    $data = json_decode(file_get_contents("php://input"), true);
    $task_id = $data["task_id"] ?? null;
    $contenido = $data["contenido"] ?? null;

    if (!$task_id || !$contenido) {
        echo json_encode(["mensaje" => "Datos incompletos"]);
        return;
    }
    $stmt = $conn->prepare("INSERT INTO comentarios (task_id, contenido) VALUES (?, ?)");
    $stmt->bind_param("is", $task_id, $contenido);
    if ($stmt->execute()) {
        echo json_encode(["mensaje" => "Comentario agregado"]);
    } else {
        echo json_encode(["mensaje" => "Error al agregar comentario"]);
    }
}
// actualizar comentario exiatente
function actualizarComentario()
{
    global $conn;

    parse_str(file_get_contents("php://input"), $data);
    $id = $data["id"] ?? null;
    $contenido = $data["contenido"] ?? null;

    if (!$id || !$contenido) {
        echo json_encode(["mensaje" => "Datos incompletos"]);
        return;
    }
    $stmt = $conn->prepare("UPDATE comentarios SET contenido = ? WHERE id = ?");
    $stmt->bind_param("si", $contenido, $id);
    if ($stmt->execute()) {
        echo json_encode(["mensaje" => "Comentario actualizado"]);
    } else {
        echo json_encode(["mensaje" => "Error al actualizar comentario"]);
    }
}
// eliminar comentario
function eliminarComentario()
{
    global $conn;

    parse_str(file_get_contents("php://input"), $data);
    $id = $data["id"] ?? null;
    if (!$id) {
        echo json_encode(["mensaje" => "id no especificado"]);
        return;
    }
    $stmt = $conn->prepare("DELETE FROM comentarios WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(["mensaje" => "Comentario eliminado"]);
    } else {
        echo json_encode(["mensaje" => "Error eliminando comentario"]);
    }
}
?>
