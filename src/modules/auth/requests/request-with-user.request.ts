import { User } from '../../user/models/user.model';
import { FastifyRequest } from 'fastify';

interface RequestWithUser extends FastifyRequest {
  user: User;
}

export default RequestWithUser;
