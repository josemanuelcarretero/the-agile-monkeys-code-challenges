export class SuccessResponse<T> {
  success: boolean;
  message: string;
  code: string;
  data: T;

  constructor(message: string, data: T) {
    this.success = true;
    this.message = message;
    this.code =
      message
        .toLowerCase()
        // Capitalize first letter of each word
        .replace(/(^\w)|(\s\w)/g, (match) => match.toUpperCase())
        // Remove spaces
        .replace(/ /g, '')
        // Remove special characters
        .replace(/[^a-zA-Z0-9]/g, '') + 'Response';
    this.data = data;
  }
}
