import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private logger = new Logger(AwsService.name);

  public async uploadArquivo(file: any, id: string) {
    const s3 = new AWS.S3({
      region: 'sa-east-1',
      accessKeyId: 'KEY', //ACCESS_KEY_ID
      secretAccessKey: 'KEY', //SECRETE_ACCESS_KEY
    });

    const fileExtension = file.originalname.split('.')[1];
    const urlKey = `${id}.${fileExtension}`;
    this.logger.log(`urlKey: ${urlKey}`);

    const params = {
      Body: file.buffer,
      Bucket: 'smartranking',
      Key: urlKey,
    };

    const data = s3
      .putObject(params)
      .promise()
      .then(
        (data) => {
          return {
            url: `https://smartranking.s3-sa-east-1.amazonaws.com/${urlKey}`,
          };
        },
        (err) => {
          this.logger.error(err);
          return err;
        },
      );

    return data;
  }
}
