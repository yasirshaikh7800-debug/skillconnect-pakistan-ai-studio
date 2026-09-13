import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('rooms/:roomId/messages')
  @ApiOperation({ summary: 'Get message history for a chat room' })
  async getRoomMessages(
    @Param('roomId') roomId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.chatService.getMessagesByRoom(roomId, userId);
  }
}
