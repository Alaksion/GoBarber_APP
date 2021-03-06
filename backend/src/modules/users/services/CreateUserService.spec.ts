import AppError from '@shared/errors/AppError';
import FakeUser from '@modules/users/repositories/Fakes/FakeUserRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUserRepository: FakeUser;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;

describe('Create user', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeHashProvider = new FakeHashProvider();
    fakeUserRepository = new FakeUser();
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('Should be able to create a new user', async () => {
    const newUser = await createUserService.execute({
      username: 'Lucca',
      password: '123456',
      email: 'luccab.souza@gmail.com',
    });
    await expect(newUser).toHaveProperty('id');
  });

  it('Should not be able to create two users with same e-mail', async () => {
    await createUserService.execute({
      username: 'Lucca',
      password: '123456',
      email: 'luccab.souza@2gmail.com',
    });
    await expect(
      createUserService.execute({
        username: 'Lucca',
        password: '123456',
        email: 'luccab.souza@2gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
