/**
 * Official Banco Central do Brasil EMV BR Code / Pix Copia e Cola Generator
 * Generates valid Pix payload with pre-defined fixed transaction amount and CRC16 checksum.
 */

// CRC16 CCITT polynomial 0x1021 calculation for EMV BR Code
function calculateCRC16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Helper to format TLV (Type-Length-Value)
function formatTLV(id, value) {
  const len = String(value.length).padStart(2, '0');
  return `${id}${len}${value}`;
}

// Clean text for EMV (ASCII characters only, max length)
function sanitizeText(str, maxLength = 25) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-zA-Z0-9 ]/g, '') // keep alphanumeric
    .substring(0, maxLength)
    .toUpperCase();
}

/**
 * Generates official Pix Copia e Cola EMV String with locked amount
 * @param {string} pixKey - Pix Key (E-mail, CNPJ, Phone, Random Key)
 * @param {number} amount - Exact transaction amount (e.g. 15.95)
 * @param {string} receiverName - Name of beneficiary (max 25 chars)
 * @param {string} city - Beneficiary city (max 15 chars)
 * @param {string} txId - Transaction ID / Order reference
 */
export function generatePixPayload({ pixKey, amount, receiverName = 'XM CALCADOS', city = 'SAO PAULO', txId = '***' }) {
  const cleanKey = pixKey ? pixKey.trim() : 'atendimento@xmcalcados.com.br';
  const cleanAmount = Number(amount || 0).toFixed(2);
  const cleanName = sanitizeText(receiverName || 'XM CALCADOS', 25);
  const cleanCity = sanitizeText(city || 'SAO PAULO', 15);
  const cleanTxId = sanitizeText(txId || '***', 25);

  // Merchant Account Info (ID 26)
  const gui = formatTLV('00', 'br.gov.bcb.pix');
  const key = formatTLV('01', cleanKey);
  const merchantAccountInfo = formatTLV('26', `${gui}${key}`);

  // Merchant Category Code (ID 52)
  const mcc = formatTLV('52', '0000');

  // Transaction Currency BRL (ID 53) - 986 = BRL
  const currency = formatTLV('53', '986');

  // Transaction Amount (ID 54)
  const transactionAmount = formatTLV('54', cleanAmount);

  // Country Code BR (ID 58)
  const countryCode = formatTLV('58', 'BR');

  // Merchant Name (ID 59)
  const merchantName = formatTLV('59', cleanName);

  // Merchant City (ID 60)
  const merchantCity = formatTLV('60', cleanCity);

  // Additional Data Field Template (ID 62) -> TxID (ID 05)
  const txIdField = formatTLV('05', cleanTxId);
  const additionalDataField = formatTLV('62', txIdField);

  // Payload Format Indicator (ID 00) + Point of Initiation (ID 01)
  const pfi = formatTLV('00', '01');
  const poi = formatTLV('01', '12'); // Dynamic QR Code with fixed amount

  // Assemble full payload string before CRC
  const rawPayload = `${pfi}${poi}${merchantAccountInfo}${mcc}${currency}${transactionAmount}${countryCode}${merchantName}${merchantCity}${additionalDataField}6304`;

  // Calculate CRC16 checksum
  const crc16 = calculateCRC16(rawPayload);

  return `${rawPayload}${crc16}`;
}
