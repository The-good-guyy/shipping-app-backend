type Gte = {
  gte: string;
};
type Lte = {
  lte: string;
};
type Lt = {
  lt: string;
};
type Gt = {
  gt: string;
};
export class searchUserFilterDto {
  id?: string;
  username?: string;
  email?: string;
  isVerified?: boolean | string;
  createdAt?: Gte | Lte | Lt | Gt | string;
  updatedAt?: Gte | Lte | Lt | Gt | string;
}
