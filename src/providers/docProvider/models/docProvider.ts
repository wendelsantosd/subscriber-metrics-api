import { DocField } from './docFields';

export type ProcessedDoc = {
  Headers: DocField[];
  Data: string[][];
  isOk: boolean;
  message?: string;
};

export interface IDocProvider {
  generateToBlob(headers: DocField[], data: any[]): Blob;
  processDocFromString(docString: string): ProcessedDoc;
  prepareDocHeader(header: DocField): string;
  getDocHeader(header: string): DocField;
  prepareDocItem(header: DocField, data: any): string;
}
