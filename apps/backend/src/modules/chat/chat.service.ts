import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessagesByRoom(chatRoomId: string, userId: string) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    if (chatRoom.customerId !== userId && chatRoom.providerId !== userId) {
      throw new ForbiddenException('Access denied to this chat room');
    }

    return this.prisma.chatMessage.findMany({
      where: { chatRoomId },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            avatarUrl: true,
            profile: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async saveMessage(chatRoomId: string, senderId: string, content: string) {
    const chatRoom = await this.prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
    });

    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        chatRoomId,
        senderId,
        content,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            avatarUrl: true,
            profile: true,
          },
        },
      },
    });

    await this.prisma.chatRoom.update({
      where: { id: chatRoomId },
      data: { updatedAt: new Date() },
    });

    return message;
  }
}
