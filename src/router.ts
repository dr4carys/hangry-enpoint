import { userCreate, userLogin, userLogout } from './controller/user';
import { createTodo, getTodo, deleteTodo, updatedTodo } from './controller/todo';
import { authentication } from './middleware/bearer';
import { Paging } from './middleware/paging';
import Router from 'koa-router';
const router = new Router();

router.post('/me/createUser', userCreate);
router.post('/me/signIn', userLogin);
router.post('/todoCreate', authentication(), createTodo);
router.get('/getTodo', authentication(), Paging, getTodo);
router.patch('/deleteTodo', authentication(), deleteTodo);
router.patch('/updateTodo', authentication(), updatedTodo);
router.patch('/me/signout', authentication(), userLogout);

export = router;
