
export type AccountType = 'individual' | 'association' | 'large_condominium';

export interface AccountTypeInfo {
  id: AccountType;
  label: string;
  limit: number;
  description: string;
  currency: string;
}

export const ACCOUNT_TYPES: Record<AccountType, AccountTypeInfo> = {
  individual: {
    id: 'individual',
    label: 'Individual',
    limit: 22950,
    description: 'Individual Livret A account',
    currency: 'EUR'
  },
  association: {
    id: 'association',
    label: 'Association',
    limit: 76500,
    description: 'Association & Condominium associations',
    currency: 'EUR'
  },
  large_condominium: {
    id: 'large_condominium',
    label: 'Large Condominium',
    limit: 100000,
    description: 'Condominium associations with >100 units',
    currency: 'EUR'
  }
};

export const getAccountTypeInfo = (type: AccountType): AccountTypeInfo => {
  return ACCOUNT_TYPES[type];
};

export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency
  }).format(amount);
};
