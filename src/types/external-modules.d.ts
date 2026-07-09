declare module "@anthropic-ai/sdk" {
  export default class Anthropic {
    constructor(options?: Record<string, unknown>);
    messages: {
      create(input: Record<string, unknown>): Promise<{
        stop_reason?: string;
        content: Array<{ type: string; text?: string }>;
      }>;
    };
  }
}

declare module "officeparser" {
  export const OfficeParser: {
    parseOffice(buffer: Buffer, options: { fileType: string }): Promise<{ toText(): string }>;
  };
}

declare module "@prisma/adapter-better-sqlite3" {
  export class PrismaBetterSqlite3 {
    constructor(options: { url: string });
  }
}

declare module "../generated/prisma/client" {
  export class PrismaClient {
    constructor(options?: { adapter?: unknown });
    document: {
      create(input: Record<string, unknown>): Promise<{ id: string }>;
      findUnique(input: Record<string, unknown>): Promise<any>;
      findMany(input: Record<string, unknown>): Promise<any[]>;
    };
    studySet: {
      create(input: Record<string, unknown>): Promise<any>;
      findUnique(input: Record<string, unknown>): Promise<any>;
      findMany(input: Record<string, unknown>): Promise<any[]>;
    };
    quiz: {
      create(input: Record<string, unknown>): Promise<any>;
      findUnique(input: Record<string, unknown>): Promise<any>;
    };
    quizAttempt: {
      create(input: Record<string, unknown>): Promise<{ id: string }>;
    };
  }
}