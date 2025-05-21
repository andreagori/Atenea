// filepath: c:\Users\andyt\Documents\Github\Atenea_AW\BackEnd\src\cloudinary\cloudinary.service.ts
import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
    constructor(@Inject('CLOUDINARY') private cloudinary: typeof import('cloudinary').v2) { }


    async uploadImage(
        file: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        if (!file.mimetype.startsWith('image/')) {
            throw new BadRequestException('El archivo debe ser una imagen');
        }

        try {
            return new Promise((resolve, reject) => {
                const upload = this.cloudinary.uploader.upload_stream(
                    {
                        folder: 'visual_cards',
                        resource_type: 'auto',
                        allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
                        max_bytes: 10485760, // 10MB
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error('No se recibió resultado del servidor de Cloudinary'));
                        resolve(result);
                    }

                );

                Readable.from(file.buffer).pipe(upload);
            });
        } catch (error) {
            throw new BadRequestException('Error al subir la imagen: ' + error.message);
        }
    }

    async deleteImage(publicId: string): Promise<void> {
        try {
            await this.cloudinary.uploader.destroy(publicId);
        } catch (error) {
            throw new BadRequestException('Error al eliminar la imagen: ' + error.message);
        }
    }
}