import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(resource: string, identifier?: string | number) {
    const message =
      identifier !== undefined
        ? `${resource} with identifier '${String(identifier)}' not found`
        : `${resource} not found`;
    super(message);
  }
}
