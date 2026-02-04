import { Controller, Post, Get, Body, Res, UseGuards, Req, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  private cookieOptions(@Req() req: Request, maxAge: number) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const origin = req.headers['origin'];
    const host = req.headers['host'] || '';
    const apiOrigin = isProduction ? `https://${host}` : `http://${host}`;
    const isCrossSite = origin && origin !== apiOrigin;
    // sameSite: 'none' requires secure: true (browsers reject otherwise). Use only in production cross-origin.
    const sameSite = isCrossSite && isProduction ? 'none' : 'lax';
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: sameSite as 'lax' | 'none',
      path: '/',
      maxAge,
    };
  }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async signup(
    @Body() signupDto: SignupDto,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, user } = await this.authService.signup(signupDto);

    response.cookie('easyauth_token', token, this.cookieOptions(req, 900000));

    return { user };
  }

  @Post('signin')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiResponse({ status: 200, description: 'User signed in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async signin(
    @Body() signinDto: SigninDto,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, user } = await this.authService.signin(signinDto);

    response.cookie('easyauth_token', token, this.cookieOptions(req, 900000));

    return { user };
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    response.cookie('easyauth_token', '', this.cookieOptions(req, 0));

    return { message: 'Logged out successfully' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@Req() req: Request) {
    return { user: req.user };
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Protected route example' })
  @ApiResponse({ status: 200, description: 'Access granted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async protected() {
    return { message: 'This is a protected route' };
  }
}
