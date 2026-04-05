import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { AgentRepository } from './agents.repository';
import { Agent, AgentSchema } from './schemas/agent.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Agent.name, schema: AgentSchema }]),
  ],
  controllers: [AgentsController],
  providers: [AgentsService, AgentRepository],
  exports: [AgentRepository, AgentsService],
})
export class AgentsModule {}
