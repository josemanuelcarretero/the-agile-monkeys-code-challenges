import { SuccessResponse } from '../../common/responses/success.response';

export class UploadResponse extends SuccessResponse<string>(
  String,
  'Upload successfully',
) {
  constructor(url: string) {
    super(url);
  }
}
