import { FromDocString, ToDocBlob } from 'src/helpers/doc.helper';
import { DocField } from '../models/docFields';
import { IDocProvider, ProcessedDoc } from '../models/docProvider';

export class DocProvider implements IDocProvider {
  public generateToBlob(headers: DocField[], data: any[]): Blob {
    const docHeaders = headers.map((ho: DocField) => this.prepareDocHeader(ho));
    const docContent = data.map((c) =>
      headers.map((ho: DocField) => this.prepareDocItem(ho, c)),
    );

    const docBlob = ToDocBlob(docHeaders, docContent);

    return docBlob;
  }

  public processDocFromString(docString: string): ProcessedDoc {
    const unstringifiedDoc = FromDocString(docString);

    if (!unstringifiedDoc.length)
      return {
        isOk: false,
        message: 'Não há conteúdo no documento',
        Data: ['null']['null'],
        Headers: [],
      };

    const docHeaders = unstringifiedDoc[0]?.map((i) => this.getDocHeader(i));

    const docData: string[][] = [];

    if (!docHeaders || !docHeaders.length)
      return {
        isOk: false,
        message: 'Há headers incorretos',
        Data: ['null']['null'],
        Headers: [],
      };

    unstringifiedDoc.forEach((el, index) => {
      if (index)
        docData.push(
          el.length < docHeaders.length
            ? [
                ...el,
                ...Array.from({ length: docHeaders.length - el.length }).map(
                  () => '',
                ),
              ]
            : el,
        );
    });

    if (!docData.length)
      return {
        isOk: false,
        message: 'O documento não tem linhas.',
        Data: ['null']['null'],
        Headers: [],
      };

    return {
      Headers: docHeaders,
      Data: docData,
      isOk: true,
    };
  }

  prepareDocHeader(header: DocField): string {
    switch (header) {
      case DocField.AMOUNT_CHARGES:
        return 'quantidade cobranças';
      case DocField.CANCELLATION_DATE:
        return 'data cancelamento';
      case DocField.CHARGED_EVERY_X_DAYS:
        return 'cobrada a cada X dias';
      case DocField.NEXT_CYCLE:
        return 'próximo ciclo';
      case DocField.PERIODICITY:
        return 'periodicidade';
      case DocField.START_DATE:
        return 'data início';
      case DocField.STATUS:
        return 'status';
      case DocField.STATUS_DATE:
        return 'data status';
      case DocField.SUBSCRIBER_ID:
        return 'ID assinante';
      case DocField.VALUE:
        return 'valor';
      default:
        return 'N/A';
    }
  }

  prepareDocItem(header: DocField, data: any): string {
    switch (header) {
      case DocField.AMOUNT_CHARGES:
        return data.amountCharge;
      case DocField.CANCELLATION_DATE:
        return data.cancellationDate;
      case DocField.CHARGED_EVERY_X_DAYS:
        return data.chargedEveryXDays;
      case DocField.NEXT_CYCLE:
        return data.nextCycle;
      case DocField.PERIODICITY:
        return data.periodicity;
      case DocField.START_DATE:
        return data.startDate;
      case DocField.STATUS:
        return data.status;
      case DocField.STATUS_DATE:
        return data.statusDate;
      case DocField.SUBSCRIBER_ID:
        return data.subscriberId;
      case DocField.VALUE:
        return data.value;
      default:
        return 'N/A';
    }
  }

  public getDocHeader(header: string): DocField {
    const record: Record<string, DocField> = {
      periodicidade: DocField.PERIODICITY,
      'quantidade cobranças': DocField.AMOUNT_CHARGES,
      'cobrada a cada X dias': DocField.CHARGED_EVERY_X_DAYS,
      'data início': DocField.START_DATE,
      status: DocField.STATUS,
      'data status': DocField.STATUS_DATE,
      'data cancelamento': DocField.CANCELLATION_DATE,
      valor: DocField.VALUE,
      'próximo ciclo': DocField.NEXT_CYCLE,
      'ID assinante': DocField.SUBSCRIBER_ID,
    };

    return record[header.replace(/['"]+/g, '')] || DocField.NA;
  }
}
