
import { UserController } from '../controllers/user.controller';
import { RequestController } from '../controllers/request.controller';

// Initialize Controllers
export const userController = new UserController();
export const requestController = new RequestController();

// Route Dictionary (Conceptual)
export const Routes = {
    Users: {
        LOGIN: '/api/users/login',
        REGISTER: '/api/users/register',
        GET_ALL: '/api/users'
    },
    Requests: {
        GET_ALL: '/api/requests',
        CREATE: '/api/requests/create',
        UPDATE: '/api/requests/update',
        DELETE: '/api/requests/delete'
    }
};
