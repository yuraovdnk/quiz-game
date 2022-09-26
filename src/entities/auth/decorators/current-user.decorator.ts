import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import mongoose from 'mongoose';
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return new mongoose.Types.ObjectId(request.user._id);
});
