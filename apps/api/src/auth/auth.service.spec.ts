import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validatePassword', () => {
    it('should return true for valid password', async () => {
      const plainPassword = 'Password123!';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      const result = await service.validatePassword(plainPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for invalid password', async () => {
      const plainPassword = 'Password123!';
      const hashedPassword = await bcrypt.hash('WrongPassword123!', 10);
      const result = await service.validatePassword(plainPassword, hashedPassword);
      expect(result).toBe(false);
    });
  });

  describe('signup', () => {
    it('should create a new user and return token', async () => {
      const signupDto = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue({
        _id: 'user123',
        email: signupDto.email,
        name: signupDto.name,
      });
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.signup(signupDto);

      expect(result).toEqual({
        token: 'mock-jwt-token',
        user: {
          id: 'user123',
          email: signupDto.email,
          name: signupDto.name,
        },
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(signupDto.email);
      expect(mockUsersService.create).toHaveBeenCalled();
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      const signupDto = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'Password123!',
      };

      mockUsersService.findByEmail.mockResolvedValue({
        _id: 'existing-user',
        email: signupDto.email,
      });

      await expect(service.signup(signupDto)).rejects.toThrow(ConflictException);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(signupDto.email);
      expect(mockUsersService.create).not.toHaveBeenCalled();
    });
  });

  describe('signin', () => {
    it('should return token for valid credentials', async () => {
      const signinDto = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const hashedPassword = await bcrypt.hash(signinDto.password, 10);
      mockUsersService.findByEmail.mockResolvedValue({
        _id: 'user123',
        email: signinDto.email,
        name: 'Test User',
        password: hashedPassword,
      });
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.signin(signinDto);

      expect(result).toEqual({
        token: 'mock-jwt-token',
        user: {
          id: 'user123',
          email: signinDto.email,
          name: 'Test User',
        },
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(signinDto.email);
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const signinDto = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.signin(signinDto)).rejects.toThrow(UnauthorizedException);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(signinDto.email);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const signinDto = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      const hashedPassword = await bcrypt.hash('Password123!', 10);
      mockUsersService.findByEmail.mockResolvedValue({
        _id: 'user123',
        email: signinDto.email,
        password: hashedPassword,
      });

      await expect(service.signin(signinDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
