import { Injectable } from '@nestjs/common';
import { CreateUserStatDto } from './dto/create-user-stat.dto';
import { UpdateUserStatDto } from './dto/update-user-stat.dto';

@Injectable()
export class UserStatsService {
  create(createUserStatDto: CreateUserStatDto) {
    return 'This action adds a new userStat';
  }

  findAll() {
    return `This action returns all userStats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userStat`;
  }

  update(id: number, updateUserStatDto: UpdateUserStatDto) {
    return `This action updates a #${id} userStat`;
  }

  remove(id: number) {
    return `This action removes a #${id} userStat`;
  }
}
