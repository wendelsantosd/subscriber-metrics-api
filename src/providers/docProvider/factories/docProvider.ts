import { DocProvider } from '../implementations/docProvider';
import { IDocProvider } from '../models/docProvider';

export const makeDocProvider = (): IDocProvider => new DocProvider();
