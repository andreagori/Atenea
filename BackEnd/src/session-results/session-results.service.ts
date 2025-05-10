import { Injectable } from '@nestjs/common';
import { CreateSessionResultDto } from './dto/create-session-result.dto';
import { UpdateSessionResultDto } from './dto/update-session-result.dto';

@Injectable()
export class SessionResultsService {
  create(createSessionResultDto: CreateSessionResultDto) {
    return 'This action adds a new sessionResult';
  }

  findAll() {
    return `This action returns all sessionResults`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sessionResult`;
  }

  update(id: number, updateSessionResultDto: UpdateSessionResultDto) {
    return `This action updates a #${id} sessionResult`;
  }

  remove(id: number) {
    return `This action removes a #${id} sessionResult`;
  }
}
