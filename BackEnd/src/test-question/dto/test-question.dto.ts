import { TestQuestion } from "../entity/test-question.entity";
import { OmitType } from "@nestjs/swagger";
import { IsNumber, IsString, IsArray, IsObject, IsOptional } from "class-validator";

export class TestQuestionDto extends OmitType(TestQuestion, [
    'questionId',
    'testId',
    'cardId',
] as const) {

    @IsString()
    title: string;

    @IsArray()
    options: {
        cardId: number;
        content: string;
        type: string;
    }[];

    @IsObject()
    progress: {
        current: number;
        total: number;
    };
}

export class TestAnswerDto {
    @IsNumber()
    questionId: number;

    @IsNumber()
    selectedOptionIndex: number;

    @IsNumber()
    @IsOptional()
    timeSpent?: number;
}