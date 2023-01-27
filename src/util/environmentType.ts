import { AbstractCode } from './abstractCode';

export class EnvironmentType extends AbstractCode {
  static PROD = new EnvironmentType(1, 'production');
  static DEV = new EnvironmentType(2, 'dev');

  constructor(id: number, desc: string) {
    super(id, desc);
  }

  isProd() {
    return this == EnvironmentType.PROD;
  }
}

export const getEnvironmentType = () => {
  const env = process.env['NODE_ENV'];
  switch (env) {
    case 'production':
      return EnvironmentType.PROD;
    case 'development':
      return EnvironmentType.DEV;
    default:
      console.error(`Environment Type "${env}" not recognized!`);
      process.exit(1);
  }
};
