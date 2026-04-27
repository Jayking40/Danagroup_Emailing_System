import { ClassConstructor, plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";

import { BadRequestException } from "@nestjs/common";

export function validateJobPayload<T extends object>(
  cls: ClassConstructor<T>,
  payload: unknown,
): T {
  const instance = plainToInstance(cls, payload);
  const errors = validateSync(instance as object, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (errors.length > 0) {
    const messages = errors
      .flatMap((error) => Object.values(error.constraints ?? {}))
      .filter(Boolean);

    throw new BadRequestException(
      `Invalid job payload: ${messages.join(", ") || "validation failed"}`,
    );
  }

  return instance as T;
}
