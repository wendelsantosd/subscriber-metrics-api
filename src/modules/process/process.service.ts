import { Injectable } from '@nestjs/common';
import { makeDocProvider } from 'src/providers/docProvider/factories/docProvider';
import { DocField } from 'src/providers/docProvider/models/docFields';

type Request = {
  fileName: string;
  bufferedFileContent: Buffer;
};

type Response = {
  isOk: boolean;
  message?: string;
  data?: any;
};

@Injectable()
export class ProcessService {
  process(data: Request): Response {
    const stringifiedFileContent = data.bufferedFileContent.toString();

    if (!stringifiedFileContent)
      return {
        isOk: false,
        message: 'Conteúdo do arquivo em branco',
      };

    const docProvider = makeDocProvider();

    const processedDoc = docProvider.processDocFromString(
      stringifiedFileContent,
    );

    if (!processedDoc.isOk)
      return {
        isOk: false,
        message: processedDoc.message,
      };

    const { Headers: docHeaders, Data: docData } = processedDoc;

    const necessaryHeaders = docHeaders.filter(
      (i) =>
        i === DocField.AMOUNT_CHARGES ||
        i === DocField.CANCELLATION_DATE ||
        i === DocField.CHARGED_EVERY_X_DAYS ||
        i === DocField.NEXT_CYCLE ||
        i === DocField.PERIODICITY ||
        i === DocField.START_DATE ||
        i === DocField.STATUS ||
        i === DocField.STATUS_DATE ||
        i === DocField.SUBSCRIBER_ID ||
        i === DocField.VALUE,
    );

    if (necessaryHeaders.length !== 10)
      return {
        isOk: false,
        message:
          'O arquivo não possoi os headers necessários para ser processado',
      };

    const amountChargePos = docHeaders.indexOf(DocField.AMOUNT_CHARGES);
    const cancellationDatePos = docHeaders.indexOf(DocField.CANCELLATION_DATE);
    const chargedEveryXDaysPos = docHeaders.indexOf(
      DocField.CHARGED_EVERY_X_DAYS,
    );
    const nextCyclePos = docHeaders.indexOf(DocField.NEXT_CYCLE);
    const periodicityPos = docHeaders.indexOf(DocField.PERIODICITY);
    const startDatePos = docHeaders.indexOf(DocField.START_DATE);
    const statusPos = docHeaders.indexOf(DocField.STATUS);
    const statusDatePos = docHeaders.indexOf(DocField.STATUS_DATE);
    const subscriberIdPos = docHeaders.indexOf(DocField.SUBSCRIBER_ID);
    const valuePos = docHeaders.indexOf(DocField.VALUE);

    const listPayloads: any[] = [];

    for (const line of docData) {
      const payload = {
        amountCharge: line[amountChargePos],
        cancellationDate: line[cancellationDatePos],
        chargedEveryXDays: line[chargedEveryXDaysPos],
        nextCycle: line[nextCyclePos],
        periodicity: line[periodicityPos],
        startDate: line[startDatePos],
        status: line[statusPos],
        statusDate: line[statusDatePos],
        subscriberId: line[subscriberIdPos],
        value: line[valuePos],
      };

      listPayloads.push(payload);
    }

    return {
      isOk: true,
      data: listPayloads,
    };
  }
}
