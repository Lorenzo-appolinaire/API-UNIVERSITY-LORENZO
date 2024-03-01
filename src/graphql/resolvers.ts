import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    getSession: async (_: any, { sessionId }: { sessionId: number }) => {
      return prisma.session.findUnique({
        where: {
          id: sessionId,
        },
      });
    },
    getUserSessions: async (_: any, { userId }: { userId: number }) => {
      return prisma.session.findMany({
        where: {
          userId: userId,
        },
      });
    },
  },
  Mutation: {
    createRole: async (
      _: any,
      { name, description }: { name: string; description?: string }
    ) => {
      return prisma.role.create({
        data: {
          name,
          description: description || "",
        },
      });
    },
    editRole: async (
      _: any,
      {
        id,
        name,
        description,
      }: { id: string; name: string; description?: string }
    ) => {
      const intId = parseInt(id, 10);
      return prisma.role.update({
        where: {
          id: intId,
        },
        data: {
          name,
          description,
        },
      });
    },
    deleteRole: async (_: any, { id }: { id: string }) => {
      const intId = parseInt(id, 10);
      return prisma.role.delete({
        where: {
          id: intId,
        },
      });
    },
    createUser: async (
      _: any,
      { username, email }: { username: string; email?: string }
    ) => {
      try {
        const newUser = await prisma.user.create({
          data: {
            username,
            email: email || "",
          },
        });
        return newUser;
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
      }
    },
    deleteUser: async (_: any, { id }: { id: string }) => {
      const intId = parseInt(id, 10);
      return prisma.user.delete({
        where: {
          id: intId,
        },
      });
    },
    editUser: async (
      _: any,
      { id, username, email }: { id: number; username: string; email: string }
    ) => {
      return prisma.user.update({
        where: {
          id,
        },
        data: {
          username,
          email,
        },
      });
    },
    createUserSession: async (
      _: any,
      {
        userId,
        startTime,
        endTime,
      }: { userId: string; startTime: string; endTime?: string }
    ) => {
      const intId = parseInt(userId, 10);
      return prisma.session.create({
        data: {
          userId: intId,
          startTime,
          endTime,
        },
      });
    },
    deleteSession: async (_: any, { sessionId }: { sessionId: number }) => {
      return prisma.session.delete({
        where: {
          id: sessionId,
        },
      });
    },
    getSessionDataWithoutUser: async (
      _: any,
      { sessionId }: { sessionId: number }
    ) => {
      return prisma.session.findUnique({
        where: {
          id: sessionId,
        },
      });
    },
    getSessionDataWithUserAndRoles: async (
      _: any,
      { sessionId }: { sessionId: number }
    ) => {
      try {
        // Fetch session data including user and roles
        const sessionWithUserAndRoles = await prisma.session.findUnique({
          where: {
            id: sessionId,
          },
          include: {
            user: {
              select: {
                roles: true,
              },
            },
          },
        });

        if (!sessionWithUserAndRoles) {
          throw new Error("Session not found");
        }

        return sessionWithUserAndRoles;
      } catch (error) {
        console.error(
          "Error fetching session data with user and roles:",
          error
        );
        throw new Error("Failed to fetch session data with user and roles");
      }
    },
  },
};

export default resolvers;
