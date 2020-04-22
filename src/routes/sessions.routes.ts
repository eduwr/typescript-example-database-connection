import { Router } from 'express';

import AuthenticateUserService from '../services/AuthenticateUserService';
import { AuthCredentialsDto } from '../utils/dto/authCredentialsDto';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  const authCredentialsDto: AuthCredentialsDto = request.body;

  const authenticateUser = new AuthenticateUserService();

  const { user, token } = await authenticateUser.execute(authCredentialsDto);

  delete user.password;
  delete user.salt;

  return response.json({ user, token });
});

export default sessionsRouter;
