// To bypass typescript error about this module
declare module "jest-mock-axios" {
  function reset(): void;
  function mockError(): void;
  function mockResponse(response?: { data: Object }): void;
}
