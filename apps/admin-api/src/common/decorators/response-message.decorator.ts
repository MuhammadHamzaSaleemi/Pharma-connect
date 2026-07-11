import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_KEY = 'responseMessage';

export const ResponseMessage = (message: string): MethodDecorator & ClassDecorator =>
  SetMetadata(RESPONSE_MESSAGE_KEY, message);
