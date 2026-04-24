// utils/formatPhone.js
export const formatPhone = (phone) => {
  if (!phone) return null;

  // Remove spaces, dashes, brackets, etc.
  phone = phone.replace(/\D/g, "");

  // 2547XXXXXXXX → +2547XXXXXXXX
  if (phone.startsWith("254") && phone.length === 12) {
    return "+" + phone;
  }

  // 07XXXXXXXX → +2547XXXXXXXX
  if (phone.startsWith("0") && phone.length === 10) {
    return "+254" + phone.slice(1);
  }

  // 7XXXXXXXX → +2547XXXXXXXX
  if (phone.length === 9) {
    return "+254" + phone;
  }

  return null; // ❗ reject invalid numbers
};