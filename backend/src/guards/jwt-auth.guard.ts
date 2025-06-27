import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
//this will add the payload of the token which contains userID and userRole to the request object that we can access every where
//check JWT strategy to understand how it is keeping the payload into the request object to make it accessible to all the routes
