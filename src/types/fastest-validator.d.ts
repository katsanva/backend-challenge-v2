export as namespace fastest_validator;

interface ISchema {
  [key: string]: any;
}

interface IFieldValidationResult {
  type: string;
  field: string;
  message: string;
}

type ValidationResult = IFieldValidationResult[] | true;

declare class Validator {
  validate: (data: any, schema: ISchema) => ValidationResult;
  compile: (schema: ISchema) => (data: any) => ValidationResult;
}

export = Validator;
