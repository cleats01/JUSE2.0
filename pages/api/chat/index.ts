import prisma from '../../../prisma/prisma';
import { NextApiRequest } from 'next';
import { getSession } from 'next-auth/react';
import { NextApiResponseServerIO } from '../../../types/chat';

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  const session = await getSession({ req });
  let user = null;
  if (session) {
    user = await prisma.user.findUnique({
      where: { id: session?.user.id },
    });
  }

  switch (req.method) {
    // 채팅방 리스트 불러오기
    case 'GET': {
      const chatListData = await prisma.chattingRoom.findMany({
        where: { id: { in: user?.chatList } },
      });
      return res.json(chatListData);
    }
    // 채팅방 만들기
    case 'POST': {
      const { membersId } = req.body;
      let chattingRoom = null;
      if (membersId) {
        // 기존 해당 유저와의 채팅방
        chattingRoom = await prisma.chattingRoom.findFirst({
          where: { membersId: { hasEvery: membersId } },
        });
        // 기존 채팅방이 없으면 새로 만든다.
        if (!chattingRoom) {
          const membersData = await prisma.user.findMany({
            where: { id: { in: membersId } },
            select: { id: true, nickname: true, image: true },
          });
          chattingRoom = await prisma.chattingRoom.create({
            data: { membersId, membersData },
          });
          // 유저들 데이터에 채팅방 id 추가
          await prisma.user.updateMany({
            where: { id: { in: membersId } },
            data: { chatList: { push: chattingRoom.id } },
          });
        }
      }
      // 해당 채팅방 데이터 출력
      return res.json(chattingRoom);
    }
    default:
      break;
  }
};
