/**
 * Utilitários de validação e formatação
 */

// Validação de email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validação de CNPJ
export const validarCNPJ = (cnpj) => {
  const numeros = cnpj.replace(/\D/g, '');
  return numeros.length === 14;
};

// Formatação de CNPJ
export const formatarCNPJ = (valor) => {
  const numeros = valor.replace(/\D/g, '');
  return numeros
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substring(0, 18);
};

// Formatação de telefone
export const formatarTelefone = (valor) => {
  const numeros = valor.replace(/\D/g, '');
  return numeros
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .substring(0, 15);
};

// Tratamento de erros da API
export const tratarErroAPI = (error) => {
  if (error.code === 'NETWORK_ERROR' || !error.response) {
    return 'Sem conexão com o servidor. Verifique sua internet ou tente novamente mais tarde.';
  }
  return error.response?.data?.message || 'Erro desconhecido';
};