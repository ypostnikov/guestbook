<?php
require __DIR__ . '/vendor/autoload.php';
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <script src="vendor/twbs/bootstrap/dist/js/bootstrap.min.js"></script>
        <link  href="vendor/twbs/bootstrap/dist/css/bootstrap.css" rel="stylesheet">
        <title>Гостевая книга</title>
    </head>
    <body>
        <div id ="id_wrapper" class="container">
            <div >
               <h4 class='heading'>Сообщения гостевой книги</h4>
               <div id="messagebook" class="bg-alert">
                   <table id="tBook" class ="table table-bordered">
                       <tbody id="tbodyEdit"></tbody>
                   </table>
               </div>
            </div>
            <div id="guestbook">               
                <form  id="formMessage" onsubmit="return false;">
                    <div class="form-group" >
                        <label for="formGroupExampleInput">Ваше Имя</label>
                        <input type="text" class="form-control" id="formGroupExampleInput"  required="required"  placeholder="Введите имя">
                    </div>
                    <div class="form-group">
                        <label for="exampleTextarea">Ваше сообщение</label>
                        <textarea class="form-control" id="exampleTextarea" required="required" rows="3"></textarea>
                    </div>
                    <button type="submit" id="btnSendItem" class="btn btn-primary">Добавить новое сообщение</button>
                </form>
                 <form  id="formAnswer" class="hidden"  onsubmit="return false;">
                    <div class="form-group" >
                        <label for="formGroupAnswerInput">Ваше Имя</label>
                        <input type="text" class="form-control" id="formGroupAnswerInput"  required="required"   placeholder="Введите имя">
                    </div>
                    <div class="form-group">
                        <label for="answerTextarea">Ваше сообщение</label>
                        <textarea class="form-control" id="answerTextarea" required="required" rows="3"></textarea>
                    </div>
                    <button type="submit" id="btnSendAnswer" class="btn btn-primary">Ответить на  сообщение</button>
                </form>
            </div>       
        </div>
        <!-- Modal -->
        <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">Предупреждение</h4>
                    </div>
                    <div class="modal-body">
                        Повторите отправку сообщения позже
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">Закрыть</button>
                    </div>
                </div>
            </div>
        </div>
        <script src="script/parser.js"></script>
    </body>
</html>
