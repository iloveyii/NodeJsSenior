export class DBHelper {
  public static getErrorMessage(code: string) {
    if (code.startsWith('P1')) {
      return 'Database error';
    }
    if (code.startsWith('P2')) {
      return 'Query error';
    }
    if (code.startsWith('P3')) {
      return 'Schema error';
    }
    if (code.startsWith('P5')) {
      return 'Database server error';
    }

    return 'Unknow database error';
  }
}
