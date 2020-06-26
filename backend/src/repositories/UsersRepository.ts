import { Repository, EntityRepository } from 'typeorm';
import User from '../models/Users';

@EntityRepository(User)
class UserRepository extends Repository<User> {}

export default UserRepository;
