import { Injectable } from '@nestjs/common';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { UpdateStudySessionDto } from './dto/update-study-session.dto';

@Injectable()
export class StudySessionsService {
  create(createStudySessionDto: CreateStudySessionDto) {
    return 'This action adds a new studySession';
  }

  findAll() {
    return `This action returns all studySessions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} studySession`;
  }

  update(id: number, updateStudySessionDto: UpdateStudySessionDto) {
    return `This action updates a #${id} studySession`;
  }

  remove(id: number) {
    return `This action removes a #${id} studySession`;
  }
}
