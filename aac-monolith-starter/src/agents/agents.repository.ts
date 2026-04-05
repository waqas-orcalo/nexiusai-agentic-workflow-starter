import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../common/repositories/abstract.repository';
import { Agent, AgentDocument } from './schemas/agent.schema';

@Injectable()
export class AgentRepository extends AbstractRepository<AgentDocument> {
  constructor(
    @InjectModel(Agent.name) private readonly agentModel: Model<AgentDocument>,
  ) {
    super(agentModel);
  }
}
